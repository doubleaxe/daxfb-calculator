/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {SavedBlueprint} from './saved-blueprint';
import {decode, encode, fromUint8Array, toUint8Array} from 'js-base64';
import {deflate, inflate} from 'pako';
import {dataProvider} from '../data/data';
import type {Values} from '../types';
import type {ErrorCollector} from '../error-collector';

const HEADER_HEADER = 'DAXFB';

const HEADER_FOOTER = {
    COMPRESSED: 'C',
    ENCODED: 'B',
    JSON: 'J',
} as const;
const FOOTERS = new Set<string>(Object.values(HEADER_FOOTER));
const GAME_HEADER = dataProvider.getDescription().SaveHeaderParsed;
const HEADER_SEPARATOR = '$';

function buildHeader(footer: Values<typeof HEADER_FOOTER>) {
    return HEADER_HEADER + GAME_HEADER + footer + HEADER_SEPARATOR;
}

const HEADER_LENGTH = buildHeader(HEADER_FOOTER.JSON).length;

type EncoderOptions = {
    blueprintCompress: boolean;
    blueprintEncode: boolean;
    blueprintSplit: number;
};

export class BlueprintEncoder {
    private readonly _options;
    constructor(options: EncoderOptions) {
        this._options = options;
    }

    encode(savedBlueprint: SavedBlueprint) {
        const data = JSON.stringify(savedBlueprint);
        let encoded: string | undefined;
        if(this._options.blueprintCompress) {
            const compressed = deflate(data, {level: 9});
            encoded = buildHeader(HEADER_FOOTER.COMPRESSED) + fromUint8Array(compressed, true);
        } else if(this._options.blueprintEncode) {
            encoded = buildHeader(HEADER_FOOTER.ENCODED) + encode(data, true);
        } else {
            //no need for header, it will be decoded automatically
            encoded = data;
        }
        return encoded || '';
    }
    split(encoded: string) {
        if(!this._options.blueprintCompress && !this._options.blueprintEncode)
            return encoded;
        const size = this._options.blueprintSplit;
        if(size <= 0)
            return encoded;
        const numChunks = Math.ceil(encoded.length / size);
        const chunks = new Array<string>(numChunks);
        for(let i = 0, o = 0; i < numChunks; ++i, o += size) {
            chunks[i] = encoded.substring(o, size + o);
        }
        return chunks.join('\n');
    }
}

export class BlueprintDecoder {
    private readonly _errorCollector;
    constructor(errorCollector: ErrorCollector) {
        this._errorCollector = errorCollector;
    }

    decode(encoded: string) {
        const savedBlueprint = this._decode(encoded);
        if(savedBlueprint) {
            if(typeof(savedBlueprint) == 'object') {
                const _savedBlueprint = savedBlueprint as SavedBlueprint;
                if(_savedBlueprint.h?.g && (_savedBlueprint.h?.g != GAME_HEADER)) {
                    this.logError(new Error(`Invalid game, expecting "${GAME_HEADER}", got "${_savedBlueprint.h.g}"`));
                } else {
                    return _savedBlueprint;
                }
            } else {
                this.logError(new Error(`Invalid saved JSON type, expected "object", got "${typeof(savedBlueprint)}"`));
            }
        }
        return undefined;
    }
    private static _parseHeader(encoded: string) {
        const fullHeader = encoded.substring(0, HEADER_LENGTH);
        if(fullHeader.charAt(HEADER_LENGTH - 1) != HEADER_SEPARATOR) {
            return undefined;
        }
        const header = fullHeader.substring(0, HEADER_HEADER.length);
        if(header != HEADER_HEADER) {
            throw new Error(`Invalid header, expecting "${HEADER_HEADER}", got "${header}" for "${fullHeader}"`);
        }
        const game = fullHeader.substring(HEADER_HEADER.length, HEADER_HEADER.length + GAME_HEADER.length);
        if(game != GAME_HEADER) {
            throw new Error(`Invalid game, expecting "${GAME_HEADER}", got "${game}" for "${fullHeader}"`);
        }
        const type = fullHeader.substring(HEADER_LENGTH - 2, HEADER_LENGTH - 1);
        if(!FOOTERS.has(type)) {
            throw new Error(`Invalid type, expecting one of "${[...FOOTERS].join(',')}", got "${type}" for "${fullHeader}"`);
        }
        return {
            type,
            rawEncoded: encoded.substring(HEADER_LENGTH),
        };
    }
    private _decode(encoded: string) {
        encoded = encoded.replace(/\n/g, '');
        let rawEncoded = '';
        try {
            const header = BlueprintDecoder._parseHeader(encoded);
            if(header) {
                rawEncoded = header.rawEncoded;
                switch(header.type) {
                    case HEADER_FOOTER.COMPRESSED:
                        {
                            const decompressed = this.loadCompressed(rawEncoded);
                            if(decompressed) {
                                return JSON.parse(decompressed);
                            }
                        }
                        break;
                    case HEADER_FOOTER.ENCODED:
                        return JSON.parse(this.loadEncoded(rawEncoded));
                    case HEADER_FOOTER.JSON:
                        return JSON.parse(rawEncoded);
                    default:
                        throw new Error(`Invalid type, expecting one of "${[...FOOTERS].join(',')}", got "${header.type}"`);
                }
            }
        } catch(err) {
            this.logError(err);
            return this.fallbackDecode(encoded, rawEncoded);
        }
        return this.fallbackDecode(encoded, rawEncoded);
    }
    private fallbackDecode(encoded: string, rawEncoded: string) {
        try {
            if(encoded.charAt(0) == '{')
                return JSON.parse(encoded);
            if(rawEncoded.charAt(0) == '{')
                return JSON.parse(rawEncoded);

            if(encoded.charAt(0) == 'e')
                return JSON.parse(this.loadEncoded(encoded));
            if(rawEncoded.charAt(0) == 'e')
                return JSON.parse(this.loadEncoded(rawEncoded));
        } catch(err) {
            this.logError(err);
        }
        let decompressed = this.loadCompressed(encoded);
        if(!decompressed) {
            decompressed = this.loadCompressed(rawEncoded);
        }
        if(decompressed) {
            try {
                return JSON.parse(decompressed);
            } catch(err) {
                this.logError(err);
            }
        }
        return undefined;
    }

    logError(err: unknown) {
        this._errorCollector.collectError(err);
    }

    private loadCompressed(encoded: string) {
        try {
            const compressed = toUint8Array(encoded);
            return inflate(compressed, {to: 'string'});
        } catch(err) {
            this.logError(['Decompression error', err]);
        }
        return '';
    }

    private loadEncoded(encoded: string) {
        return decode(encoded);
    }
}

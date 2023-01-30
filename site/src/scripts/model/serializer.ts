/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {SavedBlueprint} from './saved-blueprint';
import {decode, encode, fromUint8Array, toUint8Array} from 'js-base64';
import {deflate, inflate} from 'pako';
import {log, LOG} from '../debug';

const RAW_HEADER = 'DFGC';

const HEADER = {
    COMPRESSED: RAW_HEADER + 'C-',
    ENCODED: RAW_HEADER + 'B-',
    JSON: RAW_HEADER + 'J-',
} as const;

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
            encoded = HEADER.COMPRESSED + fromUint8Array(compressed, true);
        } else if(this._options.blueprintEncode) {
            encoded = HEADER.ENCODED + encode(data, true);
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
    decode(encoded: string) {
        const savedBlueprint = this._decode(encoded);
        if(typeof(savedBlueprint) == 'object') {
            return savedBlueprint as SavedBlueprint;
        }
        return undefined;
    }
    private _decode(encoded: string) {
        encoded = encoded.replace(/\n/g, '');
        let rawEncoded = '';
        try {
            if(RAW_HEADER == encoded.substring(0, RAW_HEADER.length)) {
                const header = encoded.substring(0, RAW_HEADER.length + 2);
                rawEncoded = encoded.substring(RAW_HEADER.length + 2);
                switch(header) {
                    case HEADER.COMPRESSED:
                        return JSON.parse(this.loadCompressed(rawEncoded));
                    case HEADER.ENCODED:
                        return JSON.parse(this.loadEncoded(rawEncoded));
                    case HEADER.JSON:
                        return JSON.parse(rawEncoded);
                    default:
                        throw new Error(`Invalid header: "${header}"`);
                }
            }
        } catch(err) {
            BlueprintDecoder.logError(err);
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
            BlueprintDecoder.logError(err);
        }
        try {
            return JSON.parse(this.loadCompressed(encoded));
        } catch(err) {
            if(rawEncoded) {
                try {
                    return JSON.parse(this.loadCompressed(rawEncoded));
                } catch(err0) {
                    BlueprintDecoder.logError(err);
                }
            } else {
                BlueprintDecoder.logError(err);
            }
        }
        return undefined;
    }

    static logError(err: unknown) {
        if(err instanceof Error) {
            log(LOG.ERROR, (err as Error).message);
        } else {
            log(LOG.ERROR, err);
        }
    }

    private loadCompressed(encoded: string) {
        const compressed = toUint8Array(encoded);
        return inflate(compressed, {to: 'string'});
    }

    private loadEncoded(encoded: string) {
        return decode(encoded);
    }
}

/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import type {GameLogisticTransport} from '#types/game-data';
import type {GameData} from '../data';
import type {ErrorCollector} from '../error-collector';
import {newColorClass, newKey} from './key-store';
import {LinkShapeDescriptor, LinkShapeModel, LinkShapeModelBuilder} from './link-shape';
import type {SavedLink} from './saved-blueprint';
import type {RecipeIOModel} from './store';


export class LinkModelImpl {
    private readonly _key;
    public readonly input?: RecipeIOModel;
    public readonly output?: RecipeIOModel;
    private _linkShape?: LinkShapeModel;
    private readonly _colorClass;
    private _flow: number | undefined;
    private readonly _transport = new Map<string, GameLogisticTransport>();

    constructor(input?: RecipeIOModel, output?: RecipeIOModel) {
        this.input = input;
        this.output = output;
        this._key = newKey();
        this._colorClass = newColorClass();
    }

    get key() { return this._key; }
    get colorClass() { return this._colorClass; }
    get flow() { return this._flow; }
    buildShape() {
        const descriptor = new LinkShapeDescriptor(
            this.input?.rect,
            this.output?.rect,
            this.input?.isFlipped,
            this.output?.isFlipped,
        );
        if(!this._linkShape?.descriptor?.isEqual(descriptor)) {
            this._linkShape = new LinkShapeModelBuilder(descriptor).buildShape();
        }
        return this._linkShape.shape;
    }
    deleteThis() {
        const owner = (this.input || this.output)?.owner;
        if(owner)
            owner._$deleteLink(this);
    }

    getSelectedTransport(logistic: string) {
        return this._transport.get(logistic);
    }
    selectTransport(logistic: string, transport: GameLogisticTransport | undefined) {
        if(!transport) {
            this._transport.delete(logistic);
        } else {
            this._transport.set(logistic, transport);
        }
    }

    _$applyPersistentLink() {
        if(this.input)
            this.input._$linkAdded(this);
        if(this.output)
            this.output._$linkAdded(this);
    }
    _$deletePersistentLink() {
        if(this.input)
            this.input._$linkDeleted(this);
        if(this.output)
            this.output._$linkDeleted(this);
    }
    getOtherSide(item: RecipeIOModel) {
        //may get proxy, so need to compare keys, not objects
        if(item.key === this.input?.key)
            return this.output;
        if(item.key === this.output?.key)
            return this.input;
        return undefined;
    }
    _$save(input?: number, output?: number): SavedLink {
        const transport = this._transport.size
            ? Object
                .fromEntries([...this._transport.entries()]
                .map(([logisticName, t]) => [logisticName, t.name]))
            : undefined;
        return {
            l: [
                input || 0,
                output || 0,
            ],
            t: transport,
        };
    }
    _$load(gameData: GameData, l: SavedLink, errorCollector: ErrorCollector) {
        for(const [logisticName, transportName] of Object.entries(l.t || {})) {
            const logisticItem = gameData.gameLogisticByNameMap.get(logisticName);
            if(!logisticItem) {
                errorCollector.collectError(`Logistic ${logisticName} not found`);
                continue;
            }
            const transportItem = logisticItem.transport.find(t => (t.name == transportName));
            if(!transportItem) {
                errorCollector.collectError(`Transport ${transportName} not found, for logistic ${logisticName}`);
                continue;
            }
            this._transport.set(logisticName, transportItem);
        }
    }

    setFlow(_flow?: number) {
        this._flow = _flow;
    }
}

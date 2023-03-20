/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import type {GameLogisticTransport} from '#types/game-data';
import type {InterfaceOf} from '../types';
import type {LinkModel} from './store';

class TransportModelImpl {
    private readonly _transport: GameLogisticTransport;
    private readonly _flow: number;

    constructor(transport: GameLogisticTransport, flow: number) {
        this._transport = transport;
        this._flow = flow;
    }
}

export type TransportModel = InterfaceOf<TransportModelImpl>;

/**
 * Return 0 <= i <= array.length such that !pred(array[i - 1]) && pred(array[i]).
 */
function binarySearch<T>(array: T[], pred: (item: T) => boolean): number {
    let lo = -1;
    let hi = array.length;
    while((1 + lo) < hi) {
        const mi = lo + ((hi - lo) >> 1);
        if(pred(array[mi])) {
            hi = mi;
        } else {
            lo = mi;
        }
    }
    return hi;
}

export function calculateLogistic(link?: LinkModel): TransportModel[] {
    if(!link) {
        return [];
    }
    const gameData = link.input?.owner?.gameData;
    const flow = link.flow;
    //should be the same input = output
    const io = gameData?.gameItemsMap?.get(link.input?.key || '');
    if(!gameData || !flow || !io) {
        return [];
    }

    const logistic = gameData.getLogistic(io);
    if(!logistic.length) {
        return [];
    }

    const transport: TransportModel[] = [];
    for(const logisticItem of logistic) {
        let transportItem: GameLogisticTransport | undefined = link.getSelectedTransport(logisticItem.name);
        if(!transportItem) {
            const logisticTransport = logisticItem.transport;
            const index = binarySearch(logisticTransport, (t) => (t.countPerSecond >= flow));
            transportItem = (index < logisticTransport.length) ? logisticTransport[index] : logisticTransport[logisticTransport.length - 1];
        }
        if(!transportItem) {
            continue;
        }
        transport.push(new TransportModelImpl(transportItem, flow));
    }
    return transport;
}

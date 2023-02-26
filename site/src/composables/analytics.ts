/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/

import {loadScript} from '@/scripts/load-script-css';

type GoatCounter = {
    count: () => void;
};

export function useAnalytics() {
    //turn on analytics only on global domain
    const hostname = window?.location?.hostname;
    if(!hostname?.toLowerCase()?.includes('doubleaxe.github.io')) {
        return;
    }
    loadScript('https://lbc.xdax.ru/count.js', {
        attributes: {
            'data-goatcounter': 'https://lbc.xdax.ru/count',
            'data-goatcounter-settings': '{"no_onload": true, "allow_frame": true}',
        },
        globalVariable: 'goatcounter',
        validationCallback: (globalVariable: unknown): GoatCounter | undefined => {
            if(globalVariable === undefined) {
                return undefined;
            }
            const goatcounter = globalVariable as GoatCounter;
            return (goatcounter && (typeof (goatcounter.count) == 'function')) ? goatcounter : undefined;
        },
    })
    .then((goatcounter) => {
        goatcounter.count();
    })
    .catch((err) => {
        //ignore error here
    });
}

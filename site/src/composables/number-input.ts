/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
import {ref, unref} from 'vue';

export type NumberInputHelperOptions = {
    min?: number;
    defaultMin?: number;
    max?: number;
    defaultMax?: number;
    defaultValue?: number;
    apply?: (value: number) => void;
};
export function useNumberInputHelper(options: NumberInputHelperOptions = {}) {
    const defaultValue = options.defaultValue || 0;
    const tempNumber = ref<string | number>(defaultValue);

    function updateNumber() {
        let value = unref(tempNumber);
        if(typeof(value) != 'number') {
            value = parseFloat(value);
        }
        if(isNaN(value)) {
            value = defaultValue;
        } else if(options.max && (value >= options.max)) {
            value = options.defaultMax ?? options.max;
        } else if(options.min && (value <= options.min)) {
            value = options.defaultMin ?? options.min;
        }
        tempNumber.value = value;
        if(options.apply) {
            options.apply(value);
        }
    }
    function addNumber(delta: number) {
        updateNumber();
        tempNumber.value = Number(unref(tempNumber)) + delta;
        updateNumber();
    }
    function resetNumber() {
        tempNumber.value = defaultValue;
        updateNumber();
    }

    return {
        updateNumber,
        addNumber,
        resetNumber,
        tempNumber,
    };
}

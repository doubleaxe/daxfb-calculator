/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
let currentKey = 0;

const colorClasses = [
    'link-stroke-red',
    'link-stroke-pink',
    'link-stroke-purple',
    'link-stroke-indigo',
    'link-stroke-blue',
    'link-stroke-light-blue',
    'link-stroke-cyan',
    'link-stroke-teal',
    'link-stroke-green',
    'link-stroke-light-green',
    'link-stroke-lime',
    'link-stroke-yellow',
    'link-stroke-amber',
    'link-stroke-orange',
    'link-stroke-deep-orange',
    'link-stroke-brown',
];
let currentColorClass = 0;

export function newKey(key?: string) {
    return key || ('k' + currentKey++);
}
export function newColorClass() {
    const colorClass = colorClasses[currentColorClass] || colorClasses[0];
    currentColorClass = (currentColorClass + 1) % colorClasses.length;
    return colorClass;
}
export function resetKeyStore() {
    currentKey = 0;
    currentColorClass = 0;
}

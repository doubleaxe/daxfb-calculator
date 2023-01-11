let currentKey = 0;
export function newKey(key?: string) {
    return key || ('k' + currentKey++);
}
export function resetKeyStore() {
    currentKey = 0;
}

let currentKey = 0;
export default function newKey(key?: string) {
    return key || ('k' + currentKey++);
}

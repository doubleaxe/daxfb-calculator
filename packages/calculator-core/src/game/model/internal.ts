let currentId = 0;

export function newId(id?: string) {
    return id ?? `k${currentId++}`;
}
export function resetIdStore() {
    currentId = 0;
}

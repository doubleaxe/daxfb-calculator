export type InterfaceOf<T> = Pick<T, keyof T>;
export type ReadonlyInterfaceOf<T> = Readonly<InterfaceOf<T>>;

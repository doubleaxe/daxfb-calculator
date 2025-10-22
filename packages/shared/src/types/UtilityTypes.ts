export type RemovePackagePrivateMembers<T> = {
    [K in keyof T as K extends `__${string}` ? never : K]: T[K];
};

export type InterfaceOf<T> = Pick<T, keyof T>;
export type PublicInterfaceOf<T> = RemovePackagePrivateMembers<InterfaceOf<T>>;
export type ReadonlyInterfaceOf<T> = Readonly<InterfaceOf<T>>;
export type ReadonlyPublicInterfaceOf<T> = Readonly<PublicInterfaceOf<T>>;

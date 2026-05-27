import { Children, isValidElement, type JSXElementConstructor, type ReactNode } from 'react';

// to make typescript happy and dismiss ts(4033)
export function assignDisplayName<T>(Component: JSXElementConstructor<T>, displayName: string) {
    (Component as unknown as { displayName: string }).displayName = displayName;
}

export function extractComponentsForCompoundParent(children: ReactNode, names: string[]): (ReactNode | undefined)[] {
    const result: (ReactNode | undefined)[] = new Array<ReactNode | undefined>(names.length).fill(undefined);

    Children.forEach(children, (child) => {
        if (!isValidElement(child)) return;

        const type = child.type;
        const name =
            typeof type === 'string' ? type : (type as unknown as { displayName: string })?.displayName || type?.name;

        const index = names.indexOf(name);

        if (index !== -1) {
            result[index] = child;
        }
    });

    return result;
}

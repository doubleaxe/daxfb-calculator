export type SerializedFlowChart = {
    h?: Header;
    i: SerializedFactory[];
    l: SerializedLink[];
};

export type Header = {
    g: string;
    v: number;
};

export type SerializedOrder = {
    //custom order of inputs
    o1?: number[];
    //custom order of outputs
    o2?: number[];
};

export type SerializedFactory = {
    //count
    c?: number;
    //is flipped
    f?: 1;
    //is locked
    l?: 1;
    //name
    n: string;
    //position [x, y]
    p: number[];
    //recipe key
    r: string;
    //weight
    w?: number;
} & SerializedOrder;

export type SerializedLink = {
    l: number[];
    n?: string;
};

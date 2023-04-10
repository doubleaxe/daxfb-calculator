/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export enum GameItemExType {
    Unknown = 0,
    Electricity = 1,
    MechPower,
    Computing,
    Upoints,
    Maintenance,
    Pollution,
    Worker,
}

export type GameItemExData = {
    exType?: GameItemExType;
    nextTier?: string;
    prevTier?: string;
    //keep tier in custom data, so tier group menu doesn't appear
    tier?: number;
};

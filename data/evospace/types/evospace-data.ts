/*
Author: Alexey Usov (dax@xdax.ru, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export interface Images {
    [key: string]: number[];
}

export interface JsonRecipeIO {
    Name: string;
    Count: number;
    Probability?: number;
    Capacity?: number;
}

export interface JsonRecipe {
    Category_T?: string;
    Name: string;
    //ordered in natural order
    Input?: JsonRecipeIO[];
    //ordered in natural order
    Output?: JsonRecipeIO[];
    ResourceInput?: JsonRecipeIO;
    ResourceOutput?: JsonRecipeIO;
    Ticks: number;
    Tier?: number;
    Loss?: number;
    Scaled?: boolean;
    Locked?: boolean;
}

export interface JsonRecipeDictionary {
    Name: string;
    //ordered in natural order
    Recipes: JsonRecipe[];
}

export interface JsonRecipeReference {
    RecipeDictionary: string;
    Tier: number;
}

export interface JsonItem {
    Category?: string;
    Class: string;
    Name: string;
    Label: string;
    Tag?: string;
    Image: string;
    MaxCount: number;
    Tier?: number;
    Unit?: string;
    UnitMul?: number;
    Craftable?: boolean;
    Recipe?: JsonRecipeReference;
}

export interface JsonData {
    //ordered in natural order
    Recipes: JsonRecipeDictionary[];
    //ordered in natural order
    Items: JsonItem[];
}

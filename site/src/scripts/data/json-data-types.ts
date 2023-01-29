/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove this comment if you use unmodified file
*/
export interface Images {
    [key: string]: number[];
}

export interface JsonRecipeIO {
    Name: string;
    Count: number;
    Probability?: number;
}
export interface JsonRecipe {
    Name: string;
    //ordered in natural order
    Input?: JsonRecipeIO[];
    //ordered in natural order
    Output?: JsonRecipeIO[];
    ResourceInput?: JsonRecipeIO;
    ResourceOutput?: JsonRecipeIO;
    Ticks: number;
    Tier?: number;
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
    Name: string;
    Label: string;
    Image: string;
    Tier?: number;
    UnitMul?: number;
    Recipe?: JsonRecipeReference;
}
export interface JsonData {
    //ordered in natural order
    recipes: JsonRecipeDictionary[];
    //ordered in natural order
    items: JsonItem[];
    images: Images;
}

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
    Input?: JsonRecipeIO[];
    Output?: JsonRecipeIO[];
    ResourceInput?: JsonRecipeIO;
    ResourceOutput?: JsonRecipeIO;
    Ticks: number;
    Tier?: number;
}
export interface JsonRecipeReference {
    RecipeDictionary: string;
    Tier: number;
}
export interface JsonItem {
    Name?: string;
    Label: string;
    Image: string;
    Tier?: number;
    UnitMul?: number;
    Recipe?: JsonRecipeReference;
}
export interface JsonData {
    recipes: {
        [key: string]: JsonRecipe[];
    };
    items: {
        [key: string]: JsonItem;
    };
    images: Images;
}

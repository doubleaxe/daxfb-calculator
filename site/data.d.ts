export interface Images {
    [key: string]: number[],
}

export interface JsonRecipeIO {
    Name: string,
    Count: number,
    Probability?: number,
    Capacity?: number,
}
export interface JsonRecipe {
    Category_T: string,
    Name: string,
    Input?: JsonRecipeIO[],
    Output?: JsonRecipeIO[],
    ResourceInput?: JsonRecipeIO,
    ResourceOutput?: JsonRecipeIO,
    Ticks: number,
    Tier?: number,
    Loss?: number,
    Scaled?: boolean,
    Locked?: boolean,
}
export interface JsonRecipeReference {
    RecipeDictionary: string,
    Tier: number,
}
export interface JsonItem {
    Category?: string,
    Class: string,
    Name?: string,
    Tag?: string,
    Image: string,
    MaxCount: number,
    Tier?: number,
    Unit?: string,
    UnitMul?: number,
    Craftable?: boolean,
    Recipe?: JsonRecipeReference,
}
export interface JsonData {
    recipes: {
        [key: string]: JsonRecipe[]
    },
    items: {
        [key: string]: JsonItem
    },
}

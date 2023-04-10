export interface MachinesAndBuildingsJson {
    game_version: string;
    machines_and_buildings: BuildingDef[];
}

export interface BuildingDef {
    id: string;
    name: string;
    category: string;
    next_tier: string;
    workers: number;
    maintenance_cost_units: string;
    maintenance_cost_quantity: number;
    electricity_consumed: number;
    electricity_generated: number;
    computing_consumed: number;
    computing_generated: number;
    storage_capacity: number;
    unity_cost: number;
    research_speed: number;
    build_costs: BuildCost[];
    recipes: RecipeDef[];
}

export interface BuildCost {
    product: string;
    quantity: number;
}

export interface RecipeDef {
    id: string;
    name: string;
    duration: number;
    inputs: IODef[];
    outputs: IODef[];
}

export interface IODef {
    name: string;
    quantity: number;
}

export interface ProductsJson {
    game_version: string;
    products: ProductDef[];
}

export interface ProductDef {
    id: string;
    name: string;
    icon: string;
    type: string;
}

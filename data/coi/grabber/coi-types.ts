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
    product_type: string;
    storage_capacity: number;
    unity_cost: number;
    research_speed: number;
    icon_path?: string;
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
    icon_path?: string;
}

export interface ContractsJson {
    game_version: string;
    contracts: Contract[];
}

export interface Contract {
    id: string;
    product_to_buy_name: string;
    product_to_buy_quantity: number;
    product_to_pay_with_name: string;
    product_to_pay_with_quantity: number;
    unity_per_month: number;
    unity_per_100_bought: number;
    unity_to_establish: number;
    min_reputation_required: number;
}

export interface TransportsJson {
    game_version: string;
    transports: Transport[];
}

export interface Transport {
    id: string;
    name: string;
    category: string;
    next_tier: string;
    maintenance_cost_units: string;
    maintenance_cost_quantity: number;
    electricity_consumed: number;
    throughput_per_second: number;
    length_per_cost: number;
    build_costs: BuildCost[];
}

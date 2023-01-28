/*
Author: Alexey Usov (dax@xdax.ru, https://t.me/doubleaxe, https://github.com/doubleaxe)
Please don't remove author reference from this file
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';


const _commons = {
    compileJsonSchema(schemaObject) {
        const ajv = new Ajv();
        return ajv.compile(schemaObject);
    },
    validateJsonObject(validate, jsonObject, ...names) {
        const valid = validate(jsonObject);
        if(!valid) {
            const stringObject = JSON.stringify(jsonObject, null, '  ');
            const errorList = JSON.stringify(validate.errors, null, '  ');
            throw new Error(`Unexpected error, schema changed ${names.join(' => ')}\n${stringObject}\n${errorList}`);
        }
    },
};

export class RecipesList {
    #names = new Set();
    //insertion order is important
    #recipes = new Map();

    constructor() {
    }

    prepareComposer(composer) {
        composer.recipes = this.#recipes;
    }

    async parseJsonFileAsync(jsonPath) {
        const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
        const baseName = path.basename(jsonPath, path.extname(jsonPath));

        for(const object of jsonFile.Objects) {
            const name = object.Name;
            if(object.Class != 'BaseRecipeDictionary') {
                console.log(`Unexpected class for recipe, skipped: ${name} => ${object.Class}`);
                continue;
            }
            if(name.indexOf(RecipesList.SEPARATOR) >= 0) {
                throw new Error(`Invalid separator, choose another: ${name}`);
            }
            let recipeList = this.#recipes.get(name);
            if(!recipeList) {
                recipeList = {
                    Name: name,
                    Recipes: [],
                };
                this.#recipes.set(name, recipeList);
            }
            for(const recipe of object.Recipes) {
                if(this.#names.has(name + RecipesList.SEPARATOR + recipe.Name))
                    throw new Error(`Duplicate recipe name ${name} => ${recipe.Name}`);
                this.#names.add(name + RecipesList.SEPARATOR + recipe.Name);
                _commons.validateJsonObject(RecipesList.#recipeSchema, recipe, baseName, name);
                recipeList.Recipes.push({
                    Category_T: baseName,
                    ...recipe,
                });
            }
        }
    }
    static SEPARATOR = '@';
    static #recipeSchema = _commons.compileJsonSchema({
        type: 'object',
        additionalProperties: false,
        required: ['Name', 'Ticks', 'Input', 'Output'],
        properties: {
            Input: {'$ref': '#/$defs/IO'},
            Output: {'$ref': '#/$defs/IO'},
            ResourceInput: {'$ref': '#/$defs/Item'},
            ResourceOutput: {'$ref': '#/$defs/Item'},
            Name: {type: 'string'},
            Ticks: {type: 'number'},
            Tier: {type: 'integer'},
            Loss: {type: 'integer'},
            Scaled: {type: 'boolean'},
            Locked: {type: 'boolean'},
        },
        $defs: {
            IO: {
                type: 'object',
                additionalProperties: false,
                required: ['Items'],
                properties: {
                    Items: {
                        type: 'array',
                        items: {'$ref': '#/$defs/Item'},
                        minItems: 0,
                    },
                },
            },
            Item: {
                type: 'object',
                additionalProperties: false,
                required: ['Count', 'Name'],
                properties: {
                    Count: {type: 'number'},
                    Probability: {type: 'number'},
                    Name: {type: 'string'},
                    Capacity: {type: 'integer'},
                },
            },
        },
    });
}


export class ItemsList {
    //insertion order is important
    #objects = {
        solidStaticItem: new Map(),
        abstractStaticItem: new Map(),
        fluidStaticItem: new Map(),
        baseRecipeDictionary: new Map(),
    };

    constructor() {
    }

    prepareComposer(composer) {
        //insertion order is important
        const items = new Map();
        [
            this.#objects.solidStaticItem,
            this.#objects.abstractStaticItem,
            this.#objects.fluidStaticItem,
        ].forEach((item) => {
            for(const [name, value] of item.entries()) {
                if(items.has(name))
                    throw new Error(`Duplicate item name ${name}`);
                items.set(name, value);
            }
        });
        composer.items = items;
        composer.recipeDictionary = this.#objects.baseRecipeDictionary;
    }

    async parseJsonFileAsync(jsonPath) {
        const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
        const baseName = path.basename(jsonPath, path.extname(jsonPath));

        for(const object of jsonFile.Objects) {
            const _class = object.Class;
            const processing = ItemsList.#processing[_class];
            if(!processing)
                continue;
            const destObject = this.#objects[processing.destObject];
            const schema = processing.schema;
            processing.unusedFields.forEach((name) => delete object[name]);
            _commons.validateJsonObject(schema, object, baseName);

            const name = object.Name;
            const maybeArray = destObject.get(name);
            if(maybeArray) {
                if(!processing.allowDuplicates)
                    throw new Error(`Duplicate object name ${baseName} => ${_class} => ${name}`);
                maybeArray.push(object);
            } else {
                destObject.set(name, processing.allowDuplicates ? [object] : object);
            }
        }
    }
    static #solidStaticItemSchema = _commons.compileJsonSchema({
        type: 'object',
        additionalProperties: false,
        required: ['Class', 'Name', 'Image', 'MaxCount', 'LabelParts'],
        properties: {
            Category: {type: 'string'},
            Class: {type: 'string'},
            Name: {type: 'string'},
            Tag: {type: 'string'},
            Image: {type: 'string'},
            MaxCount: {type: 'integer'},
            LabelParts: {
                type: 'array',
                minItems: 1,
                maxItems: 2,
                items: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 2,
                    items: {type: 'string'},
                },
            },
            Tier: {type: 'integer'},
            Unit: {type: 'string'},
            UnitMul: {type: 'number'},
            Craftable: {type: 'boolean'},
        },
    });
    static #baseRecipeDictionary = _commons.compileJsonSchema({
        type: 'object',
        additionalProperties: false,
        required: ['Class', 'Name', 'UsedIn'],
        properties: {
            Class: {type: 'string'},
            Name: {type: 'string'},
            UsedIn: {
                type: 'array',
                minItems: 1,
                maxItems: 1,
                items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['Item', 'Tier'],
                    properties: {
                        Item: {type: 'string'},
                        Tier: {type: 'integer'},
                    },
                },
            },
        },
    });
    static #baseStaticItem = {
        schema: this.#solidStaticItemSchema,
        unusedFields: [
            'Color',
            'CommonTextKeys',
            'DescriptionParts',
            'ItemLogic',
            'Label',
            'LabelFormat',
            'LogicJson',
            'Materials',
            'Mesh',
        ],
    };
    static #processing = {
        SolidStaticItem: {
            destObject: 'solidStaticItem',
            ...this.#baseStaticItem,
        },
        AbstractStaticItem: {
            destObject: 'abstractStaticItem',
            ...this.#baseStaticItem,
        },
        FluidStaticItem: {
            destObject: 'fluidStaticItem',
            ...this.#baseStaticItem,
        },
        BaseRecipeDictionary: {
            destObject: 'baseRecipeDictionary',
            schema: this.#baseRecipeDictionary,
            unusedFields: [],
            allowDuplicates: true,
        },
    };
}


export class Localization {
    #loc = {};

    constructor() {
    }

    prepareComposer(composer) {
        composer.loc = this.#loc;
    }

    async parseJsonFileAsync(jsonPath) {
        const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
        const baseName = path.basename(jsonPath, path.extname(jsonPath));

        const locObject = {};
        this.#loc[baseName] = locObject;
        for(const [name, value] of jsonFile) {
            if(locObject[name])
                console.warn(`Duplicate localization name ${baseName} => ${name}`);
            locObject[name] = value;
        }
    }
}


export class JsonComposer {
    #recipes;
    #items;
    #recipeDictionary;
    #loc;

    constructor() {
    }

    compose() {
        this.#mergeRecipeDictionary();
        this.#mergeLocalization();
        return this.#filterAndBuildFinal();
    }

    #mergeRecipeDictionary() {
        const recipes = this.#recipes;
        const items = this.#items;
        const recipeDictionary = this.#recipeDictionary;
        for(const [recipeName, array] of recipeDictionary.entries()) {
            if(!recipes.has(recipeName)) {
                //unused recipe
                continue;
            }
            for(const recipe of array) {
                const {Item: itemName, Tier: recipeTier} = recipe.UsedIn[0];
                const item = items.get(itemName);
                if(item.Recipe) {
                    throw new Error(`Multiple recipes for single item\n${JSON.stringify(item, null, '  ')}`);
                }
                item.Recipe = {
                    RecipeDictionary: recipeName,
                    Tier: recipeTier,
                };
            }
        }
    }

    #mergeLocalization() {
        const items = this.#items;
        const loc = this.#loc;
        const formatLabel = (labelParts) => {
            return labelParts.map(([label, file]) => loc[file][label]).join(' ');
        };
        for(const item of items.values()) {
            item.Label = formatLabel(item.LabelParts);
        }
    }

    #filterAndBuildFinal() {
        const recipes = this.#recipes;
        const items = this.#items;

        const craftableRecipes = this.#recipeDictionary;
        const filteredRecipes = new Map(
            [...recipes.entries()].filter(([key]) => craftableRecipes.has(key)),
        );

        const craftableItems = new Set([...filteredRecipes.values()].flatMap(
            ({Recipes: recipeArray}) => recipeArray.flatMap((recipe) => {
                return [
                    ...recipe.Input.Items,
                    ...recipe.Output.Items,
                    ...(recipe.ResourceInput ? [recipe.ResourceInput] : []),
                    ...(recipe.ResourceOutput ? [recipe.ResourceOutput] : []),
                ].flatMap(({Name}) => Name);
            })),
        );
        const filteredItems = new Map(
            [...items.entries()].filter(([key]) => craftableItems.has(key)),
        );

        //delete now unused keys
        for(const item of [...filteredRecipes.values()].flatMap(({Recipes}) => Recipes)) {
            if(!item.Input.Items)
                delete item.Input;
            else
                item.Input = item.Input.Items;
            if(!item.Output.Items)
                delete item.Output;
            else
                item.Output = item.Output.Items;
        }
        for(const item of [...filteredItems.values()]) {
            delete item.LabelParts;
        }
        return new FinalJson(filteredRecipes, filteredItems);
    }

    set recipes(recipes) { this.#recipes = recipes; }
    set items(items) { this.#items = items; }
    set recipeDictionary(recipeDictionary) { this.#recipeDictionary = recipeDictionary; }
    set loc(loc) { this.#loc = loc; }
}


class FinalJson {
    #filteredRecipes;
    #filteredItems;

    constructor(filteredRecipes, filteredItems) {
        this.#filteredRecipes = filteredRecipes;
        this.#filteredItems = filteredItems;
    }

    getUsableImages() {
        return new Set([...this.#filteredItems.values()].map((item) => item.Image));
    }
    async saveComposedJsonAsync({jsonPath}) {
        const finalJson = {
            recipes: [...this.#filteredRecipes.values()],
            items: [...this.#filteredItems.values()],
        };
        await fs.writeFile(jsonPath, JSON.stringify(finalJson, null, '  '));
    }
}

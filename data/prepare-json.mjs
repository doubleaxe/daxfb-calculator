
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
    #recipesByCreator = new Map();

    constructor() {
    }

    async parseJsonFileAsync(jsonPath) {
        const jsonFile = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
        const baseName = path.basename(jsonPath, path.extname(jsonPath));

        for(const object of jsonFile.Objects) {
            const recipeCreator = object.Name;
            if(object.Class != 'BaseRecipeDictionary') {
                console.log(`Unexpected class for recipe, skipped: ${recipeCreator} => ${object.Class}`);
                continue;
            }
            let recipeList = this.#recipesByCreator.get(recipeCreator);
            if(!recipeList) {
                recipeList = [];
                this.#recipesByCreator.set(recipeCreator, recipeList);
            }
            for(const recipe of object.Recipes) {
                _commons.validateJsonObject(RecipesList.#recipeSchema, recipe, baseName, recipeCreator);
                recipeList.push({
                    category: baseName,
                    ...recipe,
                });
            }
        }
    }
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
        '$defs': {
            IO: {
                type: 'object',
                additionalProperties: false,
                required: ['Items'],
                properties: {
                    Items: {
                        type: 'array',
                        items: {'$ref': '#/$defs/Item'},
                    }
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
                }
            }
        },
    });
}


export class ItemsList {
    #objects = {
        solidStaticItem: {},
        baseRecipeDictionary: {},
        abstractStaticItem: {},
        fluidStaticItem: {},
    };

    constructor() {
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
            delete object.Name;
            if(destObject[name])
                throw new Error(`Duplicate object name ${_class} => ${name}`);
            destObject[name] = object;
        }
    }
    static #solidStaticItemSchema = _commons.compileJsonSchema({
        type: 'object',
        additionalProperties: false,
        required: ['Class', 'Name', 'Image', 'MaxCount'],
        properties: {
            Category: {type: 'string'},
            Class: {type: 'string'},
            Name: {type: 'string'},
            Tag: {type: 'string'},
            Image: {type: 'string'},
            MaxCount: {type: 'integer'},
            Tier: {type: 'integer'},
            UnitMul: {type: 'integer'},
            Craftable: {type: 'boolean'},
        },
    });
    static #processing = {
        SolidStaticItem: {
            destObject: 'solidStaticItem',
            schema: this.#solidStaticItemSchema,
            unusedFields: [
                'Color',
                'CommonTextKeys',
                'DescriptionParts',
                'ItemLogic',
                'Label',
                'LabelFormat',
                'LabelParts',
                'LogicJson',
                'Materials',
                'Mesh',
            ]
        }
    };
}

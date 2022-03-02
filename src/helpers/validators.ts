import { ValidatorError } from './errors';

/**
 * Data types for validation 
 */
export enum ValidatorType {
    Boolean = 'Boolean',
    Number = 'Number',
    String = 'String',
    Enum = 'Enum',
    Array = 'Array',
    Object = 'Object',
}

export interface TypeOfValidatorType {
    [ValidatorType.String]: string;
    [ValidatorType.Array]: Array<any>;
    [ValidatorType.Boolean]: boolean;
    [ValidatorType.Enum]: string;
    [ValidatorType.Number]: number;
    [ValidatorType.Object]: { [key: string]: any};
}

/**
 * Options for keys in validation 
 */
export interface ValidatorKeyOptions {
    /**
     * Is required (default: false)
     */
    required?: boolean;
    /**
     * Type of validated key
     */
    type: ValidatorType;
    /**
     * RegExp for validate string (valid only for String)
     */
    regexp?: RegExp | {regexp: RegExp, message: string};
    /**
     * Type of Array childs (valid only for Array)
     */
    of?: ValidatorKeyOptions;
    /**
     * Type of Object childs (valid only for Object)
     */
    childs?: { [key: string]: ValidatorKeyOptions };
    /**
     * Possible Enum values (valid only for Enum)
     */
    enum?: string[];
    /**
     * Minimal number (included) of Number or of Array length or String lenght (valid only for Number or Array or String)
     */
    min?: number;
    /**
     * Maximal number (included) of Number or of Array length or String lenght (valid only for Number or Array or String)
     */
    max?: number;
    /**
     * Is integer needed (valid only for Number)
     */
    needsInteger?: boolean;
    /**
     * Can be null
     */
    nullable?: boolean;
}

/**
 *  Validate key - called recursively - returns validated data or throw errors
 * 
 * @param parentKey 
 * @param key 
 * @param content 
 * @param options 
 */
const validateKey = (parentKey: string, key: string, content: any, options: ValidatorKeyOptions): any => {
    switch (options.type) {
        // Boolean validation
        case ValidatorType.Boolean:
            if (typeof content === 'boolean') {
                return content;
            }
            if (content === null && options.nullable) {
                return null;
            }
            throw new ValidatorError(`Key ${parentKey}${key} must be boolean`);
        // String validation
        case ValidatorType.String:
            if (typeof content === 'string') {
                if (typeof options.min !== 'undefined') {
                    if (content.length < options.min) {
                        throw new ValidatorError(`Key ${parentKey}${key} has minimal length ${options.min}`);
                    }
                }
                if (typeof options.max !== 'undefined') {
                    if (content.length > options.max) {
                        throw new ValidatorError(`Key ${parentKey}${key} has maximal length ${options.max}`);
                    }
                }
                if (options.regexp) {
                    let r: RegExp = null;
                    let m: string = `Key ${parentKey}${key} doesn't match validation RegExp`;
                    if (options.regexp instanceof RegExp) {
                        r = options.regexp;
                    } else {
                        r = options.regexp.regexp;
                        m = `Key ${parentKey}${key}: ${options.regexp.message}`;
                    }

                    if (r.test(content)) {
                        return content;
                    } else {
                        throw new ValidatorError(m);
                    }
                } else {
                    return content;
                }
            }
            if (content === null && options.nullable) {
                return null;
            }
            throw new ValidatorError(`Key ${parentKey}${key} must be string`);
        // Number validation
        case ValidatorType.Number:
            if (typeof content === 'number') {
                if (typeof options.min !== 'undefined') {
                    if (content < options.min) {
                        throw new ValidatorError(`Key ${parentKey}${key} has minimal limit ${options.min}`);
                    }
                }
                if (typeof options.max !== 'undefined') {
                    if (content > options.max) {
                        throw new ValidatorError(`Key ${parentKey}${key} has maximal limit ${options.max}`);
                    }
                }
                if (options.needsInteger && !Number.isInteger(content)) {
                    throw new ValidatorError(`Key ${parentKey}${key} must be integer, not float`);
                }
                return content;
            }
            if (content === null && options.nullable) {
                return null;
            }
            throw new ValidatorError(`Key ${parentKey}${key} must be number`);
        // Enum validation
        case ValidatorType.Enum:
            if (!Array.isArray(options.enum)) {
                throw new Error(`Missing 'enum' field in ${parentKey}${key} format`)
            }
            if (typeof content === 'string' && (options.enum.indexOf(content) > -1)) {
                return content;
            }
            if (content === null && options.nullable) {
                return null;
            }
            throw new ValidatorError(`Key ${parentKey}${key} must be one of following values [${options.enum}]`);
        // Array validation
        case ValidatorType.Array:
            if (!options.of) {
                throw new Error(`Missing 'of' field in ${parentKey}${key} format`)
            }
            if (Array.isArray(content)) {
                content.forEach((item, index) => {
                    validateKey(`${parentKey}${key}`, `[${index}]`, item, options.of);
                });
                if (typeof options.min !== 'undefined') {
                    if (content.length < options.min) {
                        throw new ValidatorError(`Array ${parentKey}${key} must have minimal ${options.min} items`);
                    }
                }
                if (typeof options.max !== 'undefined') {
                    if (content.length > options.max) {
                        throw new ValidatorError(`Array ${parentKey}${key} must have maximal ${options.max} items`);
                    }
                }
                return content;
            }
            if (content === null && options.nullable) {
                return null;
            }
            throw new ValidatorError(`Key ${parentKey}${key} must be array`);
        // Object validation
        case ValidatorType.Object:
            if (!options.childs || typeof options.childs !== 'object') {
                throw new Error(`Missing 'childs' field in ${parentKey}${key} format`)
            }
            if (typeof content === 'object' && !Array.isArray(content)) {

                let objKeys = Object.keys(options.childs);
                let outObject = {};
                objKeys.forEach((objKey) => {
                    if (typeof content[objKey] != 'undefined') {
                        outObject[objKey] = validateKey(`${parentKey}${key}/`, objKey, content[objKey], options.childs[objKey]);
                    } else if (options.childs[objKey].required) {
                        throw new ValidatorError(`Missing required key ${parentKey}${key}/${objKey}`);
                    }
                });
                return outObject;
            }
            if (content === null && options.nullable) {
                return null;
            }
            throw new ValidatorError(`Key ${parentKey}${key} must be object`);
    }
    throw new Error('Unknown validator type');
}

/**
 * Helper for validate body by format object
 * Returns validated body or null
 * Throws:
 *  ValidatorError - for any problem with body data
 *  Error - for errors in format specification
 * 
 * @param body
 * @param format 
 */
export const bodyValidator = <T extends { [key: string]: ValidatorKeyOptions }>(body: any, format: T): { [K in keyof T]?: TypeOfValidatorType[T[K]['type']] } => {
    if (!body) {
        throw new ValidatorError('Body is empty');
    }
    if (typeof body !== 'object' || Array.isArray(body)) {
        throw new ValidatorError('Body is not object');
    }
    return validateKey('', '', body, {type: ValidatorType.Object, childs: format});
}

/**
 * Helper for validate body by format object depends on step key
 * Returns validated body or null
 * Throws:
 *  ValidatorError - for any problem with body data
 *  Error - for errors in format specification
 * 
 * @param body 
 * @param stepsFormat 
 * @param stepKey 
 */
export const stepBodyValidator = <T extends { [step: string]: { [key: string]: ValidatorKeyOptions }}>(body: any, stepsFormat: T, stepKey: string = 'step'): { [S in keyof T]?: {[K in keyof T[S]]?: TypeOfValidatorType[T[S][K]['type']] } } => {
    var stepBody = bodyValidator(body, {
        [stepKey]: {
            required: true,
            type: ValidatorType.String
        }
    });

    if (!stepsFormat.hasOwnProperty(stepBody[stepKey])) {
        throw new ValidatorError(`Step ${stepBody[stepKey]} not exist`);
    }
    let ret = {};
    ret[stepBody[stepKey]] = bodyValidator(body, stepsFormat[stepBody[stepKey]]);
    return ret;
}
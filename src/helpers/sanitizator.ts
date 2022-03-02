/**
 * Santize object by array of keys.
 * Returned object has only properties that is specified in keys.
 * Property value assigne is reference only (not copy).
 * Be careful, this can handle only flat structure.
 * If property that was specified in keys not exists in object, property will be set to undefined
 *
 * @param object input object
 * @param keys array of keys
 */
export function Sanitize<T, Z extends (keyof T)>(object: T, keys: Z[]): {[K in Z]: T[K]} {
    // create output function
    const ret = {};
    for(let propertyName of keys) {
        ret[propertyName as string] = object[propertyName];
    }
    return ret as {[K in Z]: T[K]};
}
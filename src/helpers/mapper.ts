/**
 * Map fields by map to object.
 * Its simply translate property name by map
 *
 * @param object object that will be mapped
 * @param map map of mapped properties
 */
export function mapFields(object: any, map: {[key: string]: string}): any {
    const newObject = {};
    for(let i in object) {
        if (map[i]) {
            newObject[map[i]] = object[i];
        } else {
            newObject[i] = object[i];
        }
    }
    return newObject;
}

/**
 * Unmap fields by map to object
 * Its simply translate property name back by map
 * 
 * @param object object that will be unmapped
 * @param map map of mapped properties
 */
export function unmapFields(object: any, map: {[key: string]: string}): any {
    // TODO this is nasty, I need reversed map for unmap objects and best way is
    // create reversed map here. This is need to be cached in future!
    const reversedMap = {};
    for(let i in map) {
        reversedMap[map[i]] = i;
    };

    const newObject = {};
    for(let i in object) {
        if (reversedMap[i]) {
            newObject[reversedMap[i]] = object[i];
        } else {
            newObject[i] = object[i];
        }
    }
    return newObject;
}

/**
 * CLI colors reference
 */
export const ColorsReference = {
    // Control
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    // Foreground
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    // Background
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
};

/**
 * Return function, that can colorize string ... usable for colorsScheme in IStringifyObjectConfig
 *
 * @param preColorRefs
 * @param postColorRefs
 * @returns {function}
 */
export const makeColorFunction = (preColorRefs: string, postColorRefs: string = ColorsReference.Reset): (str: string) => string => {
    return (str: string) => {
        return preColorRefs + str + postColorRefs;
    };
}

/**
 * stringifyObject config interface
 */
export interface IStringifyObjectConfig {
    colored?: boolean;
    maxDepth?: number;
    maxStringLength?: number;
    colorsScheme?: {
        'object': (str: string) => string;
        'string': (str: string) => string;
        'number': (str: string) => string;
        'null': (str: string) => string;
        'array': (str: string) => string;
        'function': (str: string) => string;
        'boolean': (str: string) => string;
    };
}

/**
 * Recursive stringify for any JS object type
 *
 * @param obj
 * @param config
 * @param depth
 * @returns {string}
 */
export const stringifyObject = (obj: any, config: IStringifyObjectConfig = {}, depth: number = 0): string => {

    // defaults config
    if (typeof config.colored === 'undefined') {
        config.colored = false;
    }
    if (typeof config.maxDepth === 'undefined') {
        config.maxDepth = 6;
    }
    if (typeof config.maxStringLength === 'undefined') {
        config.maxStringLength = -1;
    }
    if (typeof config.colorsScheme === 'undefined') {
        config.colorsScheme = {
            'object': makeColorFunction(ColorsReference.FgMagenta),
            'string': makeColorFunction(ColorsReference.FgGreen),
            'number': makeColorFunction(ColorsReference.FgCyan),
            'null': makeColorFunction(ColorsReference.FgRed),
            'array': makeColorFunction(ColorsReference.FgYellow),
            'function': makeColorFunction(ColorsReference.FgBlue),
            'boolean': makeColorFunction(ColorsReference.FgYellow),
        };
    }

    let type: string = typeof obj;
    if (obj == null) {
        obj = 'null';
        type = 'null';
    }
    if (Array.isArray(obj)) {
        type = 'array';
    }

    if (depth <= config.maxDepth) {

        if (type == 'array') {
            let ret = '';
            obj.forEach((a: any) => {
                if (config.colored && config.colorsScheme[type]) {
                    ret += config.colorsScheme[type]((ret.length) ? ', ' : '[');
                } else {
                    ret += (ret.length) ? ', ' : '[';
                }
                ret += stringifyObject(a, config, depth + 1);
            });

            if (config.colored && config.colorsScheme[type]) {
                if (ret.length == 0) {
                    ret = config.colorsScheme[type]('[');
                }
                return ret + config.colorsScheme[type](']');
            }
            if (ret.length == 0) {
                ret = '[';
            }
            return ret + ']';
        }

        if (type == 'object') {
            let className = objectToString(obj);
            if (className == '' || className == 'Object') {
                let ret = '';
                if (!obj.hasOwnProperty) {
                    if (config.colored && config.colorsScheme[type]) {
                        return config.colorsScheme[type]('[Object - cannot stringify]');
                    }
                    return '[Object - cannot stringify]';
                }
                for (let k in obj) {
                    if (!obj.hasOwnProperty(k)) continue;
                    if (config.colored && config.colorsScheme[type]) {
                        ret += config.colorsScheme[type]((ret.length) ? ', ' : '{');
                        ret += config.colorsScheme[type](k + ':') + stringifyObject(obj[k], config, depth + 1);
                    } else {
                        ret += (ret.length) ? ', ' : '{';
                        ret += k + ':' + stringifyObject(obj[k], config, depth + 1);
                    }
                }
                if (config.colored && config.colorsScheme[type]) {
                    if (ret.length == 0) {
                        ret = config.colorsScheme[type]('{')
                    }
                    return ret + config.colorsScheme[type]('}');
                }
                if (ret.length == 0) {
                    ret = '{';
                }
                return ret + '}';
            } else {
                if (config.colored && config.colorsScheme[type]) {
                    return config.colorsScheme[type]('[Object ' + className + ']');
                }
                return className;
            }
        }
    }

    if (depth > 0 && type == 'string') {
        let stringStr = obj.toString();
        if (config.maxStringLength > -1) {
            if (stringStr.length > config.maxStringLength) {
                if (config.maxStringLength > 5) {
                    stringStr = stringStr.substr(0, Math.ceil((config.maxStringLength-3)/2)) + '...' + stringStr.substr(stringStr.length - Math.floor((config.maxStringLength-3)/2), Math.floor((config.maxStringLength-3)/2));
                } else {
                    stringStr = stringStr.substr(0, config.maxStringLength) + '...';
                }
            }
        }
        if (config.colored && config.colorsScheme[type]) {
            return config.colorsScheme[type]('"' + stringStr + '"');
        } else {
            return '"' + stringStr + '"';
        }
    }

    if (config.colored && config.colorsScheme[type]) {
        if (typeof obj.toString == 'function') {
            return config.colorsScheme[type](obj.toString());
        } else {
            return config.colorsScheme[type]('[' + type + ' - cannot stringify]');
        }
    } else {
        if (typeof obj.toString == 'function') {
            return obj.toString();
        } else {
            return '[' + type + ' - cannot stringify]';
        }
    }
}

/**
 * Function to get name of objects
 *
 * @param obj
 * @returns {string}
 */
export const objectToString = (obj: any): string => {
    if (!obj) return '';
    if (!obj.constructor) return '';
    if (!obj.constructor.toString) return '';
    let funcNameRegex = /function (.{1,})\(/;
    let results = (funcNameRegex).exec((obj).constructor.toString());
    return (results && results.length > 1) ? results[1] : '';
}
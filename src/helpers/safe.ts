
export function safe<T>(expression: () => T, defaultValue: any) {
    try {
        const value = expression();
        if (typeof value !== 'undefined') {
            return value;
        } else {
            return defaultValue;
        }
    } catch(e) {
        return defaultValue;
    }
}

export function notNull<T>(value: T) {
    if (value === null) {
        throw new Error("Value cant be null");
    }
    return value;
}

export function notNaN<T>(value: T) {
    if (typeof value !== 'number' || (typeof value === 'number' && isNaN(value))) {
        throw new Error("Value must be number");
    }
    return value;
}

// NullCheck
export function NullCheck<T>(obj: T): T {
    if (obj === null) {
        throw new Error('NullCheck error');
    }
    return obj;
}
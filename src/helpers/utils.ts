
const dateRegexp = /^[0-9]{4}-[0-9]{2}-[0-9]{2}([T ][0-9]{2}:[0-9]{2}(:[0-9]{2}(.[0-9]{3})?([Z]|([+-][0-9]{4}))?)?)?$/;
/**
 * Compares two objects (in root) and reuturns all changed properties
 * @param first 
 * @param second 
 */
export const objectDiff = (first: { [key: string]: any }, second: { [key: string]: any }, compareDatesAsDates: boolean = true): { [key: string]: { first: any, second: any } }  => {
    let keys = [...new Set(Object.keys(first).concat(Object.keys(second)))];
    let out = {};
    keys.forEach((key) => {
        let a = first[key];
        let b = second[key];
        let aComp = first[key];
        let bComp = second[key];
        if (compareDatesAsDates) {
            if (typeof a === 'string' && dateRegexp.test(a)) {
                a = new Date(a);
                aComp = a.getTime();
            }
            if (typeof b === 'string' && dateRegexp.test(b)) {
                b = new Date(b);
                bComp = b.getTime();
            }
            
        }
        if (aComp != bComp) {
            out[key] = {
                first: a,
                second: b,
            }
        }
    });
    return out;
}

/**
 * Convert Date to human readable date
 * @param date 
 */
export const dateToNiceString = (date: Date): string => {
    if (date) {
        return date.toISOString().substr(0, 19).replace('T', ' ');
    }
    return '';
}

export const dateToOnlyDateString = (date: Date): string => {
    if (date) {
        return date.toISOString().substr(0, 10);
    }
    return '';
}

export const dateToOnlyTimeString = (date: Date): string => {
    if (date) {
        return date.toISOString().substr(11, 8);
    }
    return '';
}

export const dateToMambuDateString = (date: Date): string => {
    if (date) {
        return date.toISOString().substr(0, 19) + '+0000';
    }
    return '';
}

export const formatPhoneFrontToBack = (phone: string, throwError: boolean = true): string => {
    if (phone.indexOf('0') === 0) {
        return '234' + phone.substr(1);
    }
    if (throwError) {
        throw new Error('formatPhoneFrontToBack :: Invalid phone number');
    }
    return phone;
}

export const formatPhoneBackToFront = (phone: string, throwError: boolean = true): string => {
    if (phone.indexOf('234') === 0) {
        return '0' + phone.substr(3);
    }
    if (throwError) {
        throw new Error('formatPhoneBackToFront :: Invalid phone number');
    }
    return phone;
}

export const formatPhoneBackToInternational = (phone: string, throwError: boolean = true): string => {
    if (phone.indexOf('234') === 0) {
        return '+' + phone;
    }
    if (throwError) {
        throw new Error('formatPhoneBackToInternational :: Invalid phone number');
    }
    return phone;
}

export const formatCustomFieldsWithMappingForBack = (customFields: { [key: string]: any }, groupIndexMap: { [key: string]: number }): { customFieldID: string, value: any, customFieldSetGroupIndex?: number }[] => {
    return Object.keys(customFields).map((key) => {
        let value = customFields[key];
        let out = {
            customFieldID: key,
            value: value
        };
        if (groupIndexMap.hasOwnProperty(key)) {
            out['customFieldSetGroupIndex'] = groupIndexMap[key];
        }
        return out;
    });
}

export const datetimeToDate = (datetime: string): string => {
    return datetime.substr(0, 10);
}
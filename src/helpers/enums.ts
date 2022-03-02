import { MambuCustomFieldInfo } from "../services/MambuService";



export const Enums = {
    documentType: ['SELFIE', 'UTILITY_BILL', 'BANK_STATEMENT', 'PASSPORT_FRONT', 'DRIVERS_LICENCE_FRONT', 'NIMC_ID_CARD_FRONT', 'VOTERS_IDENTITY_CARD_FRONT', 'PASSPORT_BACK', 'DRIVERS_LICENCE_BACK', 'NIMC_ID_CARD_BACK', 'VOTERS_IDENTITY_CARD_BACK'],
    usernameType: ['BVN', 'email_address', 'mobile_number']
}

export const EnumMappings = {
    documentType: {'SELFIE':'Selfie', 'UTILITY_BILL': 'Utility Bill', 'BANK_STATEMENT':'Bank Statement', 'PASSPORT_FRONT':'Passport - Front', 'DRIVERS_LICENCE_FRONT':'Drivers Licence - Front', 'NIMC_ID_CARD_FRONT':'NIMC ID Card - Front', 'VOTERS_IDENTITY_CARD_FRONT':'Voters Identity Card - Front', 'PASSPORT_BACK':'Passport - Back', 'DRIVERS_LICENCE_BACK':'Drivers Licence - Back', 'NIMC_ID_CARD_BACK':'NIMC ID Card - Back', 'VOTERS_IDENTITY_CARD_BACK':'Voters Identity Card - Back'},
}

export const enumMappingFromMambuCustomFieldInfo = (fieldInfo: MambuCustomFieldInfo): { [key: string]: string } => {
    let map = {};
    fieldInfo.customFieldSelectionOptions.forEach((val) => {
        let key = val.value.toUpperCase().replace(/[\\/]/g, ' ').replace(/[^A-Z ]/g, '').replace(/[ ]{2,}/g, ' ').replace(/[ ]/g, '_');
        map[key] = val.value;
    });
    return map;
}

export const mapEnumValue = (value: string, mapping: { [key: string]: string }, throwError: boolean = true): string => {
    if (mapping.hasOwnProperty(value)) {
        return mapping[value];
    }
    if (throwError) {
        throw new Error(`Value ${value} not found in mapping`);
    }
    return value;
}

export const unMapEnumValue = (value: string, mapping: { [key: string]: string }, throwError: boolean = true): string => {
    let reverseMapping = {};
    Object.keys(mapping).forEach((key) => {
        reverseMapping[mapping[key]] = key;
    });

    if (reverseMapping.hasOwnProperty(value)) {
        return reverseMapping[value];
    }
    if (throwError) {
        throw new Error(`Value ${value} not found in reverseMapping`);
    }
    return value;
}
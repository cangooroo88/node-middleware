import { MambuClient, MambuLoan } from "../services/MambuService";

export interface ISMSCode {
    code: string;
    codeValidUntil: Date;
    lastSent: Date;
}

/**
 * Check if client is verified by SMS in now time + toleranceMinutes (near future)
 * @param client 
 * @param toleranceMinutes 
 */
export const isClientVerified = (client: MambuClient, toleranceMinutes: number = 0): boolean => {
    let validUntil = getVerifiedUntilAsDate(client) || new Date(0);
    let now = new Date();
    if (validUntil.getTime() > (now.getTime() + (toleranceMinutes * 60 * 1000))) {
        return true;
    }
    return false;
}

/**
 * Get SMSVerifiedUntil as Date or returns null
 * @param client 
 */
export const getVerifiedUntilAsDate = (client: MambuClient): Date => {
    return client.SMSVerifiedUntil ? new Date(client.SMSVerifiedUntil) : null;
}

/**
 * Load SMSCode field from Mambu client
 * @param client 
 */
export const loadSMSCodeJson = (client: MambuClient): ISMSCode => {
    let data: any = {};
    if (client.SMSCode) {
        data = JSON.parse(client.SMSCode);
    }
    return {
        code: data.code || null,
        codeValidUntil: data.codeValidUntil ? new Date(data.codeValidUntil) : null,
        lastSent: data.lastSent ? new Date(data.lastSent) : null,
    };
}

/**
 * Builds SMSCode field for save it into Mambu
 * @param smsCode 
 */
export const buildSMSCodeJson = (smsCode: ISMSCode): string => {
    return JSON.stringify({
        code: smsCode.code || null,
        codeValidUntil: smsCode.codeValidUntil ? smsCode.codeValidUntil.toISOString() : null,
        lastSent: smsCode.lastSent ? smsCode.lastSent.toISOString() : null,
    });
}

/**
 * Load contract sign field from Mambu client
 * @param client 
 */
export const loadLoanSignJson = (loan: MambuLoan): ISMSCode => {
    let data: any = {};
    if (loan.signJSON) {
        data = JSON.parse(loan.signJSON);
    }
    return {
        code: data.code || null,
        codeValidUntil: data.codeValidUntil ? new Date(data.codeValidUntil) : null,
        lastSent: data.lastSent ? new Date(data.lastSent) : null,
    };
}

/**
 * Builds contract sign field for save it into Mambu
 * @param smsCode 
 */
export const buildLoanSignJson = (smsCode: ISMSCode): string => {
    return JSON.stringify({
        code: smsCode.code || null,
        codeValidUntil: smsCode.codeValidUntil ? smsCode.codeValidUntil.toISOString() : null,
        lastSent: smsCode.lastSent ? smsCode.lastSent.toISOString() : null,
    });
}
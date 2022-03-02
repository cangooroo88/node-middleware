/**
 * SalaryExtractionService
 */
import * as request from 'request';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';

export interface SalaryExtractionServiceConfig extends BasicAuthCredentials {
    url: string;
}

export interface SalaryExtractionServiceSendBankStatement {
    loanid: string;
    clientid: string;
    [key: string]: any;
}

/**
 * Service for communication with SalaryExtractionService
 */
export class SalaryExtractionService {

    /**
     * Creates SalaryExtractionService with credentials and url
     * 
     * @param config server config with credentials
     * @param url server url
     */
    constructor(protected config: SalaryExtractionServiceConfig) {}

    /**
     * Test endpoint
     */
    public hello(): Promise<string> {
        return baseRequest('SalaryExtractionService', this.config, 'GET', this.config.url, 200)
            .then((result) => result.body);
    }

    /**
     * Send JSON bank satement to SalaryExtractionService
     * 
     * @param bankStatement 
     */
    public sendBankStatement(bankStatement: SalaryExtractionServiceSendBankStatement): Promise<any> {
        return baseRequest('SalaryExtractionService', this.config, 'POST', this.config.url, 200, bankStatement)
            .then((result) => result.body);
    }

}
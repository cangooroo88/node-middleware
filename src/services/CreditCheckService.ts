/**
 * Decision API service
 */
import * as request from 'request';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';

export interface CreditCheckResult {
    status: 'SUCCESS' | 'FAILED' | 'ERROR';
    failtureReason?: string;
    message?: string;
}

export interface CreditCheckServiceConfig extends BasicAuthCredentials {
    url: string;
}

/**
 * Service for communication with credit check api
 */
export class CreditCheckService {

    /**
     * Creates CreditCheckService with credentials and url
     * 
     * @param config server config with credentials
     * @param url server url
     */
    constructor(protected config: CreditCheckServiceConfig) {}

    /**
     * Credit check
     * 
     * @param clientId id of mambu client
     * @param loanId id of mambu loan account     
     */
    public creditCheck(clientId: string, loanId: string): Promise<CreditCheckResult> {
        return baseRequest('CreditCheck', this.config, 'POST', this.config.url + '/credit/check/v1', 200, {
            clientId: clientId,
            loanId: loanId
        })
            .then((result) => result.body);
    }
}
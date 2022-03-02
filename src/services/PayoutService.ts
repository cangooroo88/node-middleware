/**
 * 
 * PayoutService
 * 
 * You must create instance of this class with credentials.
 */
import * as request from 'request';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';
import { tokenFullAplhabetGenerate } from '../helpers/security';

export interface PayoutServiceConfig extends BasicAuthCredentials {
    url: string;
}

/**
 * Response of offer letter document
 */
export interface PayoutServiceResponse {
    status: string;
    failureReason: string;
    message: string;
    transactionRef?: string;
}

/**
 * Service for generating documents
 */
export class PayoutService {

    /**
     * Creates PayoutService with credentials and url
     * 
     * @param config server config with credentials
     * @param url server url
     */
    constructor(protected config: PayoutServiceConfig) {}

    /**
     * Payout 
     * 
     * @param clientId client id from mambu
     * @param loanId loan id from mambu
     */
    public payout(clientId: string, loanId: string): Promise<PayoutServiceResponse> {
        return baseRequest('DecisionService', this.config, 'POST', this.config.url + '/payment/v1', 200, {
            clientId: clientId,
            loanId: loanId
        })
            .then((result) => result.body);
    }

}
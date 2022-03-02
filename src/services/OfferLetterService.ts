/**
 * 
 * OfferLetter api dao
 * 
 * You must create instance of this class with credentials.
 */
import * as request from 'request';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';
import { tokenFullAplhabetGenerate } from '../helpers/security';

export interface OfferLetterConfig {
    apiKey: string;
    apiKeyName: string;
    url: string;
}

/**
 * Response of offer letter document
 */
export interface OfferLetterResponse {
    status: string;
    data: {
        loan_id: string;
        base64: string;
        html: string;
    };
}

/**
 * Service for generating documents
 */
export class OfferLetterService {

    /**
     * Creates OfferLetterService with credentials and url
     * 
     * @param config server config with credentials
     * @param url server url
     */
    constructor(protected config: OfferLetterConfig) {}

    /**
     * OfferLetter 
     * 
     * @param loanId loan id from mambu
     * @param format response format
     * @param productId optional parameter of loan's product id
     */
    public getDocument(loanId: string, productId?: string, format = 'json'): Promise<OfferLetterResponse> {
        // requestId is random number
        return baseRequest('OfferLetterService', null, 'GET', this.config.url + '/offer_letter_automation/api/loan_offer_letter/' + loanId + '/' + tokenFullAplhabetGenerate(10) + '/' + format + '/' + productId, 200, undefined, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => {
                return result.body;
            });
    }

}
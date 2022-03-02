/**
 * 
 * BVNService
 * 
 * You must create instance of this class with credentials.
 */
import * as request from 'request';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';
import { tokenFullAplhabetGenerate } from '../helpers/security';

export interface BVNServiceConfig {
    apiKey: string;
    apiKeyName: string;
    url: string;
    path: string;
}

/**
 * Response for bvn validate
 * Status can be success, fail or error.
 * There will be message field in case of status = error.
 */
export interface BVNResponse {
    status: string;
    data: {
        BVN: string;
        profile_image: string;
        basic_data_image: string;
    };
    error?: string;
}

/**
 * Service for generating documents
 */
export class BVNService {

    /**
     * Creates BVNService with credentials and url
     * 
     * @param config server config with credentials
     * @param url server url
     */
    constructor(protected config: BVNServiceConfig) {}

    /**
     * Bvn validation
     * 
     * @param bvn client`s bvn
     */
    public verifyBVN(bvn: string): Promise<BVNResponse> {
        return baseRequest('BVNService', null, 'GET', this.config.url + this.config.path + bvn, 200, undefined, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => {
                return result.body;
            });
    }
}
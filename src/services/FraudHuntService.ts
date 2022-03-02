/**
 * FraudHuntService
 */
import * as request from 'request';
import { baseRequest } from '../helpers/http';

export interface FraudHuntResult {
    fingerprintKey: string;
    fraudScore: number;
}

export interface FraudHuntServiceConfig {
    cid: string;
    url: string;
}

/**
 * Service for communication with FraudHunt APIs
 */
export class FraudHuntService {

    /**
     * Creates FraudHuntService with config
     * 
     * @param config sercice config
     */
    constructor(protected config: FraudHuntServiceConfig) {}

    /**
     * Get FraudHunt response
     * 
     * @param fpKey key from FE
     */
    public getResponse(fpKey: string): Promise<FraudHuntResult> {
        return baseRequest('FraudHuntService', null, 'GET', this.config.url + '/GET/' + fpKey + '?type=json&token=' + this.config.cid, 200, null)
            .then((result) => result.body);
    }
}
/**
 * Decision API service
 */
import * as request from 'request';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';

export interface DecisionResult {
    status: 'SUCCESS' | 'FAILED' | 'ERROR';
    failtureReason?: string;
    message?: string;
    gdsResponseFlag?: 'A' | 'D' | 'R' | 'S' | 'C';
}

export interface DecisionParams {
    enableEmployerValidation?: boolean;
    enableCreditCheckValidation?: boolean;
    enableInterestRatePatch?: boolean;
    enableRepaymentAdjustment?: boolean;
}

export interface DecisionConfig extends BasicAuthCredentials {
    url: string;
}

/**
 * Service for communication with decision api
 */
export class DecisionService {

    /**
     * Creates DecisionService with credentials and url
     * 
     * @param config server config with credentials
     * @param url server url
     */
    constructor(protected config: DecisionConfig) {}

    /**
     * Make initial decision request to decision api
     * 
     * @param loanId id of mambu loan account
     * @param params params of decision
     */
    public makeInitialDecision(loanId: string, params: DecisionParams = {}): Promise<DecisionResult> {
        return baseRequest('DecisionService', this.config, 'POST', this.config.url + '/gds/initial/v1', 200, {
            ...params,
            loanId: loanId
        })
            .then((result) => result.body);
    }

    /**
     * Make final decision request to decision api
     * 
     * @param loanId id of mambu loan account
     * @param params params of decision
     */
    public makeFinalDecision(loanId: string): Promise<DecisionResult> {
        return baseRequest('DecisionService', this.config, 'POST', this.config.url + '/gds/final/v1', 200, {
            loanId: loanId
        })
            .then((result) => result.body);
    }
}
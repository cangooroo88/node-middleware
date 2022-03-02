import { BearerAuthCredentials, baseRequest } from "../helpers/http";

/**
 * 
 * PaystackService
 * 
 * You must create instance of this class
 */

export interface PaystackServiceConfig extends BearerAuthCredentials {
    url: string;
}

export interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data?: {
        id?: number;
        domain?: string;
        status?: ('success' | 'failed' | 'abandoned'); 
        reference?: string;
        amount?: number,
        message?: string;
        gateway_response?: string;
        paid_at?: string;
        created_at?: string;
        channel?: string;
        currency?: string;
        ip_address?: string;
        authorization?: {
            authorization_code?: string;
            bin?: string;
            last4?: string;
            exp_month?: string;
            exp_year?: string;
            channel?: string;
            card_type?: string;
            bank?: string;
            country_code?: string;
            brand?: string;
            reusable?: boolean;
            signature?: string;
        },
        metadata?: {
            referrer?: string;
            clientKey?: string;
        }
        // many other ...
    } 
}

/**
 * Service for Paystack
 */
export class PaystackService {

    /**
     * Creates PaystackService
     * 
     * @param config config
     */
    constructor(protected config: PaystackServiceConfig) {}

    /**
     * verify Paystack transaction
     * 
     * @param referenceId transaction reference
     */
    public verify(referenceId: string): Promise<PaystackVerifyResponse> {
        // requestId is random number
        return baseRequest('Paystack', this.config, 'GET', this.config.url + '/transaction/verify/' + referenceId, 200)
            .then((result) => {
                return result.body;
            });
    }

    /**
     * get Paystack transaction info
     *
     * @param referenceId transaction reference
     */
    public getPaymentInfo(referenceId?: string): Promise<any> {
        if (!referenceId) {
            return Promise.resolve();
        }
        return baseRequest('Paystack', this.config, 'GET', this.config.url + '/transaction/verify/' + referenceId, 200)
            .then((result) => {
                return result.body;
            });
    }

}
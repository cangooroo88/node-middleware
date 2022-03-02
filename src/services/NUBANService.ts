/**
 *
 * NUBANService
 *
 * You must create instance of this class with credentials.
 */
import { baseRequest } from '../helpers/http';

export interface NUBANServiceConfig {
    apiKey: string;
    apiKeyName: string;
    url: string;
    path: string;
}

/**
 * Service for creating renflex deposits
 */
export class NUBANService {

    constructor(protected config: NUBANServiceConfig) {}

    public createDeposit(clientKey: string, manager: string, depositType: string, mambuOfficer: string, product: string, depositTenor: number): any {

        return baseRequest('NUBANService', null, 'POST', this.config.url + this.config.path + '/generate', 200, {
            clientID: clientKey,
            productName: product,
            productType: 'SAVINGS',
            recommendedAmount: 20000,
            relationshipManager: manager,
            depositorType: "Retail",
            tenor: depositTenor,
            depositType: depositType,  // "New", "Existing"
            broker: mambuOfficer,
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }
}
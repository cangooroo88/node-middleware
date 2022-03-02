/**
 *
 * DepositWithdrawService
 *
 * You must create instance of this class with credentials.
 */
import { baseRequest } from '../helpers/http';
import { tokenNumericGenerate } from "../helpers/security";

export interface DepositWithdrawServiceConfig {
    apiKey: string;
    apiKeyName: string;
    url: string;
}

/**
 * Service to request deposit withdrawals
 */
export class DepositWithdrawService {

    constructor(protected config: DepositWithdrawServiceConfig) {}

    public createWithdrawal(accountId: string, clientId: string, ticketType: string, liquidationAmount: string, comment: string, createdBy: string = 'Zenoo') {

        const transactionId = clientId.slice(-8) + Date.now().toString().slice(-6) + tokenNumericGenerate(10);

        return baseRequest('DepositWithdrawService', null, 'POST', this.config.url + '/Liquidation/create', 200, {
            txn_id: transactionId,
            account_id: accountId,
            client_id: clientId,
            ticket_type: ticketType,
            liquidation_amount: liquidationAmount,
            comment: comment,
            created_by: createdBy,
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }
}
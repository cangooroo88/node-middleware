import { Next, Request, Response } from 'restify';
import { bodyValidator, ValidatorType } from './../helpers/validators';
import { EndpointsBase } from './EndpointsBase';
import { ConfigService } from "../app/ConfigService";
import { RegExps } from "../helpers/regexps";
import { DepositWithdrawService } from "../services/DepositWithdrawService";
import { MambuClient, MambuService } from "../services/MambuService";
import { MiddlewareError } from "../helpers/errors";

export class WithdrawEndpoints extends EndpointsBase {

    constructor (
        protected configService: ConfigService,
        protected withdrawService: DepositWithdrawService,
        protected mambuService: MambuService,
    ) {
        super(arguments, configService.ignoredMiddlewareErrors)
    }

    /**
     * POST /withdraw
     *
     */
    public endpointPOSTwithdrawal = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                clientKey: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.clientKey
                },
                withdrawalAmount: {
                    required: true,
                    type: ValidatorType.Number,
                },
                ticketType: {
                    required: true,
                    type: ValidatorType.Enum,
                    enum: ['Full_liquidation', 'Part_liquidation']
                },
                applicationKey: {
                    required: true,
                    type: ValidatorType.String,
                }
            });
        } catch (e) {
            return next(this.logRequestError(e, req));
        }

        let client: MambuClient = null;

        this.mambuService.getClient(body.clientKey)
            .then(promiseClient => {
                client = promiseClient;

                let comment = this.configService.depositWithdrawTestMessage ? 'Test Transaction' : '';

                return this.withdrawService.createWithdrawal(body.applicationKey, client.id, body.ticketType, body.withdrawalAmount.toString(), comment)
                    .then(response => {
                        if(response.status === 'success') {
                            res.send(200, {
                                ticketStatus: response.data.ticket_status,
                                transactionId: response.data.txn_id,
                                ticketId: response.data.ticket_id,
                                createdAt: response.data.date_created,
                                withdrawalAmount: Number(response.data.withdrawal_amount),
                            });
                            next();
                        } else {
                            throw new MiddlewareError(response.message);
                        }
                    })
            })
            .catch(this.baseCatch(req, next))
    }
}
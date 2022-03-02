import { Request, Response, Next } from 'restify';
import { bodyValidator, ValidatorType } from './../helpers/validators';
import { EndpointsBase } from './EndpointsBase';
import { ConfigService } from '../app/ConfigService';
import { MambuService, MambuClient, MambuAttachment, MambuLoan } from '../services/MambuService';
import { AWSRekognitionService } from '../services/AWSService';
import { Sanitize } from '../helpers/sanitizator';
import { mapFields } from '../helpers/mapper';
import { RegExps } from '../helpers/regexps';
import { MiddlewareError, AuthenticationError } from '../helpers/errors';
import { isClientVerified } from '../helpers/sms';
import { MyBankStatementService } from '../services/MyBankStatementService';
import { DecisionService, DecisionResult } from '../services/DecisionService';
import { Logger } from '../app/Logger';
import { PaystackService } from '../services/PaystackService';
import { dateToNiceString, dateToOnlyDateString, dateToOnlyTimeString, dateToMambuDateString } from '../helpers/utils';
import { CreditCheckService } from '../services/CreditCheckService';
import { BVNService } from '../services/BVNService';
import { SalaryExtractionService } from '../services/SalaryExtractionService';
import { FraudHuntService } from '../services/FraudHuntService';
import { mapEnumValue } from '../helpers/enums';
import { AuthenticationService } from '../services/AuthenticationService';

export class ValidateEndpoints extends EndpointsBase {

    constructor (
        protected configService: ConfigService,
        protected mambuService: MambuService,
        protected awsRekognitionService: AWSRekognitionService,
        protected bvnService: BVNService,
        protected myBankStatementService: MyBankStatementService,
        protected decisionService: DecisionService,
        protected paystackService: PaystackService,
        protected creditCheckService: CreditCheckService,
        protected salaryExtractionService: SalaryExtractionService,
        protected fraudHuntService: FraudHuntService,
        protected authenticationService: AuthenticationService,
    ) {
        super(arguments, configService.ignoredMiddlewareErrors);
    }

    /**
     * POST /validate/session
     *
     */
    public endpointPOSTValidateSession = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                token: {
                    required: true,
                    type: ValidatorType.String,
                }
            });
        } catch (e) {
            return next(this.logRequestError(e, req));
        }

        this.authenticationService.validateSession(body.token)
            .then((result) => {
                res.send(result.status === 'success' ? 200 : 401, {
                    success: result.status === 'success',
                });
            })
            .catch(e => {
                let response = e.responseBody;
                if(e.responseBody && e.responseBody.message === 'Invalid token') {
                    throw new AuthenticationError('unable_to_validate_token');
                }
                throw new Error(response ? response.message : 'unexpected_error');
            })
            .catch(this.baseCatch(req, next));

    }
}

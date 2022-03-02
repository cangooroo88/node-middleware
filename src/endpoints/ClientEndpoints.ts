import { Request, Response, Next } from 'restify';
import { bodyValidator, ValidatorType, ValidatorKeyOptions, stepBodyValidator } from './../helpers/validators';
import { EndpointsBase } from "./EndpointsBase";
import { ConfigService } from "../app/ConfigService";
import { MambuService, MambuClient, MambuAttachment, MambuLoanproduct, MambuDepositproduct, MambuDeposit, MambuLoan, MambuGroup, MambuInputFile } from '../services/MambuService';
import { RegExps } from '../helpers/regexps';
import { Logger } from '../app/Logger';
import { isClientVerified, getVerifiedUntilAsDate, loadSMSCodeJson, buildSMSCodeJson, ISMSCode, loadLoanSignJson, buildLoanSignJson } from '../helpers/sms';
import { objectDiff, dateToNiceString, formatPhoneFrontToBack, formatPhoneBackToInternational, formatCustomFieldsWithMappingForBack, datetimeToDate, formatPhoneBackToFront, dateToOnlyDateString, dateToOnlyTimeString } from '../helpers/utils';
import { getDepositRate, getKeyByValue } from '../helpers/depositHelpers';
import { tokenNumericGenerate } from '../helpers/security';
import { InfobipService } from '../services/InfobipService';
import { MiddlewareError, AuthenticationError } from '../helpers/errors';
import * as moment from 'moment';
import { Enums, mapEnumValue, EnumMappings, unMapEnumValue, enumMappingFromMambuCustomFieldInfo } from '../helpers/enums';
import { PDFService } from '../services/PDFService';
import { BVNService } from '../services/BVNService';
import { OfferLetterService } from '../services/OfferLetterService';
import { AuthenticationService } from '../services/AuthenticationService';
import { PaystackService } from '../services/PaystackService';
import { NUBANService } from "../services/NUBANService";

let sha1 = require('js-sha1');

export class ClientEndpoints extends EndpointsBase {

    constructor (
        protected configService: ConfigService,
        protected mambuService: MambuService,
        protected infobipService: InfobipService,
        protected bvnService: BVNService,
        protected offerLetterService: OfferLetterService,
        protected pdfService: PDFService,
        protected authenticationService: AuthenticationService,
        protected paystackService: PaystackService,
        protected nubanService: NUBANService,
    ) {
        super(arguments, configService.ignoredMiddlewareErrors);
    }

    /**
     * POST /client/search
     */
    public endpointPOSTClientSearch = (req: Request, res: Response, next: Next): any => {

        try {
            var body = bodyValidator(req.body, {
                phoneNumber: {
                    required: false,
                    type: ValidatorType.String,
                    regexp: RegExps.phoneNumber
                },
                bvn: {
                    required: false,
                    type: ValidatorType.String,
                    regexp: RegExps.bvn
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req));
        }

        if (Object.keys(body).length > 1) {
            return next(new MiddlewareError('more_than_one_search_value_provided'));
        }

        if (body.bvn) {
            // validate BVN before allow user to proceed
            this.bvnService.verifyBVN(body.bvn)
                .then((response) => {
                    // if response have any other status than 'success'
                    if (!(response.status && response.status === 'success')) {
                        throw new MiddlewareError('bvn_is_invalid');
                        // TODO: here set errorBVN to 'Yes' when implement BVN API shutdown overflow!
                    }
                    return this.authenticationService.getUserByBVN(body.bvn)
                })
                .then((response) => {
                    if (response.status === 'success' || (response.status === 'fail' && response.message === 'User does not exist')) {
                        res.send(200, {
                            userExists: response.status === 'success'
                        });
                        next();
                        return;
                    }
                    throw new MiddlewareError('unexpected_password_module_error');
                })
                .catch(this.baseCatch(req, next))

        } else if (body.phoneNumber) {
            return this.mambuService.searchClients(
                { MOBILE_PHONE_NUMBER: formatPhoneFrontToBack(body.phoneNumber) }
            )
                .then((client) => {
                    if (client.length === 1) {
                        res.send(200, {
                            clientKey: client[0].encodedKey
                        });
                        next();
                        return;
                    } else if (client.length > 1) {
                        throw new MiddlewareError('multiple_clients_found');
                    }
                    throw new MiddlewareError('client_not_found');
                })
                .catch(this.baseCatch(req, next));
        } else {
            return next(new MiddlewareError('no_search_value_provided'));
        }

    }

    /**
     * POST /client/login
     */
    public endpointPOSTClientLogin = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                username: {
                    required: true,
                    type: ValidatorType.String,
                },
                password: {
                    required: true,
                    type: ValidatorType.String,
                },
                usernameType: {
                    required: true,
                    type: ValidatorType.Enum,
                    enum: Enums.usernameType
                }
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        let token = null;
        let username = body.username;

        if(body.usernameType === 'mobile_number') {
            username = formatPhoneFrontToBack(username);
        }

        return this.authenticationService.authenticateUser(username, sha1(body.password), body.usernameType)
            .then(response => {
                token = response.data.token;
                return this.mambuService.searchClients({ ID: response.data.BVN })
                    .then((clients) => {
                        if (clients.length === 1) {
                            return clients[0];
                        } else if (clients.length > 1) {
                            throw new MiddlewareError('multiple_clients_found');
                        }
                        throw new MiddlewareError('client_not_found');
                    })
            })
            .then(client => {
                res.send(  200, {
                    token: token,
                    clientKey: client.encodedKey,
                });
                next();
            })
            .catch(e => {
                let response = e.responseBody;
                if(response && response.message === 'Invalid password') {
                    throw new AuthenticationError('invalid_authentication_data');
                }
                throw new Error(response ? response.message : 'unexpected_error');
            })
            .catch(this.baseCatch(req, next));

    }

    /**
     * POST /client/change-password
     */
    public endpointPOSTClientChangePassword = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                username: {
                    required: true,
                    type: ValidatorType.String,
                },
                password: {
                    required: true,
                    type: ValidatorType.String
                },
                newPassword: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.password
                },
                usernameType: {
                    required: true,
                    type: ValidatorType.Enum,
                    enum: Enums.usernameType
                },
                isPasswordReset: {
                    required: false,
                    type: ValidatorType.Boolean
                },
                token: {
                    required: true,
                    type: ValidatorType.String,
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        let username = body.username;
        // because of renmoney we using the same endpoint for reset password as for change password
        // so password value set by renmoney themselves and not encoded at this moment
        let password = body.isPasswordReset ? body.password : sha1(body.password);
        if(body.usernameType === 'mobile_number') {
            username = formatPhoneFrontToBack(username);
        }

        return this.authenticationService.changeUserPassword(username, password, sha1(body.newPassword), body.usernameType, body.token)
            .then(result => {
                res.send(result.status === 'success' ? 200 : 401, {
                    ok: result.status === 'success',
                });
                next();
            }).catch(e => {
                let response = e.responseBody;
                if (response && response.status === 'fail' && response.message === 'Invalid current password') {
                    res.send( 401, {
                        ok: false,
                    });
                    next();
                }
                throw new Error(response ? response.message : 'unexpected_error');
            }).catch(this.baseCatch(req, next));
    }

    /**
     * POST /client/reset-password
     */
    public endpointPOSTClientResetPassword = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                bvn: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.bvn
                }
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        return this.authenticationService.initiateResetPassword(body.bvn)
            .then(() => {
                res.send(200, {
                    ok: true
                })
            }).catch(this.baseCatch(req, next));
    }

    /**
     * POST /client/reset-password-confirm
     */
    public endpointPOSTClientResetPasswordConfirm = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                resetCode: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.resetCode
                },
                phoneNumber: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.phoneNumber
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        return this.authenticationService.confirmResetPassword(body.resetCode, formatPhoneFrontToBack(body.phoneNumber))
            .then(result => {
                const success = result.status === 'success';
                this.authenticationService.authenticateUser(formatPhoneFrontToBack(body.phoneNumber), body.resetCode, 'mobile_number')
                    .then(result => {
                        res.send(success ? 200 : 400, {
                            ok: success,
                            token: result.data.token
                        });
                        next();
                    })
            }).catch(e => {
                let response = e.responseBody;
                if(response && response.status === 'fail' && (response.message === 'OTP expired' || response.message === 'OTP not found')) {
                    throw new AuthenticationError(response.message)
                }
                throw new Error(response ? response.message : 'unexpected_error');
            })
            .catch(this.baseCatch(req, next));
    }

    /**
     * POST /client/set-security-pin
     */
    public endpointPOSTClientSetSecurityPin = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                securityPin: {
                    required: true,
                    type: ValidatorType.String
                },
                token: {
                    required: true,
                    type: ValidatorType.String,
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        return this.authenticationService.validateSession(body.token)
            .then(response => {
                return this.authenticationService.setSecurityPin(response.bvn, body.securityPin, body.token)
            })
            .then(result => {
                let success = result.status === 'success';
                res.send(success ? 200 : 401, {
                    ok: success
                });
                next();
            })
            .catch(e => {
                let response = e.responseBody;
                if (response && response.message === 'Invalid token') {
                    throw new AuthenticationError('unable_to_validate_token')
                }
                throw new Error(response ? response.message : 'unexpected_error');
            }).catch(this.baseCatch(req, next));

    }

    /**
     * POST /client/change-security-pin
     */
    public endpointPOSTClientChangeSecurityPin = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                bvn: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.bvn
                },
                securityPin: {
                    required: true,
                    type: ValidatorType.String
                },
                newSecurityPin: {
                    required: true,
                    type: ValidatorType.String
                },
                token: {
                    required: true,
                    type: ValidatorType.String,
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        return this.authenticationService.changeSecurityPin(body.bvn, body.securityPin, body.newSecurityPin, body.token)
            .then(result => {
                // keep it a bit flexible in the case we got something unexpected in response
                let success = result.status === 'success';
                res.send(success ? 200 : 401, {
                    ok: success
                });
                next();
            }).catch(e => {
                // specify response in the case of the wrong security pin in order to properly track error on the FE
                let response = e.responseBody;
                if (response && response.message === 'Invalid current security pin') {
                    throw new MiddlewareError('invalid_pin')
                } else if (response && response.message === 'Invalid token') {
                    throw new AuthenticationError('unable_to_validate_token')
                }
                throw new Error(response ? response.message : 'unexpected_error');
            }).catch(this.baseCatch(req, next));
    }

    /**
     * POST /client/validate-security-pin
     */
    public endpointPOSTClientValidateSecurityPin = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                bvn: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.bvn
                },
                securityPin: {
                    required: true,
                    type: ValidatorType.String
                },
                token: {
                    required: true,
                    type: ValidatorType.String,
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        return this.authenticationService.validateSecurityPin(body.bvn, body.securityPin, body.token)
            .then(result => {
                // keep it a bit flexible in the case we got something unexpected in response
                let success = result.status === 'success';
                res.send(success ? 200 : 401, {
                    ok: success
                });
                next();
            }).catch(e => {
                // specify response in the case of the wrong security pin in order to properly track error on the front
                let response = e.responseBody;
                if (response && response.message === 'Invalid current security pin') {
                    throw new MiddlewareError('invalid_pin')
                } else if (response && response.message === 'Invalid token') {
                    throw new AuthenticationError('unable_to_validate_token')
                }
                throw new Error(response ? response.message : 'unexpected_error');
            }).catch(this.baseCatch(req, next));
    }

    /**
     * POST /client/reset-security-pin
     */
    public endpointPOSTClientResetSecurityPin = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                token: {
                    required: true,
                    type: ValidatorType.String,
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req))
        }

        return this.authenticationService.resetSecurityPin(body.token)
            .then(result => {
                // keep it a bit flexible in the case we got something unexpected in response
                let success = result.status === 'success';
                res.send(success ? 200 : 401, {
                    ok: success
                });
                next();
            }).catch(e => {
                // specify response in the case of the wrong security pin in order to properly track error on the front
                let response = e.responseBody;
                if (response && response.message === 'Invalid token') {
                    throw new AuthenticationError('unable_to_validate_token')
                }
                throw new Error(response ? response.message : 'unexpected_error');
            }).catch(this.baseCatch(req, next));
    }

    /**
     * POST /client/deposit-application
     */
    public endpointPOSTClientDepositApplication = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                clientKey: {
                    required: true,
                    type: ValidatorType.String,
                    regexp: RegExps.clientKey
                },
                depositProduct: {
                    required: true,
                    type: ValidatorType.String,
                    max: 128
                },
                depositAmount: {
                    required: true,
                    type: ValidatorType.Number,
                    needsInteger: true,
                },
                depositTerm: {
                    required: false,
                    type: ValidatorType.Number,
                    needsInteger: true,
                },
                token: {
                    required: true,
                    type: ValidatorType.String,
                },
                paystackReference: {
                    required: false,
                    type: ValidatorType.String,
                },
                interestRate: {
                    required: false,
                    type: ValidatorType.Number,
                },
                referral: {
                    required: false,
                    type: ValidatorType.String,
                },
            });
        } catch (e) {
            return next(this.logRequestError(e, req));
        }

        let mambuDepositProductKey: string = null;

        if (this.configService.mambuDepositProductKeys.hasOwnProperty(body.depositProduct)) {
            mambuDepositProductKey = this.configService.mambuDepositProductKeys[body.depositProduct];
        }

        if (!mambuDepositProductKey) {
            return next(this.logRequestError(new MiddlewareError('invalid_deposit_product'), req));
        }

        let product: MambuDepositproduct = null;
        let paystackReferenceAmount = null;

        this.paystackService.getPaymentInfo(body.paystackReference)
            .then(result => {
                paystackReferenceAmount = result ? result.data.amount / 100 : undefined;
                return this.mambuService.getDepositProducts();
            })
            .then((products) => {
                let product = products.find((p) => p.encodedKey === mambuDepositProductKey);
                if (!product) {
                    throw new Error('product not found');
                }
                return product;
            })
            .then((mambuProduct) => {
                product = mambuProduct;

                let amountMin = 50000;
                if (body.depositProduct === 'RENFLEX_DEPOSIT') {
                    amountMin = 5000;
                }

                let termMin = product.minMaturityPeriod;
                let termMax = product.maxMaturityPeriod;

                // compare amount from paystack with minimum amount
                // TODO: currently hardcoded minimum amount, find a way to keep it in sync with FE ?
                if (body.paystackReference && paystackReferenceAmount < amountMin) {
                    throw new MiddlewareError('deposit_amount_too_low');
                    // if created without the paystack - compare with depositAmount from the body
                } else if (body.depositAmount < amountMin) {
                    throw new MiddlewareError('deposit_amount_too_low');
                }

                if (body.depositProduct === 'FIXED_DEPOSIT' && !body.depositAmount) {
                    throw new MiddlewareError('unable_to_create fixed_deposit_without_deposit_amount');
                }

                if (body.depositTerm < termMin) {
                    throw new MiddlewareError('deposit_term_too_low');
                }
                if (termMax < body.depositTerm) {
                    throw new MiddlewareError('deposit_term_too_high');
                }

                return;
            })
            .then(() => {
                let depositTenor = body.depositTerm ? body.depositTerm : 30;

                let depositType = 'New';
                let product = undefined;
                if (body.depositProduct === 'RENFLEX_DEPOSIT') {
                    depositTenor = 365;
                    product = 'SV_RENFLEX';
                } else if (body.depositProduct === 'FIXED_DEPOSIT') {
                    product = 'SV_FIXED_DEPOSIT'
                }

                return this.mambuService.getDepositsForClient(body.clientKey)
                    .then(deposits => {
                        deposits.some(d => {
                            if(d.productTypeKey === this.configService.mambuDepositProductKeys.RENFLEX_DEPOSIT || d.productTypeKey === this.configService.mambuDepositProductKeys.FIXED_DEPOSIT) {
                                depositType = 'Existing';
                                return true;
                            }
                        });
                        return;
                    })
                    .then(() => {
                        return this.nubanService.createDeposit(body.clientKey, this.configService.NUBANRelationshipManager, depositType, this.configService.NUBANRelationshipManager, product, depositTenor)
                    })
            })
            .then(deposit => {
                // if created with paystack - make deposit transaction
                let depositId = deposit.data.account_id;

                if (body.referral) {
                    this.mambuService.patchDeposit(depositId, {
                        referral: body.referral
                    })
                        .catch (e => {
                            Logger.error('Unable to patch savings account (referral)');
                        })
                }

                if (body.paystackReference) {
                    return this.mambuService.addDepositTransaction(depositId, 'DEPOSIT', paystackReferenceAmount)
                        .then(() => {
                            return deposit;
                        })
                }

                // here we're getting actual product because in previous chain we can get response from nuban api
                return this.mambuService.getDepositRaw(depositId);
            })
            .then((deposit) => {
                let productId = deposit.savingsAccount ? deposit.savingsAccount.id : deposit.id;

                // checking if interestRate values matches on BE and FE to keep them in sync
                // TODO: remove all rate-related code since our application not responsible for it anymore
                if(body.depositProduct !== 'RENFLEX_DEPOSIT'
                    && (body.interestRate && paystackReferenceAmount)
                    && getDepositRate(paystackReferenceAmount, body.depositTerm) !== body.interestRate) {
                    Logger.error(`Interest rate provided by the FE does not match with one used on the BE, using BE value`);
                }
                // check depositAmount provided by the FE and returned in the paystack reference
                if(body.paystackReference && paystackReferenceAmount !== body.depositAmount) {
                    Logger.error('Deposit amount passed by the FE does not match with one that returned by the paystack reference, using one from the paystack');
                }

                res.send(201, {
                    ok: true,
                    productId: productId,
                });
                next();
            })
            .catch(this.baseCatch(req, next));

    }

    /**
     * PATCH /client/deposit-application
     */
    public endpointPATCHClientDepositApplication = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.body, {
                applicationKey: {
                    required: true,
                    type: ValidatorType.String,
                },
                depositAmount: {
                    required: true,
                    type: ValidatorType.Number
                },
                paystackReference: {
                    required: true,
                    type: ValidatorType.String,
                }
            });
        } catch (e) {
            return next(this.logRequestError(e, req));
        }

        let paystackReferenceAmount = null;

        return this.paystackService.verify(body.paystackReference)
            .then(result => {
                paystackReferenceAmount = result.data.amount / 100;

                if (paystackReferenceAmount !== body.depositAmount) {
                    Logger.error('Deposit amount passed by the FE does not match with one that returned by the paystack reference, using one from the paystack');
                }

                return this.mambuService.getDepositRaw(body.applicationKey);
            }).then((deposit) => {
                // here we're going to check any product details that we possibly want to check depending on the product type specifications
                if (deposit.accountType === 'FIXED_DEPOSIT') {
                    throw new MiddlewareError('Cannot top-up fixed deposit')
                }

                return this.mambuService.addDepositTransaction(body.applicationKey, 'DEPOSIT', paystackReferenceAmount)
            })
            .then(() => {
                // all okay
                res.send(200, {
                    ok: true,
                });
                next();
            })
            .catch(this.baseCatch(req, next));

    }

    /**
     * GET /client/:token/deposits
     */
    public endpointGETClientDeposits = (req: Request, res: Response, next: Next): any => {
        try {
            var body = bodyValidator(req.params, {
                token: {
                    required: true,
                    type: ValidatorType.String,
                },
            })
        } catch (e) {
            return next(this.logRequestError(e, req));
        }

        this.authenticationService.validateSession(body.token)
            .then(result => {
                return this.mambuService.getDepositsForClient(result.data.BVN, true)
            })
            .then(products => {
                let clientProducts = [];
                products.forEach(p => {
                    // prepare product name (based on productType key from the config)
                    const product = getKeyByValue(this.configService.mambuDepositProductKeys, p.productTypeKey);
                    // extract custom field
                    let customField = p.customFieldValues.find(field => {
                        return field.customFieldID === 'Deposit_tenor'
                    });
                    if (product) {
                        clientProducts.push({
                            depositId: p.id,
                            product: product,
                            accountState: p.accountState,
                            balance: p.balance,
                            accruedInterest: p.accruedInterest,
                            maturityDate: p.maturityDate,
                            interestRate: p.interestSettings.interestRate,
                            depositTerm: customField ? customField.value : undefined,
                        })
                    }
                });
                return clientProducts
            })
            .then(clientProducts => {
                res.send(200, {
                    products: clientProducts
                });
                next();
            })
            .catch(e => {
                let response = e.responseBody;
                if (response && response.message === 'Invalid token') {
                    throw new AuthenticationError('unable_to_validate_token')
                }
                throw new Error(response ? response.message : 'unexpected_error');
            }).catch(this.baseCatch(req, next))

    }

}

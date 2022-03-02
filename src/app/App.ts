import { Server } from 'restify';
import { ConfigService } from './ConfigService';
import { ClientEndpoints } from '../endpoints/ClientEndpoints';
import { MambuService } from '../services/MambuService';
import { AWSRekognitionService } from '../services/AWSService';
import { ProductsEndpoints } from '../endpoints/ProductsEndpoints';
import { EmployerEndpoints } from '../endpoints/EmployerEndpoints';
import { ValidateEndpoints } from '../endpoints/ValidateEndpoints';
import { FieldsEndpoints } from '../endpoints/FieldsEndpoints';
import { WithdrawEndpoints } from '../endpoints/WithdrawEndpoints';
import { InfobipService } from '../services/InfobipService';
import { MyBankStatementService } from '../services/MyBankStatementService';
import { DecisionService } from '../services/DecisionService';
import { PDFService } from '../services/PDFService';
import { PaystackService } from '../services/PaystackService';
import { CreditCheckService } from '../services/CreditCheckService';
import { BVNService } from '../services/BVNService';
import { OfferLetterService } from '../services/OfferLetterService';
import { SalaryExtractionService } from '../services/SalaryExtractionService';
import { PayoutService } from '../services/PayoutService';
import { PayoutEndpoints } from '../endpoints/PayoutEndpoints';
import { FraudHuntService } from '../services/FraudHuntService';
import { AuthenticationService } from '../services/AuthenticationService';
import { DepositWithdrawService } from "../services/DepositWithdrawService";
import { NUBANService } from '../services/NUBANService';

const Raven = require('raven');

export class App {

    // services
    protected configService: ConfigService = null;
    protected mambuService: MambuService = null;
    protected infobipService: InfobipService = null;
    protected awsRekognitionService: AWSRekognitionService = null;
    protected myBankStatementService: MyBankStatementService = null;
    protected decisionService: DecisionService = null;
    protected pdfService: PDFService = null;
    protected paystackService: PaystackService = null;
    protected creditCheckService: CreditCheckService = null;
    protected bvnService: BVNService = null;
    protected offerLetterService: OfferLetterService = null;
    protected authenticationService: AuthenticationService = null;
    protected salaryExtractionService: SalaryExtractionService = null;
    protected payoutService: PayoutService = null;
    protected fraudHuntService: FraudHuntService = null;
    protected depositWithdrawService: DepositWithdrawService = null;
    protected nubanService: NUBANService = null;

    // managers

    // enpoints
    protected clientEndpoints: ClientEndpoints = null;
    protected employerEndpoints: EmployerEndpoints = null;
    protected productsEndpoints: ProductsEndpoints = null;
    protected validateEndpoints: ValidateEndpoints = null;
    protected fieldsEndpoints: FieldsEndpoints = null;
    protected payoutEndpoints: PayoutEndpoints = null;
    protected withdrawEndpoints: WithdrawEndpoints = null;

    constructor(
        protected server: Server,
        protected environment: string
    ) {}

    /**
     * Initialize all app components for server
     */
    initServerFork(): Promise<{port:number, host:string}> {
        return new Promise<{port:number, host:string}>((resolve, reject) => {

            // services
            this.configService = new ConfigService(this.environment);
            this.mambuService = new MambuService({
                url: this.configService.mambuUrl,
                username: this.configService.mambuUsername,
                password: this.configService.mambuPassword,
                robotUserKey: this.configService.mambuRobotUserKey,
                officerUserKey: this.configService.mambuOfficerUserKey,
                branchKey: this.configService.mambuBranchKey,
                groupedNames: this.configService.mambuGroupedNames,
                clientRole: this.configService.mambuClientRole,
                useMockupFieldsInfo: this.configService.mambuUseMockupFieldsInfo,
                mockupFieldsInfo: this.configService.mockupDataConst.fieldsInfo,
            });
            this.infobipService = new InfobipService({
                url: this.configService.infobipUrl,
                username: this.configService.infobipUsername,
                password: this.configService.infobipPassword,
            });
            this.bvnService = new BVNService({
                url: this.configService.bvnApiUrl,
                path: this.configService.bvnApiPath,
                apiKeyName: this.configService.bvnApiKeyName,
                apiKey: this.configService.bvnApiKey,
            });
            this.offerLetterService = new OfferLetterService({
                url: this.configService.offerLetterApiUrl,
                apiKeyName: this.configService.offerLetterApiKeyName,
                apiKey: this.configService.offerLetterApiKey,
            });
            this.authenticationService = new AuthenticationService({
                url: this.configService.authenticationServiceUrl,
                path: this.configService.authenticationServicePath,
                apiKeyName: this.configService.authenticationServiceApiKeyName,
                apiKey: this.configService.authenticationServiceApiKey,
            });
            this.awsRekognitionService = new AWSRekognitionService({
                region: this.configService.awsRegion,
                accessKeyId: this.configService.awsAccessKeyId,
                secretAccessKey: this.configService.awsSecretAccessKey
            });
            this.myBankStatementService = new MyBankStatementService({
                url: this.configService.myBankStatementUrl,
                clientId: this.configService.myBankStatementClientId,
                clientPasscode: this.configService.myBankStatementClientPasscode,
            });
            this.decisionService = new DecisionService({
                url: this.configService.decisionEngineUrl,
                username: this.configService.decisionEngineUsername,
                password: this.configService.decisionEnginePassword,
            })
            this.pdfService = new PDFService({
            });
            this.paystackService = new PaystackService({
                url: this.configService.paystackUrl,
                secret: this.configService.paystackSecret,
            });
            this.creditCheckService = new CreditCheckService({
                url: this.configService.creditCheckUrl,
                username: this.configService.creditCheckUsername,
                password: this.configService.creditCheckPassword,
            });
            this.salaryExtractionService = new SalaryExtractionService({
                url: this.configService.salaryExtractionServiceUrl,
                username: this.configService.salaryExtractionServiceUsername,
                password: this.configService.salaryExtractionServicePassword,
            });
            this.payoutService = new PayoutService({
                url: this.configService.payoutUrl,
                username: this.configService.payoutUsername,
                password: this.configService.payoutPassword,
            });
            this.fraudHuntService = new FraudHuntService({
                url: this.configService.fraudHuntUrl,
                cid: this.configService.fraudHuntCid,
            });
            this.depositWithdrawService = new DepositWithdrawService({
                url: this.configService.depositWithdrawUrl,
                apiKeyName: this.configService.depositWithdrawApiKeyName,
                apiKey: this.configService.depositWithdrawApiKey,
            });
            this.nubanService = new NUBANService({
                url: this.configService.NUBANServiceUrl,
                path: this.configService.NUBANServicePath,
                apiKeyName: this.configService.NUBANServiceApiKeyName,
                apiKey: this.configService.NUBANServiceApiKey,
            });

            // config Sentry (Raven)
            if (this.configService.sentryUrl) {
                Raven.config(this.configService.sentryUrl, {
                    environment: this.configService.sentryEnvironment,
                }).install();
            }

            // endpoints
            this.clientEndpoints = new ClientEndpoints(this.configService, this.mambuService, this.infobipService, this.bvnService, this.offerLetterService, this.pdfService, this.authenticationService, this.paystackService, this.nubanService);
            this.employerEndpoints = new EmployerEndpoints(this.configService, this.mambuService);
            this.productsEndpoints = new ProductsEndpoints(this.configService, this.mambuService);
            this.validateEndpoints = new ValidateEndpoints(this.configService, this.mambuService, this.awsRekognitionService, this.bvnService, this.myBankStatementService, this.decisionService, this.paystackService, this.creditCheckService, this.salaryExtractionService, this.fraudHuntService, this.authenticationService);
            this.fieldsEndpoints = new FieldsEndpoints(this.configService, this.mambuService, this.myBankStatementService);
            this.payoutEndpoints = new PayoutEndpoints(this.configService, this.mambuService, this.payoutService);
            this.withdrawEndpoints = new WithdrawEndpoints(this.configService, this.depositWithdrawService, this.mambuService);

            this.initRouter(this.server);

            resolve({
                port: this.configService.serverPort,
                host: this.configService.serverListenHost,
            });
        });
    }

    /**
     * Attach all routes to server
     * @param server 
     */
    protected initRouter(server: Server): void {

        // products
        server.get('/api/v1/products', this.productsEndpoints.endpointGETProducts);
        
        // client
        server.post('/api/v1/client', this.clientEndpoints.endpointPOSTClient);
        server.patch('/api/v1/client', this.clientEndpoints.endpointPATCHClient);
        server.post('/api/v1/client/search', this.clientEndpoints.endpointPOSTClientSearch);
        server.post('/api/v1/client/verification-code', this.clientEndpoints.endpointPOSTClientVerificationCode);
        server.put('/api/v1/client/verification-code', this.clientEndpoints.endpointPUTClientVerificationCode);

        server.post('/api/v1/client/files', this.clientEndpoints.endpointPOSTClientFiles);
        server.post('/api/v1/client/loan-application', this.clientEndpoints.endpointPOSTClientLoanApplication);
        server.patch('/api/v1/client/loan-application', this.clientEndpoints.endpointPATCHClientLoanApplication);

        server.post('/api/v1/client/login', this.clientEndpoints.endpointPOSTClientLogin);
        server.post('/api/v1/client/change-password', this.clientEndpoints.endpointPOSTClientChangePassword);
        server.post('/api/v1/client/reset-password', this.clientEndpoints.endpointPOSTClientResetPassword);
        server.post('/api/v1/client/reset-password-confirm', this.clientEndpoints.endpointPOSTClientResetPasswordConfirm);

        server.post('/api/v1/client/set-security-pin', this.clientEndpoints.endpointPOSTClientSetSecurityPin);
        server.post('/api/v1/client/change-security-pin', this.clientEndpoints.endpointPOSTClientChangeSecurityPin);
        server.post('/api/v1/client/validate-security-pin', this.clientEndpoints.endpointPOSTClientValidateSecurityPin);
        server.post('/api/v1/client/reset-security-pin', this.clientEndpoints.endpointPOSTClientResetSecurityPin);

        server.post('/api/v1/client/deposit-application', this.clientEndpoints.endpointPOSTClientDepositApplication);
        server.patch('/api/v1/client/deposit-application', this.clientEndpoints.endpointPATCHClientDepositApplication);

        server.post('/api/v1/client/contract/sign', this.clientEndpoints.endpointPOSTClientContractSign);
        server.put('/api/v1/client/contract/sign', this.clientEndpoints.endpointPUTClientContractSign);

        server.get('/api/v1/client/:clientKey', this.clientEndpoints.endpointGETClient);
        server.get('/api/v1/client/:clientKey/token/:token', this.clientEndpoints.endpointGETClient);
        server.get('/api/v1/client/:clientKey/loan-info', this.clientEndpoints.endpointGETClientLoanInfo);
        server.get('/api/v1/client/:clientKey/contract', this.clientEndpoints.endpointGETClientContract);
        server.get('/api/v1/client/:token/deposits', this.clientEndpoints.endpointGETClientDeposits);

        // employer
        server.post('/api/v1/employer/suggest', this.employerEndpoints.endpointPOSTEmployerSuggest);
        server.post('/api/v1/employer/add', this.employerEndpoints.endpointPOSTEmployerAdd);
        server.get('/api/v1/employer/:employerKey', this.employerEndpoints.endpointGETEmployer);
        
        // fields
        server.get('/api/v1/fields/employer-states', this.fieldsEndpoints.endpointGETEmployerStates);
        server.get('/api/v1/fields/client-states', this.fieldsEndpoints.endpointGETClientStates);
        server.get('/api/v1/fields/loan', this.fieldsEndpoints.endpointGETLoan);
        server.get('/api/v1/fields/enums', this.fieldsEndpoints.endpointGETEnums);
        server.get('/api/v1/fields/statement-banks', this.fieldsEndpoints.endpointGETStatementBanks);

        // validations
        server.post('/api/v1/validate/facematch/selfie', this.validateEndpoints.endpointPOSTValidateFacematchSelfie);
        server.post('/api/v1/validate/facematch/id-card', this.validateEndpoints.endpointPOSTValidateFacematchIdCard);
        server.post('/api/v1/validate/decision-engine', this.validateEndpoints.endpointPOSTValidateDecisionEngine);
        server.post('/api/v1/validate/payment-method', this.validateEndpoints.endpointPOSTValidatePaymentMethod);
        server.post('/api/v1/validate/paystack', this.validateEndpoints.endpointPOSTValidatePaystack);
        server.post('/api/v1/validate/credit-check', this.validateEndpoints.endpointPOSTValidateCreditCheck);
        server.post('/api/v1/validate/bank-statement/request', this.validateEndpoints.endpointPOSTValidateBankStatementRequest);
        server.post('/api/v1/validate/bank-statement/request-status', this.validateEndpoints.endpointPOSTValidateBankStatementRequestStatus);
        server.post('/api/v1/validate/bank-statement/confirm', this.validateEndpoints.endpointPOSTValidateBankStatementConfirm);
        server.post('/api/v1/validate/bank-statement/finish', this.validateEndpoints.endpointPOSTValidateBankStatementFinish);
        server.post('/api/v1/validate/fraud-hunt', this.validateEndpoints.endpointPOSTValidateFraudHunt);
        server.post('/api/v1/validate/session', this.validateEndpoints.endpointPOSTValidateSession);

        // payout
        server.post('/api/v1/payout', this.payoutEndpoints.endpointPOSTPayout);

        // withdrawals
        server.post('/api/v1/withdrawal', this.withdrawEndpoints.endpointPOSTwithdrawal);
    }
}
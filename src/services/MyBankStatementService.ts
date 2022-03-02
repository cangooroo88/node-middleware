/**
 * 
 * MyBankStatement api dao
 * 
 * You must create instance of this class with credentials.
 */
import * as soap from 'soap';

export interface MyBankStatementRequestStatement {
    AccountNo: string;
    BankID: string;
    StartDate: string;
    EndDate: string;
    Role: string;
    username: string;
    country: string;
    phone: string;
    ApplicantNames: string;
}

export interface MyBankStatementRequestStatementResponse {
    RequestStatementResult: string;
}

export interface MyBankStatementClient {
}

export interface MyBankStatementConfirmStatement {
    TicketNO: string;
    Password: string;
}

export interface MyBankStatementConfirmStatementResponse {
    confirmStatementResult: string;
}

export interface MyBankStatementGetStatementJSONObject {
    ticketID: string;
    password: string;
}

export interface MyBankStatementGetStatementJSONObjectResponse {
    GetStatementJSONObjectResult: string;
}

export interface MyBankStatementGetPDFStatement {
    ticketID: string;
}

export interface MyBankStatementGetPDFStatementResponse {
    GetPDFStatementResult: string;
}

export interface MyBankStatementViewRequests {
    filter: string;
}

export interface MyBankStatementViewRequestsResponse {
    ViewRequestsResult: {
        diffgram: {
            NewDataSet: {
                Table: {
                    requestID: string;
                    Name: string;
                    ticketID: string;
                    Column1: string;
                    Period: string;
                    username: string;
                    nuban: string;
                    Telephone: string;
                    TIMESTAMP: string;
                    status: string;
                }
            }
        }
    };
}

export interface MyBankStatementSelectActiveRequestBanksResponse {
    SelectActiveRequestBanksResult: {
        diffgram: {
            NewDataSet: {
                Table: {
                    id: string,
                    name: string,
                    sortCode: string,
                }[];
            }
        }
    }
}

export interface MyBankStatementConfig {
    url: string;
    clientId: string;
    clientPasscode: string;
}

/**
 * Service for communication with MyBankStatement by soap api
 */
export class MyBankStatementService {
    static readonly BANK_STATEMENT_API_URL = 'https://mybankstatement.net/TPServices/webservice.asmx?wsdl';
    protected client: {[method: string]: (args?: {}) => Promise<any>};

    /**
     * Creates BankStatementService with credentials and url
     *
     * @param config server config with credentials and url
     * @param url server url
     * @param onReady callback when soap client is created
     */
    constructor(protected config: MyBankStatementConfig, onReady: () => void = null) {

        /**
         * createClientAsync not work... never mind, I will create promises in proxy object.
         */
        const t = soap.createClient(this.config.url, (err, client) => {
            this.client = this.wrapClient(client, this.config);
            if (onReady) {
                onReady();
            }
        });
    }

    /**
     * Hello world - test soap
     */
    public helloWorld() {
        if (!this.client) {
            return Promise.reject('MyBankStatement :: Client is not ready');
        }
        return this.client.HelloWorld()
            .then((result) => {
                return result;
            });
    }

    /**
     * Select active request banks ... what is it??
     */
    public selectActiveRequestBanks(): Promise<MyBankStatementSelectActiveRequestBanksResponse> {
        if (!this.client) {
            return Promise.reject('MyBankStatement :: Client is not ready');
        }
        return this.client.SelectActiveRequestBanks({});
    }

    /**
     * Request statement
     *
     * @param request request structure with client data
     */
    public requestStatement(request: MyBankStatementRequestStatement): Promise<MyBankStatementRequestStatementResponse> {
        if (!this.client) {
            return Promise.reject('MyBankStatement :: Client is not ready');
        }
        return this.client.RequestStatement(request);
    }

    /**
     * Confirm statement by ticket number and password (?)
     *
     * @param TicketNO 
     * @param Password 
     */
    public confirmStatement(confirm: MyBankStatementConfirmStatement): Promise<{confirmStatementResult: string}> {
        if (!this.client) {
            return Promise.reject('MyBankStatement :: Client is not ready');
        }
        return this.client.confirmStatement(confirm);
    }

    /**
     * View statement by filter
     *
     * @param filter
     */
    public viewRequest(view: MyBankStatementViewRequests): Promise<MyBankStatementViewRequestsResponse> {
        if (!this.client) {
            return Promise.reject('MyBankStatement :: Client is not ready');
        }
        return this.client.ViewRequests(view);
    }

    /**
     * Get statement by ticket id
     * 
     * TODO where can I find ticket id? from request?
     *
     * @param tickedID 
     */
    public getJSONStatement(getjson: MyBankStatementGetStatementJSONObject): Promise<MyBankStatementGetStatementJSONObjectResponse> {
        if (!this.client) {
            return Promise.reject('MyBankStatement :: Client is not ready');
        }
        return this.client.GetStatementJSONObject(getjson);
    }

     /**
     * Get statement by ticket id
     * 
     * TODO where can I find ticket id? from request?
     *
     * @param tickedID 
     */
    public getPDFStatement(getpdf: MyBankStatementGetPDFStatement): Promise<MyBankStatementGetPDFStatementResponse> {
        if (!this.client) {
            return Promise.reject('MyBankStatement :: Client is not ready');
        }
        return this.client.GetPDFStatement(getpdf);
    }

    /**
     * Wrap soap client object, this wraper will add credentials to each call
     *
     * @param client soap client object (original)
     */
    protected wrapClient(client: soap.Client, config: MyBankStatementConfig): {[method: string]: (args?: {}) => Promise<any>} {
        return new Proxy(client, {
            get: (target, propKey, receiver) => {
                return (args: any) => {
                    let clientIdKey = 'clientID';
                    let clientPasscodeKey = 'clientPasscode';

                    if (
                        propKey === 'RequestStatement'
                    ) {
                        clientIdKey = 'ClientID';
                        clientPasscodeKey = 'ClientPasscode';
                    }

                    if (
                        propKey === 'confirmStatement'
                    ) {
                        clientIdKey = 'clientID';
                        clientPasscodeKey = 'ClientPasscode';
                    }

                    const nargs = {
                        [clientIdKey]: config.clientId,
                        [clientPasscodeKey]: config.clientPasscode,
                        ...args
                    };
                    // console.log(nargs);
                    return new Promise((resolve, reject) => {
                        (client as any)[propKey](nargs, (err, result) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(result);
                        })
                    });
                }
            }
        }) as any;
    }
}
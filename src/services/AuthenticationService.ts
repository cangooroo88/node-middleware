/**
 *
 * AuthenticationService
 *
 * You must create instance of this class with credentials.
 */
import { baseRequest } from '../helpers/http';

export interface AuthenticationServiceConfig {
    apiKey: string;
    apiKeyName: string;
    url: string;
    path: string;
}

/**
 * Service for user authentication
 */
export class AuthenticationService {

    constructor(protected config: AuthenticationServiceConfig) {}

    public createUserRecord(bvn: string, email_address: string, mobile_number: string, password: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/create', 200, {
            BVN: bvn,
            email_address: email_address,
            mobile_number: mobile_number,
            pass_code: password
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public authenticateUser(username: string, password: string, usernameType: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/authenticate', 200, {
            username: username,
            pass_code: password,
            validation_field: usernameType,
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public changeUserPassword(username: string, password: string, new_password: string, usernameType: string, token: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/change_password', 200, {
            username: username,
            current_pass_code: password,
            new_pass_code: new_password,
            validation_field: usernameType,
            token: token
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public getUserByBVN(bvn: string): any {

        return baseRequest('AuthenticationService', null, 'GET', this.config.url + this.config.path + '/client/details/' + bvn, [200, 400], null, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public setSecurityPin(bvn: string, security_pin: string, token: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/set_security_pin', 200, {
            BVN: bvn,
            security_pin: security_pin,
            token: token
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public changeSecurityPin(bvn: string, security_pin: string, new_security_pin: string, token: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/change_security_pin', 200, {
            BVN: bvn,
            current_security_pin: security_pin,
            new_security_pin: new_security_pin,
            token: token
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public resetSecurityPin(token: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/reset_security_pin', 200, {
            token: token
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public validateSecurityPin(bvn: string, security_pin: string, token: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/validate_security_pin', 200, {
            BVN: bvn,
            security_pin: security_pin,
            token: token
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public initiateResetPassword(bvn: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/reset_password', 200, {
            BVN: bvn,
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public confirmResetPassword(code: string, phone: string): any {

        return baseRequest('AuthenticationService', null, 'POST', this.config.url + this.config.path + '/client/confirm_reset_password', 200, {
            reset_code: code,
            mobile_number: phone,
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }

    public validateSession(token: string): any {

        return baseRequest('AuthenticationService', null, 'GET', this.config.url + this.config.path + '/client/client_info/' + token, 200, {
            token: token
        }, {
            [this.config.apiKeyName]: this.config.apiKey
        })
            .then((result) => result.body);
    }
}
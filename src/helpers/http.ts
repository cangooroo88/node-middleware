import * as request from 'request';
import { Logger } from '../app/Logger';

export interface BasicAuthCredentials {
    username: string;
    password: string;
}

export interface BearerAuthCredentials {
    secret: string;
}

export class HttpServiceError extends Error {
    constructor(public readonly message: string, public readonly httpCode: number, public readonly method: string, public readonly url: string, public readonly requestBody: any, public readonly responseBody: any) {
        super(message);
    }
}

/**
* Base request to rest api.
* Wraped http request to promise with basic auth and headers.
*
* @param credentials 
* @param method 
* @param url 
* @param expectedStatusCode 
* @param body 
*/
export function baseRequest(logName: string, credentials: (BasicAuthCredentials | BearerAuthCredentials), method: ('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'), url: string, expectedStatusCode: ( number | number[] ), body: any = undefined, customHeaders: any = undefined): Promise<{response: any, body: any}> {
   return new Promise((resolve: (value: any) => void, reject: (reason: any) => void) => {

        const headers = {};
        if (method !== 'GET') {
            headers['Content-type'] = 'application/json';
        }

        if (credentials && credentials['username'] && credentials['password']) {
            headers['Authorization'] = 'Basic ' + Buffer.from(credentials['username'] + ':' + credentials['password']).toString('base64');
        } else if (credentials && credentials['secret']) {
            headers['Authorization'] = 'Bearer ' + credentials['secret'];
        }

        request({
            method,
            url,
            followRedirect: true,
            body: body,
            json: true,
            headers: {
                ...headers,
                ...customHeaders
            }
        }, (error, response, responseBody) => {
            if (error) {
                reject(error);
                return;
            }

            let unexpectedStatusCode = false;
            if (Array.isArray(expectedStatusCode)) {
                unexpectedStatusCode = expectedStatusCode.lastIndexOf(response.statusCode) === -1;
            } else {
                unexpectedStatusCode = response.statusCode !== expectedStatusCode
            }
            if (unexpectedStatusCode) {
                    // Logger.error(`${method} to ${url} failed with code: ${response.statusCode}\nrequest:\n${JSON.stringify(body)}\nresponse:${JSON.stringify(responseBody)}`);
                    reject(new HttpServiceError(logName + " API request fails (status code " + response.statusCode.toString() + " was not expected).", response.statusCode, method, url, body, responseBody));
                    return;
            }

            resolve({response: response, body: responseBody});
        });
   });
}
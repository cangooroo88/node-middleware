import * as restifyErrors from 'restify-errors';

export interface CustomErrorConstructor {
    new ();
    // tslint:disable-next-line unified-signatures
    new (printf: string, ...args: any[]);
    // tslint:disable-next-line unified-signatures
    new (options: restifyErrors.RestifyHttpErrorOptions, printf?: string, ...args: any[]);
    // tslint:disable-next-line unified-signatures
    new (priorErr: any, printf?: string, ...args: any[]);
    new (priorErr: any, options: restifyErrors.RestifyHttpErrorOptions, printf?: string, ...args: any[]);
}

let makeError = (statusCode: number, errorName: string): CustomErrorConstructor => {
    restifyErrors.makeConstructor(errorName + 'Error', { statusCode });
    return restifyErrors[errorName + 'Error'];
}

export const ValidatorError = makeError(400, 'ValidatorError');
export const MiddlewareError = makeError(400, 'MiddlewareError');
export const AuthenticationError = makeError(401, 'AuthenticationError');
export const InternalServerError = makeError(500, 'InternalServerError');
export const ResourceNotFoundError = makeError(404, 'ResourceNotFoundError');
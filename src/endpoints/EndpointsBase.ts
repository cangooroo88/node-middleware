import { Next, Request } from "restify";
import { Logger } from "../app/Logger";
import { NullCheck } from "../helpers/safe";
import { HttpServiceError } from "../helpers/http";
import { InternalServerError, ResourceNotFoundError, MiddlewareError } from "../helpers/errors";
import { HttpError } from "restify-errors";
import { stringifyObject } from "../helpers/stringifiers";

const Raven = require('raven');

export class EndpointsBase {

    constructor (args: IArguments, protected ignoredMiddlewareErrors: string[]) {
        for (let i = 0; i < args.length; i++) {
            NullCheck(args[i]);
        }
    }

    protected baseCatch = (req: Request, next: Next, duplicateErrorMessage: string = 'Duplicate content error'): (arr: any) => void => {
        return (err) => {
            this.logRequestError(err, req);

            if (err instanceof HttpError) {
                next(err);
                return;
            }

            if (err instanceof HttpServiceError) {
                if (err.httpCode === 404 && err.responseBody && err.responseBody.returnStatus && err.responseBody.returnStatus === 'INVALID_CLIENT_ID') {
                    next(new ResourceNotFoundError('client_not_found'));
                    return;
                }
            }

            /*
            if (err.sql) {
                if (err.code && err.code === 'ER_DUP_ENTRY') {
                    next(new InvalidContentError(duplicateErrorMessage));
                    return;
                } else {
                    next(new InternalServerError('Unknow database error'));
                    return;
                }
            } 
            */
            if (process.env.ENVIRONMENT !== 'prod') {
                next(new InternalServerError(err.body ? err.body.message : err.stack))
            } else {
                next(new InternalServerError('unknown_error'));
            }
            return;
        };
    }

    protected getHostIpAddress(req: Request): string {
        let ip = null;
        if (req.connection && req.connection.remoteAddress) {
            ip = req.connection.remoteAddress;
        } else if (req.headers && req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'];
        }
        return ip;
    }

    protected logRequestError(err: any, req: Request): any {

        // if ignored, return only
        if (err instanceof MiddlewareError) {
            if (this.ignoredMiddlewareErrors.indexOf(err.message) > -1) {
                return err;
            }
        }

        let className = this.constructor.name;
        let route = req.getRoute();
        let nextData = {};
        if (req['token']) {
            nextData['token'] = req['token'];
        }
        if (req['userId']) {
            nextData['userId'] = req['userId'];
        }
        if (req['adminUserId']) {
            nextData['adminUserId'] = req['adminUserId'];
        }
        if (req.headers && req.headers['x-forwarded-for']) {
            nextData['xForwardedFor'] = req.headers['x-forwarded-for'];
        } else if (req.connection && req.connection.remoteAddress) {
            nextData['remoteAddress'] = req.connection.remoteAddress;
        }
        if (req['url']) {
            nextData['url'] = req['url'];
        }
        if (req['body']) {
            req['body'].password ? req['body'].password = "masked_password" : null;
            nextData['body'] = stringifyObject(req['body'], {maxStringLength: 64, maxDepth: 6});
        }

        Logger.error(className + ' : ' + route.method + ':' + route.path + ' :: ' + Object.keys(nextData).map((k) => (k + '=' + nextData[k])).join(' '),  ':: ERROR =', err);
        
        // TODO: only temporary BEGIN
        if (err && err.requestBody) {
            err.requestBody.password ? err.requestBody.password = "masked_password" : null;
            Logger.warn('requestBody = ' + stringifyObject(err.requestBody, {maxStringLength: 64, maxDepth: 6}));
        }
        if (err && err.responseBody) {
            Logger.warn('responseBody = ' + stringifyObject(err.responseBody, {maxStringLength: 64, maxDepth: 6}));
        }
        // TODO: only temporary END

        Raven.captureException(err, {
            req: req,
            extra: nextData
        });

        return err;
    }

}
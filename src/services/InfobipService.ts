/**
 * 
 * Infobip api dao
 * 
 * You must create instance of this class with credentials.
 */
import * as request from 'request';
import { BasicAuthCredentials, baseRequest } from '../helpers/http';

export interface InfobipConfig extends BasicAuthCredentials {
    url: string;
}

export interface InfobipResponse {
    messages: {
        to: string;
        status: {
            groupId: number;
            groupName: string;
            id: number;
            name: string;
            description: string;
        },
        smsCount: number;
        messageId: string;
    }[]
}

/**
 * Service for sending sms by infobip by rest api
 */
export class InfobipService {

    protected validGroupIds = [1 /* PENDING */, 3 /* DELIVERED */]; // Invalid is: 2=UNDELIVERABLE 3=EXPIRED 5=REJECTED
    
    /**
     * Creates InfobipService with config
     * 
     * @param config server config
     * @param url server url
     */
    constructor(protected config: InfobipConfig) {}

    /**
     * POST SMS - send message to number
     * 
     * @param number phone number
     * @param text text of message
     */
    public postSMS(number: string, text: string): Promise<InfobipResponse> {
        return baseRequest('Infobip', this.config, 'POST', this.config.url + '/text/single', 200, {
            to: number,
            text: text
        })
            .then((result) => {
                let statusGroupId = result.body.messages[0].status.groupId;
                let statusName = result.body.messages[0].status.name;

                if (this.validGroupIds.indexOf(statusGroupId) > -1) {
                    return result.body;
                }

                throw new Error(`InfobipService :: SMS cannot send with status ${statusName}`);
            });
    }
}
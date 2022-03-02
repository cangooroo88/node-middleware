/**
 * Set of regexps used in whole application.
 * Its used for validating data.
 */
export const SessionTokenRegexp = /^[a-zA-Z0-9]{64}$/;

export const RegExps = {
    anyToken: {
        regexp: /^[a-zA-Z0-9]{12}$/,
        message: 'Invalid token format'
    },
    datetime: {
        regexp: /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/,
        message: 'Invalid ISO date and time format (YYYY-MM-DDTHH:mm:ss.SSSZ)'
    },
    date: {
        regexp: /^\d{4}-[01]\d-[0-3]\d$/,
        message: 'Invalid ISO date format (YYYY-MM-DD)'
    },
    phoneNumber: {
        regexp: /^(0[789][0-9]{8,9})$/,
        message: 'Invalid phone number format, use format 0[789]xxxxxxxxx'
    },
    email: {
        regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Invalid email format'
    },
    bvn: {
        regexp: /^[0-9]{11}$/,
        message: 'Invalid BVN format'
    },
    clientKey: {
        regexp: /^[a-f0-9]{32}$/,
        message: 'Invalid clientKey format'
    },
    employerKey: {
        regexp: /^[a-f0-9]{32}$/,
        message: 'Invalid employerKey format'
    },
    smsCode: {
        regexp: /^[0-9]{4}$/,
        message: 'Invalid SMS code format'
    },
    resetCode: {
        regexp: /^[0-9]{6}$/,
        message: 'Invalid reset code format'
    },
    fpKey: {
        regexp: /^[a-zA-Z0-9]{32}$/,
        message: 'Invalid fpKey format'
    },
    password: {
        regexp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/,
        message: 'Invalid password format'
    }
};
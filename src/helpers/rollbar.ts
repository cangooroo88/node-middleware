import { InternalServerError } from "./errors";

const Rollbar = require('rollbar');

const rollbar = (req, res, err, callback) => {

    const rollbar = new Rollbar({
        accessToken: 'f1eadb9e4d1c4707a4f79b11a8dec6c3',
        captureUncaught: true,
        captureUnhandledRejections: true,
        environment: process.env.ENVIRONMENT
    });

    if (err instanceof InternalServerError) {
        rollbar.error(err);
    }

    return callback();
};

export { rollbar }
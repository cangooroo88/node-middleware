// uncomment it if you need TS annotations
// import "reflect-metadata";

import * as cluster from 'cluster';
import {Logger} from './app/Logger';
import {rollbar} from './helpers/rollbar';

const program = require('commander');

const version = require('./../package.json').version;

program
    .version(version)
    .option('-e, --environment [environment]', 'Setup environment [dev/test/stage/prod]')
    .option('-c, --concurrency [concurrency]', 'Setup number of concurrency workers')
    .parse(process.argv);

const environment = program.environment ? program.environment : (process.env.ENVIRONMENT ? process.env.ENVIRONMENT : null);

if (!environment) {
    Logger.error('Environment not set! Set it by -e parameter or as ENVIRONMENT variable.');
    process.exit(666);
}

// newrelic
if (environment !== 'dev') {
    Logger.log('Init newrelic');
    require('newrelic');
}

let numWorkers = process.env.WEB_CONCURRENCY || require('os').cpus().length;
if (program.concurrency) {
    numWorkers = parseInt(program.concurrency, 10);
}

if (cluster.isMaster) {

    Logger.forkName = 'master';
    /**
     * Matser app part
     */
    Logger.log(`Master ${process.pid} is running`);
    Logger.log(`Environment=${environment}`);

    let allWorkers = [];

    let broadcastMessage = (msg) => {
        if (msg.hasOwnProperty('broadcast')) {
            allWorkers.forEach((worker) => {
                if (!worker.isDead()) {
                    worker.send(msg.broadcast);
                }
            });
        }
    };

    // Fork workers.
    for (let i = 0; i < numWorkers; i++) {
        let worker = cluster.fork();
        worker.send({
            runWorker: 'server'
        });
        worker.on('message', broadcastMessage);
        allWorkers.push(worker);
    }

    cluster.on('exit', (worker, code, signal) => {
        Logger.log(`Worker ${worker.process.pid} died!`);
        // remove it from array
        var index = allWorkers.indexOf(worker);
        if (index > -1) {
            allWorkers.splice(index, 1);
        }

        // if (true) {
            // start new fork
            let newWorker = cluster.fork();
            newWorker.send({
                runWorker: 'server'
            });
            newWorker.on('message', broadcastMessage);
            allWorkers.push(newWorker);
        // }
    });

} else {

    let running = false;
    process.on('message', (msg) => {
        if (!msg.runWorker) {
            return;
        }
        if (running) {
            Logger.error(`Fork ${process.pid} already have job!`);
            return;
        }
        running = true;
        Logger.forkName = msg.runWorker;

        if (msg.runWorker === 'server') {
            // SERVER BEGIN
            Logger.log(`Fork ${process.pid} run as server fork.`);

            const App = require('./app/App').App;
            const InvalidContentError = require('restify-errors').InvalidContentError;
            const restify = require('restify');
            const corsMiddleware = require('restify-cors-middleware');
        
            const cors = corsMiddleware({
                preflightMaxAge: 60,
                origins: ['*'],
                allowHeaders: [],
                exposeHeaders: []
            });
        
            // Create Restify router
            let server  = restify.createServer({
                name: 'Hyperian Middleware Server v' + version
            });

            if (environment !== 'dev') {
                server.on('restifyError', rollbar);
            }
        
            server.pre(cors.preflight);
            server.use(cors.actual);
            server.use(restify.plugins.queryParser({ mapParams: false }));
            server.use(restify.plugins.jsonBodyParser({ mapParams: false }));
            // supports only jsons
            server.use(function(req, res, next) {
                if (req.contentType() !== 'application/json') {
                    if (req.method === 'GET') {
                        if (req.contentType() !== 'application/octet-stream') {
                            return next(new InvalidContentError(`Content-Type ${req.contentType()} is not supported`));
                        }
                    } else {
                        return next(new InvalidContentError(`Content-Type ${req.contentType()} is not supported`));
                    }
                }
                return next();
            });
        
            // start App
            let app = new App(server, environment);
        
            app.initServerFork()
                .then((serverConfing) => {
                    server.listen(serverConfing.port, serverConfing.host, function() {
                        Logger.log(`${server.name} listening at ${server.url}`);
                    });
                })
                .catch((error) => {

                    Logger.error(error);

                    setTimeout(() => {
                        process.exit();
                    }, 5000);

                });
        
            // SERVER END
        }

    });
    
}
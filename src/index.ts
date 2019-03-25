import { config } from './config';
const apm = require('elastic-apm-node');

if (config.apm.isActive) {
    apm.start({
        serviceName: config.server.name,
        serverUrl: config.apm.server,
        captureBody: 'all',
    });
}

import { Server } from './server';
import { log } from './utils/logger';

process.on('uncaughtException', (err) => {
    log('error', 'Unhandled Exception', err.message, undefined, undefined, { error: err });
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    log('error', 'Unhandled Rejection', err.message, undefined, undefined, { error: err });
    process.exit(1);
});

process.on('SIGINT', async () => {
    log('info', 'User Termination', 'application was terminated by the user (SIGINT event)');
    process.exit(0);
});

(async () => {
    log('verbose', 'Server', 'Starting server');
    const server: Server = Server.bootstrap();

    server.app.on('close', () => {
        log('verbose', 'Server', 'Server closed');
    });
})();

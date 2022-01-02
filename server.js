'use strict';

const http = require('http');
const app = require('./core/app');
const debug = require('debug')('server');

/** Normalize Port */
const normalizePort = value => {
    const port = parseInt(value, 10);
    if (isNaN(port)) return value;
    if (port >= 0) return port;
    return false;
}

/** Handler for Error Event */
const onError = error => {
    if(error.syscall !== 'listen') throw error;

    const addr = server.address();
    const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port : ${addr.port}`;

    switch(error.code){
        case 'EACCESS':
            debug(`[!] - ${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            debug(`[!] - ${bind} is already in use`);
            process.exit(1);
            break;
        default :
            throw error;
    }
}

/** Handler for Listening Event */
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr.port}`;
    debug(`Listening Server on ${bind}`);
}

/** Get Port from Environment or Set by default */
const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/** Creating Server */
const server = http.createServer(app);

/** Listening */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
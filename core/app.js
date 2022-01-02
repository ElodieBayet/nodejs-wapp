'use strict';

const createError = require('http-errors');
const { join } = require('path');
const compression = require('compression');
const helmet = require('helmet');
const debug = require('debug')('app');
const mongoose = require('mongoose');
const express = require('express');
const routes = require('./routes/routesCollection');

/** Database connection */
const DEVDB_URI = "mongodb://localhost:27017/MusicalEras";
mongoose
    .connect( process.env.MONGODB_URI || DEVDB_URI )
    .catch( err => debug(`[!] - DataBase Connection Failed : ${err}`));

/** App & Middlewares */
const app = express();
app
    .set('views', join(__dirname, 'views'))
    .set('view engine', 'pug');
app
    .use( compression() )
    .use( express.static( join(__dirname, '..', 'public')) )
    .use( express.static( join(__dirname, '..', 'assets')) )
    .use( helmet( { contentSecurityPolicy : { useDefaults: true, directives: { imgSrc: ['*'] } } }));

/** Routage */
app
    .use('/async', routes.async)
    .use('/period', routes.period)
    .use('/compositor', routes.compositor)
    .use('/', routes.main);

/** Errors : no route */
app
    .use( (req, res, next) => {
        next(createError(404));
    })
    .use( (err, req, res, next) => {

        debug(`Route not found or internal error`);
        
        // Errors in Development only
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // Errors may come form internal
        res.status(err.status || 500);
        
        // Render Error page
        res.render('contents/error', {title: `Contenu non trouvé`});
    });

module.exports = app;
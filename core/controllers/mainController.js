const debug = require('debug')('main');
const Period = require('../models/periodEntity');

/**
 * Treatements for '/', Home page : Get all periods in ascending.
 * (!) - Take a look at 'retrieveAllPeriods' function in './periodController', it's exactly the same... mind about it.
 * @param {*} req 
 * @param {*} res - Pug Render
 * @param {*} next 
 */
exports.home = (req, res, next) => {
    // Enable highlighting of item in navigation
    res.locals.route = 'home';

    Period
        .find( {}, { tag: true, name: true, begin: true, end: true } )
        .sort([['begin', 'ascending']])
        .then( periodSet => {
            res.render('contents/home', { title: `Périodes en musique savante`, description: `Diagramme chronologique des périodes en musique occidentale savante`, periods: periodSet })
        })
        .catch( err => {
            debug(`[!] - Retrieve Periods :: ${err.message}`);
            err.status = 404;
            return next(err);
        });
}

/**
 * Treatments for '/info', Informations page.
 * Display static content.
 * @param {*} req 
 * @param {*} res - Pug Render
 * @param {*} next 
 */
exports.info = (req, res, next) => {
    // Enable highlighting of item in navigation
    res.locals.route = 'info';

    res.render('contents/info', { title: `Information`, description: `Renseignements sur l'application, son fonctionnement et son contenu` })
}
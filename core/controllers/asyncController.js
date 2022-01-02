const debug = require('debug')('async');
const Period = require('../models/periodEntity');
const Compositor = require('../models/compositorEntity');

/**
 * Treatments for '/async/chronographic' : Retrieve all compositors by period's tag in asynchronous way
 * (!) - According to the nature of response (by render engine) in this Application we are ordained to send a portion of HTML. What if we toggle original concept into .json responses...
 * @param {*} req - Provide tag parameter for DB query
 * @param {*} res - Raw TEXT/HTML content
 * @param {*} next 
 */
exports.chronographic = (req, res, next) => {
    let HTMLResponse = ``;
    Period
        .findOne( {tag: req.params.tag} )
        .then( period => {
            if( !period ) throw new Error('La période est mal renseignée');
            
            return Compositor
                .find( {period: period._id}, {lastname: true, firstname: true} )
                .then( listCompositors => {
                    if (listCompositors.length === 0) throw new Error('Aucune référence trouvée');
                    
                    HTMLResponse = `<ul class="list">`;
                    for(let compositor of listCompositors) HTMLResponse += `<li>${compositor.firstname} ${compositor.lastname}</li>`;
                    HTMLResponse += `</ul>`;
                } )
        } )
        .catch( err => {
            debug(`[!] - Chronographic :: ${err.message}`)
            HTMLResponse = `<ul><li class="nothing">${err.message}</li></ul>`;
        })
        .finally( () => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.write(HTMLResponse);
            res.end();
        } );
}
const debug = require('debug')('compositor');
const async = require('async');
const Period = require('../models/periodEntity');
const Compositor = require('../models/compositorEntity');

/**
 * Treatments for '/compositor/:tag' : Retrieve one compositor by tag value.
 * @param {*} req - Provide tag parameter for DB query
 * @param {*} res - Pug Render
 * @param {*} next 
 */
exports.retrieveOneCompositor = (req, res, next) => {
    // Enable highlighting of item in .navigation
    res.locals.route = 'compositor';

    Compositor
        .findOne({tag: req.params.tag})
        .populate('period', ['name', 'tag'])
        .then( compositor => {
            if( !compositor ) throw new Error(`Compositeur.rice non trouvé.e`);
            async.parallel(
                {
                    previousCompositor: (callback) => {
                        Compositor
                            .find( {birth: {$lt: compositor.birth}}, {tag:true, birth:true, lastname:true, firstname:true} )
                            .sort([['birth', 'descending']])
                            .limit(1)
                            .exec(callback);
                    },
                    nextCompositor: (callback) => {
                        Compositor
                            .find( {birth: {$gt: compositor.birth}}, {tag:true, birth:true, lastname:true, firstname:true} )
                            .sort([['birth', 'ascending']])
                            .limit(1)
                            .exec(callback);
                    }
                },
                (err, results) => {
                    if(err) return next(err);
                    res.render('contents/compositor', {
                        title: compositor.name,
                        description: `Présentation de ${compositor.name}`,
                        compositor: compositor,
                        previous: results.previousCompositor[0],
                        next: results.nextCompositor[0]
                    });
                }
            )
        })
        .catch( err => {
            debug(`[!] - Retrieve Compositor :: ${err.message}`);
            err.status = 404;
            return next(err);
        });
}

/**
 * Treatments for '/compositor', Compositors page : Retrieve all compositors in birth date ascending.
 * @param {*} req 
 * @param {*} res - Pug Render
 * @param {*} next 
 */
exports.retrieveAllCompositors = (req, res, next) => {
    // Enable highlighting of item in navigation
    res.locals.route = 'compositor';

    Compositor
        .find({}, { tag: true, firstname: true, lastname: true, birth: true, death: true})
        .populate('period', ['name', 'tag'])
        .sort([['birth', 'ascending']])
        .then( allCompositors => {
            if( !allCompositors ) throw new Error(`Compositeur.rice non trouvé.e`);
            Period
                .find({}, {tag: true, name: true})
                .sort([['begin', 'ascending']])
                .then( allPeriods => {
                    res.render('contents/register', { 
                        title: 'Compositeurs',
                        description: 'Liste de quelques compositeur.rice.s en musique occidentale savante',
                        records: allCompositors,
                        filters: allPeriods
                    });
                } )
        } )
        .catch( err => {
            debug(`[!] - Retrieve Compositors :: ${err.message}`);
            err.status = 404;
            return next(err);
        });
}
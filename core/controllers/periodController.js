const debug = require('debug')('period');
const async = require('async');
const Period = require('../models/periodEntity');
const Compositor = require('../models/compositorEntity');

/**
 * Treatments for '/period/:tag', Periods pages : Retrieve one period by tag value.
 * @param {*} req - Provide tag parameter for DB query
 * @param {*} res - Pug Render
 * @param {*} next 
 */
exports.retrievOnePeriod = (req, res, next) => {
    // Enable highlighting of item in navigation
    res.locals.route = 'period';

    Period
        .findOne( {tag: req.params.tag} )
        .then( period => {
            if( !period ) throw new Error(`Période non trouvée`);

            async.parallel(
                {
                    previousPeriod: (callback) => {
                        Period
                            .find( {begin: {$lt: period.begin}}, {tag:true, begin:true, name:true} )
                            .sort([['begin', 'descending']])
                            .limit(1)
                            .exec(callback);
                    },
                    nextPeriod: (callback) => {
                        Period
                            .find( {begin: {$gt: period.begin}}, {tag:true, begin:true, name:true} )
                            .sort([['begin', 'ascending']])
                            .limit(1)
                            .exec(callback);
                    },
                    allCompositors: (callback) => {
                        Compositor
                            .find( {period:period._id} )
                            .exec(callback)
                    }
                },
                (err, results) => {
                    if(err) return next(err);
                    res.render('contents/period', { 
                        title: period.name,
                        description: `Description sur la période musicale ${period.name}`,
                        period: period,
                        previous: results.previousPeriod[0], 
                        next: results.nextPeriod[0],
                        compositors: results.allCompositors
                    })
                }
            )
        } )
        .catch( err => {
            debug(`[!] - Retrieve Period :: ${err}`);
            err.status = 404;
            return next(err);
        });
}

/**
 * Treatments for '/period', Periods page : Retrieve all periods in begin date ascending.
 * @param {*} req 
 * @param {*} res - Pug Render
 * @param {*} next 
 */
exports.retrieveAllPeriods = (req, res, next) => {
    // Enable highlighting of item in navigation
    res.locals.route = 'period';

    Period
        .find({}, {tag: true, name: true, begin: true, end: true})
        .sort([['begin', 'ascending']])
        .then( allPeriods => {
            res.render('contents/register', { 
                title: `Périodes`,
                description: `Liste des périodes prinicpales en musique occidentale savante`,
                records: allPeriods
            })
        } )
        .catch( err => {
            debug(`[!] - Retrieve Periods :: ${err.message}`);
            err.status = 404;
            return next(err);
        });
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Model for Period documents.
 * @type {Schema}
 */
const PeriodSchema = new Schema(
    {
        tag: {type: String, required: true, unique: true, lowercase: true},
        name: {type: String, required: true, minLength: 3, maxLength: 128},
        begin: {type: Number, required: true, min: 1, max: 2100},
        end: {type: Number, required: true, min: 1, max: 2100},
        description: {type: String, maxLength: 500}
    }
);

/** Virtual data for period's delay */
PeriodSchema
    .virtual('delay')
    .get(function () {
        return this.end - this.begin;
    });

/** Virtual for period's duration */
PeriodSchema
    .virtual('duration')
    .get(function () {
        return `± ${this.end - this.begin} ans`;
    });

/** Virtual for period's readable timelaps */
PeriodSchema
    .virtual('timelaps')
    .get(function(){
        return `de ${this.begin} à ${this.end}`;
    });

module.exports = mongoose.model('Period', PeriodSchema);
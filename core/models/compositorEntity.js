const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Model for Compositor documents.
 * @type {Schema}
 */
const CompositorSchema = new Schema(
    {
        tag: {type: String, required: true, unique: true, lowercase: true},
        lastname: {type: String, required: true, minLength: 3, maxLength: 128, uppercase: true},
        firstname: {type: String, required: true, minLength: 3, maxLength: 128},
        birth: {type: Date, required: true},
        death: {type: Date},
        origin: {type: String, maxLength: 128},
        figure: {type: String, default: '/fig/default_portrait.jpg'},
        period: [{type: Schema.Types.ObjectId, ref: 'Period'}] 
    }
);

/** Virtual for Compositor's fullname */
CompositorSchema
    .virtual('name')
    .get(function () {
        return `${this.firstname} ${this.lastname}`;
    });

/** Virtual for Compositor's lifespan */
CompositorSchema
    .virtual('life')
    .get(function () {
        return `± ${this.death.getFullYear() - this.birth.getFullYear()} ans`;
    });

/** Virtual for Compositor's timelaps */
CompositorSchema
    .virtual('timelaps')
    .get(function () {
        return `de ${this.birth.getFullYear()} à ${this.death.getFullYear()}`;
    });

module.exports = mongoose.model('Compositor', CompositorSchema);
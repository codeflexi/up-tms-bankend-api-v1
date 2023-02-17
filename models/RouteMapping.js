const { Router } = require('express');
const mongoose = require('mongoose');

const RouteMappingSchema = mongoose.Schema({
  
    postcode: {
        type: String,
        required: true,
    },
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      }
})

RouteMappingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

RouteMappingSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('RouteMapping', RouteMappingSchema);

const mongoose = require('mongoose');

const RouteSchema = mongoose.Schema({
  
    code: {
        type: String,
        required: [true, 'Please add a code'],
        unique: [true, 'code has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Code can not be more than 100 characters']
      },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    isactivated: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

RouteSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

RouteSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Route', RouteSchema);

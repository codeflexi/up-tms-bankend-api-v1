const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema({
    plate_number: {
        type: String,
        required: [true, 'Please add a plate_number'],
        unique: [true, 'code has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [20, 'plate_number can not be more than 20 characters']
      },
      plate_province: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    cost : {
        type: Number,
        default:0
    },
    isactivated: {
        type: Boolean,
        default: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
})

VehicleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

VehicleSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Vehicle', VehicleSchema);

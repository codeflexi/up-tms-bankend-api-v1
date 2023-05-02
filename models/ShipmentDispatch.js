const mongoose = require('mongoose');

const ShipmentDispatchSchema = mongoose.Schema({
    shipment_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    }
],
    dispatch_number: {
        type: String,
        required: [true, 'Please add a pick number'],
        unique: [true, 'Pick number has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Pick number can not be more than 100 characters']
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    memo: {
        type: String
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
    },
    status: {
        type: String,
        required: true,
        enum: [
            'CREATED',
            'COMPLETED',
            'CANCELLED'
        ],
        default: 'CREATED',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    planned_date: {
        type: Date
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    updated_date: {
        type: Date,
        default: Date.now,
    },
    loaded_date: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

ShipmentDispatchSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ShipmentDispatchSchema.set('toJSON', {
    virtuals: true,
});



// //Call get AverageCost after save
// ShipmentSchema.post('save', function () {
//     // run static model use this
// this.constructor.getTrackingNumber(this.shipmentId);
// });

module.exports = mongoose.model('ShipmentDispatch', ShipmentDispatchSchema);



/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */
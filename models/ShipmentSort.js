const mongoose = require('mongoose');

const ShipmentSortSchema = mongoose.Schema({
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      },
    shipment_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    }
],
    sort_number: {
        type: String,
        required: [true, 'Please add a sort number'],
        unique: [true, 'Sort number has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Sort number can not be more than 100 characters']
    },
    status: {
        type: String,
        required: true,
        enum: [
            'CREATED',
            'DELIVERING',
            'OUT FOR DELIVERY',
            'CANCELLED'
        ],
        default: 'CREATED',
    },
    memo: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sorted_date: {
        type: Date,
        default: Date.now,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    updated_date: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

ShipmentSortSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ShipmentSortSchema.set('toJSON', {
    virtuals: true,
});


//Static method to get avg of course tuitions
ShipmentSortSchema.statics.getTrackingNumber = async function (shipmentId) {
    console.log('Calculating tracking number...'.blue);

    try {
        // access Bootcamp model
        await this.model('Shipment').findByIdAndUpdate(shipmentId, {
            tracking_number: string.concat('TH', '$shipment_number')
        })

    } catch (err) {
        console.error(err);
    }
}

// //Call get AverageCost after save
// ShipmentSchema.post('save', function () {
//     // run static model use this
// this.constructor.getTrackingNumber(this.shipmentId);
// });

module.exports = mongoose.model('ShipmentSort', ShipmentSortSchema);



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
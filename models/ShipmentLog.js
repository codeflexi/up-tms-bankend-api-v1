const mongoose = require('mongoose');

const ShipmentLogSchema = mongoose.Schema({
    shipment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment',
    },
    log_number: {
        type: String,
        required: [true, 'Please add a Log number'],
        unique: [true, 'Log number has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Log number can not be more than 100 characters']
    },
    waybill_number: {
        type: String
    },
    shipment_number: {
        type: String
    },
     ref_number: {
        type: String
    },
    event: {
        type: String,
        required: true,
        enum: [
            'DATA SUBMITTED',
            'PICKING UP',
            'PICKED UP',
            'ARRIVED HUB',
            'SORTED',
            'TRANSIT',
            'ARRIVED DC',
            'OUT FOR DELIVERY',
            'DELIVERED'
        ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    logged_date: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

ShipmentLogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ShipmentLogSchema.set('toJSON', {
    virtuals: true,
});

//Static method to get avg of course tuitions
ShipmentLogSchema.statics.getTrackingNumber = async function (shipmentId) {
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
// ShipmentLogSchema.post('save', function () {
//     // run static model use this
// this.constructor.getTrackingNumber(this.shipmentId);
// });

module.exports = mongoose.model('ShipmentLog', ShipmentLogSchema);



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
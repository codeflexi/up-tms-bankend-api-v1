const mongoose = require('mongoose');

const ShipmentRouteSchema = mongoose.Schema({
    shipment_items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    }
],
    route_number: {
        type: String,
        required: [true, 'Please add a route number'],
        unique: [true, 'Route number has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Route number can not be more than 100 characters']
    },
    from_source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    to_destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    memo: {
        type: String
    },

    total_shipment: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
    },
    shiped_date: {
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

ShipmentRouteSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ShipmentRouteSchema.set('toJSON', {
    virtuals: true,
});


//Static method to get avg of course tuitions
ShipmentRouteSchema.statics.getTrackingNumber = async function (shipmentId) {
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

module.exports = mongoose.model('ShipmentRoute', ShipmentRouteSchema);



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
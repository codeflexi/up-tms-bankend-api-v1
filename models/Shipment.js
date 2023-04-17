const mongoose = require('mongoose');

const ShipmentSchema = mongoose.Schema({
    shipment_items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipmentItem',
        required: false
    }],
    content_items: [{
        type: String,
        required: false
    
    }],
    shipment_number: {
        type: String,
        required: [true, 'Please add a shipment number'],
        unique: [true, 'Shipment number has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Shipment number can not be more than 100 characters']
    },
    waybill_number: {
        type: String
    },

    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    phone_alt: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    shipping_full_name: {
        type: String,
        required: [true, 'Please add shipping full name']
    },
    shipping_address_line1: {
        type: String,
        required: [true, 'Please add an address']
    },
    shipping_address_line2: {
        type: String,
        required: false
    },
    city: String,
    state: String,
    zipcode: String,

    country: {
        type: String,
        default: "Thailand"
    },

    status: {
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
        ],
        default: 'DATA SUBMITTED',
    },
    is_by_pass: {
        // Array of strings
        type: String,
        required: true,
        enum: [
            'Y',
            'N'
        ],
        default: 'N'
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    shipment_pick: {
        type: String
    },
    total_price: {
        type: Number,
    },
    sales_channel: {
        // Array of strings
        type: String,
        required: true,
        enum: [
            'Lazada',
            'Shopee',
            'JD',
            'Line',
            'Facebook',
            'Brand_Website',
            'Api',
            'Upload'
        ],
        default: 'Api'
    },
    cargo_info: {
        item_type: {
            // Array of strings
            type: String,
            required: true,
            enum: [
                'Document',
                'Dry food',
                'Daily Necessities',
                'Electronics and IT equipment',
                'Clothing',
                'Entertainment',
                'Auto parts',
                'Shoes and bags',
                'Cosmetics',
                'Home decor or hame accessories',
                'Fruit',
                'Other'
            ],
            default: 'Other'
        },
        //kg
        weight: Number,
        //cm
        lengths: Number,
        width: Number,
        height: Number,
        iscod: {
            // Array of strings
            type: String,
            required: true,
            enum: [
                'Y',
                'N'
            ],
            default: 'N'
        },
        cod_amount: Number,
    },

    picked_up_info: {
        photo: {
            // Array of strings
            type: String
        },
        signature: {
            // Array of strings
            type: String
        },
        driver : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    delivered_info: {
        photo: {
            // Array of strings
            type: String
        },
        signature: {
            // Array of strings
            type: String
        },
        driver : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    picking_date: {
        type: Date
    },
    picked_date: {
        type: Date
    },
    outed_from_wh_date: {
        type: Date
    },
    delivered_date: {
        type: Date
    },
    updated_date: {
        type: Date
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

ShipmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ShipmentSchema.set('toJSON', {
    virtuals: true,
});


//Static method to get avg of course tuitions
ShipmentSchema.statics.getTrackingNumber = async function (shipmentId) {
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

module.exports = mongoose.model('Shipment', ShipmentSchema);



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
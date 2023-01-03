const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    order_items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }],
    order_number: {
        type: String,
        required: [true, 'Please add a order number'],
        unique: [true, 'Order number has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Order number can not be more than 100 characters']
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
      shipping_address_line1: {
        type: String,
        required: [true, 'Please add an address']
      },
      shipping_full_name: {
        type: String,
        required: [true, 'Please add shipping full name']
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
        default: 'Pending',
    },
    iscod: {
        type: Boolean,
        default: false,
    },
    cod_amount: {
        type: Number
        
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
          'Brand_Website'
        ],
        default:'Brand_Website'
      },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    date_ordered: {
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
})

OrderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

OrderSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Order', OrderSchema);



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
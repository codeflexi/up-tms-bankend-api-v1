const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            comment_text: {
                type: String
            }
        }
    ],
    post_number: {
        type: String,
        required: [true, 'Please add a post number'],
        unique: [true, 'Post number has to be unique'],
        trim: true,
        sparse: true,
        maxlength: [100, 'Post number can not be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [150, 'Post number can not be more than 150 characters']
    },
    video: { type: String },
    likes: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        enum: [
            'DATA_SUBMITTED',
            'IN_PROCESS',
            'DONE',
            'CANCELLED'
        ],
        default: 'DATA_SUBMITTED',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
    plan_receive_date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    plan_try_date: {
        type: Date,
        required: true,
        default: Date.now,
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

PostSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

PostSchema.set('toJSON', {
    virtuals: true,
});


// //Call get AverageCost after save
// ShipmentSchema.post('save', function () {
//     // run static model use this
// this.constructor.getTrackingNumber(this.shipmentId);
// });

module.exports = mongoose.model('Post', PostSchema);



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
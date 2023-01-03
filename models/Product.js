const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
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
    price : {
        type: Number,
        default:0
    },
    isactivated: {
        type: Boolean,
        default: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
})

ProductSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ProductSchema.set('toJSON', {
    virtuals: true,
});


module.exports = mongoose.model('Product', ProductSchema);

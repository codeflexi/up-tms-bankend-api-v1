const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      unique: [true, 'Company name has to be unique'],
      trim: true,
      sparse: true,
      maxlength: [100, 'Comany name can not be more than 100 characters']

    },

    business_name: {
      type: String,
      required: [true, 'Please add a business Name'],
      maxlength: [200, 'Business name can not be more than 200 characters']
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    phone: {
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
    address_line1: {
      type: String,
      required: [true, 'Please add an address']
    },
    address_line2: {
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
    
    business_type: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        'FMCG',
        'RETAIL',
        'IT',
        'Other'
      ],
      default: 'Other'
    },
    company_logo: {
      type: String,
      default: 'no-photo.jpg'
    },
    ischild: {
      type: Boolean,
      default: false
    },
    iswarehouse: {
      type: Boolean,
      default: false
    },
    status: {
        type: String,
        required: true,
        default: 'Activated',
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
   
  },
  {
    //Virtuals
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
  
  );

module.exports = mongoose.model('Company', CompanySchema);
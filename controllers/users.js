const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const AWS = require('aws-sdk');
const sharp = require('sharp');
// const path = require('path');
// const sharp = require('sharp');
// const fs = require('fs');

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
exports.getUsers = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Get recommenned user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getRecUser = asyncHandler(async (req, res, next) => {

 //.sort({'last_view_date':-1 }).limit(2);
  //const user = await User.find();
  const data = User.find();
  
  res.status(200).json({
    success: true,
    data: data
  });
});


// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Add Follow
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.addFollow = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.id)
  .populate('follow');


  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  // // Append items to `comments`
  // let dupComment = ''
  // dupComment = user.follow.find(f => f === req.body.follow )
  // console.log(dupComment)
  // if (dupComment !== '' ){
  //   return next(
  //     new ErrorResponse(`User is exist with id of ${req.body.follow}`, 404)
  //   );
  // }

  user.follow.push(
     req.body.follow 
  )
  // Update document
  await user.save()
  res.status(200).json({ success: true, data: user });
});

// @desc      Un Follow
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.unFollow = asyncHandler(async (req, res, next) => {
 
  const user = await User.findById(req.user.id)
  .populate('follow');
  
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  // Append items to `comments`
  user.follow.pull(
     req.body.follow 
  )
  // Update document
  await user.save()
  res.status(200).json({ success: true, data: user });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
      return next(
          new ErrorResponse(`No User with the if of ${req.params.id}`),
          404
      );
  }


  if (req.body.image) {
    //const url = process.env.PROTOCAL + req.get('host');
    const url = process.env.BACKEND_URL;
  const baseurl = url + '/public/images/';
  const folder = '../public/images/';

  req.body.image = baseurl + `${req.params.id}.jpg`;
  
  } else {
    req.body.image = user.image
  }


  // Update User
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
//const asyncHandler = fn => (req, res, next) =>
exports.uploadUserImageMid =  asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
      return next(
          new ErrorResponse(`No User with the if of ${req.params.id}`),
          404
      );
  }


  if (req.body.image) {
    //const url = process.env.PROTOCAL + req.get('host');
    const url = process.env.BACKEND_URL;
  const baseurl = url + '/public/images/';
  const folder = '../public/images/';

  req.body.image = req.phone
  console.log('image');
  console.log('');
  
  } else {
    req.body.image = user.image
  }


  // Update User
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});



// @desc      Test Update user Image
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin

exports.uploadImage = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
      return next(
          new ErrorResponse(`No User with the if of ${req.params.id}`),
          404
      );
  }

// console.log(req.body.image);

// AWS S3 Configuration
var accessKeyId = process.env.S3_ACCESS_KEY_ID;
var secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
var bucketName = '';
var imageUrl = '';

const s3 = new AWS.S3(
    {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
);

  // Decode the base64 image to binary data
const base64Image = req.body.image;

 // Check if the base64Image is defined
 if (!base64Image) {
  return res.status(400).json(
    { success : false,
      base : req.body.status,
      error: 'Missing base64 image' });
}

// Decode the base64 image to binary data

const parts = base64Image.split(';');
const imageData = parts[1].split(',')[1];
const imageBuffer = new Buffer.from(imageData, 'base64');

if ( req.body.status  === 'DELIVERED') {
  bucketName = process.env.S3_BUCKET_IMAGES_DISPATCH;
} else {
  bucketName = process.env.S3_BUCKET_IMAGES_PICKUP;
}

// Generate a unique filename for the image
const filename = `${req.params.id}-photo.jpg`;

// Set up S3 upload parameters
const uploadParams = {
  Bucket: bucketName,
  Key: filename,
  Body: imageBuffer,
  ACL: 'public-read', // Optional - set ACL permissions for the uploaded file
 // ContentType: 'image/jpeg', // Optional - set content type based on your image type
};

  // Upload the image to S3
  s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'Failed to upload image' });
      } else {
        // Provide the S3 URL of the uploaded image as the response
        imageUrl = data.Location;

        if (req.body.image) {
          req.body.image =imageUrl;
          } 
          else {
            req.body.image = user.image
          }
        
          res.status(200).json({
            success: true,
            imageUrl: imageUrl,
            data: user
          });
       // res.json({ imageUrl });
      }
    });

}
);

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});



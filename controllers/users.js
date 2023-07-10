const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
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



const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Post = require('../models/Post');
const User = require('../models/User');

// @desc      Get all Shipment
// @route     GET /api/v1/Shipments
// @access    Private/Admin
exports.getPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {

  const post = await Post.findById(req.params.id)
    .populate('user')
    .populate('customer')
    .populate(
      {
        path: 'comments',
        populate: { path: 'user', select: '_id name email image' }
      })
     

  res
    .status(200)
    .json({ success: true, data: post });

});

// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getPostByCustomerId = asyncHandler(async (req, res, next) => {

  const post = await Post.find({ customer: req.params.customerId })
    .sort({ 'post_number': 'desc' })
    .populate('user')
    .populate('customer')
    .populate(
      {
        path: 'comments',
        populate: { path: 'user', select: '_id name email image' }
      })

  res
    .status(200)
    .json({ success: true, data: post });

});


// @desc    Create new shipments
// @route   POST /api/v1/shipments
// @access  Private

exports.createPost = asyncHandler(async (req, res, next) => {

  const randomInit = `PT${Date.now()}${(Math.round(Math.random() * 100))}`
  // Add user to req.body
  req.body.user = req.user.id;
  req.body.customer = req.user.id;
  req.body.post_number = randomInit;

  // Check for published post
  const postCheckDuplicate = await Post.findOne({ post_number: req.body.post_number });

  const updateUser = { last_view_date: Date.now() }

  // Update User
  const user = await User.findByIdAndUpdate(req.body.user.id, updateUser, {
    new: true,
    runValidators: true
  });

  // If duplicate post
  if (postCheckDuplicate) {
    return next(
      new ErrorResponse(
        `The Post number ${req.body.post_number} has already exists`,
        400
      )
    );
  }


  const url = process.env.PROTOCAL + req.get('host');
  const baseurl = url + '/public/videos/';

  if (req.file) {
    req.body.video = baseurl + req.file.filename;
  }


  // Create New Shipment
  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post
  });
  //await Character.create([{ name: 'Will Riker' }, { name: 'Geordi LaForge' }]);
});

// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: post });
});

// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.addComment = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }
  // Append items to `comments`
  post.comments.push(
    {
      user: req.body.user_comment,
      comment_text: req.body.comment
    }
  )

  // Update document
  await post.save()
  res.status(200).json({ success: true, data: post });
});

// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.deleteComment = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }
  // Append items to `comments`
  post.comments.pull(
    {
      _id: req.body.comment_id,
    }
  )

  // Update document
  await post.save()
  res.status(200).json({ success: true, data: post });
});


// @desc      Delete shipment
// @route     DELETE /api/v1/shipments/:id
// @access    Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  await post.remove();

  res.status(200).json({ success: true, data: {} });
});

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// @desc      Get all Bootcamp
// @route     GET /api/v1/bootcamps
// @access    Private/Admin
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Boocamp not fond with id of ${req.params.id}`, 404));

    }
    res
      .status(200)
      .json({ success: true, data: bootcamp });

  } catch (err) {
    // res.status(400).json({succss: false});
    next(err);
    //next(new ErrorResponse(`Boocamp not fond with id of ${req.params.id}`,404));
  }
};

// @desc    Create new bootcamps
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {

  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  //
  try {

    // Check for duplicate bootcamp name
    const checkBootcamp = await Bootcamp.findOne({ name: req.body.name });

    // If the user is not an admin, they can only add one bootcamp
    if (checkBootcamp) {
      return next(
        new ErrorResponse(
          `The name  ${req.body.name} has already exist`,
          400
        )
      );
    }

    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    next(err);
  }

}

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp` , 401
      )
    );
  }

// Update bootcamp
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

   // Make sure user is bootcamp owner
   if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp` , 401
      )
    );
  }


  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

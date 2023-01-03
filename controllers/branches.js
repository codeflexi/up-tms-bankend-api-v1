const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Branch = require('../models/Branch');

// @desc      Get all branch
// @route     GET /api/v1/branchs
// @access    Private/Admin
exports.getBranches = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single branch
// @route   GET /api/v1/comapanys/:id
// @access  Public
exports.getBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return next(
        new ErrorResponse(`Branch not fond with id of ${req.params.id}`, 404));

    }
    res
      .status(200)
      .json({ success: true, data: branch });

  } catch (err) {
    // res.status(400).json({succss: false});
    next(err);
    //next(new ErrorResponse(`Boocamp not fond with id of ${req.params.id}`,404));
  }
};

// @desc    Create new companies
// @route   POST /api/v1/companies
// @access  Private
exports.createBranch = async (req, res, next) => {

  // Add user to req.body
  //req.body.user = req.user.id;

  
  try {

    // Check for duplicate bootcamp name
    const checkBranch = await Branch.findOne({ name: req.body.name });

    // If the user is not an admin, they can only add one bootcamp
    if (checkBranch) {
      return next(
        new ErrorResponse(
          `The name  ${req.body.name} has already exist`,
          400
        )
      );
    }

    const branch = await Branch.create(req.body);

    res.status(201).json({
      success: true,
      data: branch
    });
  } catch (err) {
    next(err);
  }

}

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBranch = asyncHandler(async (req, res, next) => {
  let branch = await Branch.findById(req.params.id);

  if (!branch) {
    return next(
      new ErrorResponse(`Branch not found with id of ${req.params.id}`, 404)
    );
  }

// Update comapny
  branch = await Branch.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: branch });
});

// @desc      Delete branch
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBranch = asyncHandler(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    return next(
      new ErrorResponse(`Branch not found with id of ${req.params.id}`, 404)
    );
  }

  branch.remove();

  res.status(200).json({ success: true, data: {} });
});

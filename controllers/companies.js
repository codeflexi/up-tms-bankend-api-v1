const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Company = require('../models/Company');

// @desc      Get all Company
// @route     GET /api/v1/companys
// @access    Private/Admin
exports.getCompanies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single company
// @route   GET /api/v1/comapanys/:id
// @access  Public
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return next(
        new ErrorResponse(`Company not fond with id of ${req.params.id}`, 404));

    }
    res
      .status(200)
      .json({ success: true, data: company });

  } catch (err) {
    // res.status(400).json({succss: false});
    next(err);
    //next(new ErrorResponse(`Boocamp not fond with id of ${req.params.id}`,404));
  }
};

// @desc    Create new companies
// @route   POST /api/v1/companies
// @access  Private
exports.createCompany = async (req, res, next) => {

  // Add user to req.body
  //req.body.user = req.user.id;

  
  try {

    // Check for duplicate bootcamp name
    const checkCompany = await Company.findOne({ name: req.body.name });

    // If the user is not an admin, they can only add one bootcamp
    if (checkCompany) {
      return next(
        new ErrorResponse(
          `The name  ${req.body.name} has already exist`,
          400
        )
      );
    }

    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      data: company
    });
  } catch (err) {
    next(err);
  }

}

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
  let company = await Company.findById(req.params.id);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

// Update comapny
  company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: company });
});

// @desc      Delete company
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  company.remove();

  res.status(200).json({ success: true, data: {} });
});

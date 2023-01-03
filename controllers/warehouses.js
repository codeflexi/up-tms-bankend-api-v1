const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Warehouse = require('../models/Warehouse');

// @desc      Get all Warehouse
// @route     GET /api/v1/Warehouses
// @access    Private/Admin
exports.getWarehouses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single Warehouse
// @route   GET /api/v1/comapanys/:id
// @access  Public
exports.getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return next(
        new ErrorResponse(`Warehouse not fond with id of ${req.params.id}`, 404));

    }
    res
      .status(200)
      .json({ success: true, data: warehouse });

  } catch (err) {
    // res.status(400).json({succss: false});
    next(err);
    //next(new ErrorResponse(`Boocamp not fond with id of ${req.params.id}`,404));
  }
};

// @desc    Create new companies
// @route   POST /api/v1/companies
// @access  Private
exports.createWarehouse = async (req, res, next) => {

  // Add user to req.body
  //req.body.user = req.user.id;

  
  try {

    // Check for duplicate bootcamp name
    const checkWarehouse = await Warehouse.findOne({ name: req.body.name });

    // If the user is not an admin, they can only add one bootcamp
    if (checkWarehouse) {
      return next(
        new ErrorResponse(
          `The name  ${req.body.name} has already exist`,
          400
        )
      );
    }

    const warehouse = await Warehouse.create(req.body);

    res.status(201).json({
      success: true,
      data: warehouse
    });
  } catch (err) {
    next(err);
  }

}

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateWarehouse = asyncHandler(async (req, res, next) => {
  let warehouse = await Warehouse.findById(req.params.id);

  if (!warehouse) {
    return next(
      new ErrorResponse(`Warehouse not found with id of ${req.params.id}`, 404)
    );
  }

// Update comapny
  warehouse = await Warehouse.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: warehouse });
});

// @desc      Delete company
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteWarehouse= asyncHandler(async (req, res, next) => {
  const warehouse = await Warehouse.findById(req.params.id);

  if (!warehouse) {
    return next(
      new ErrorResponse(`Warehouse not found with id of ${req.params.id}`, 404)
    );
  }

  warehouse.remove();

  res.status(200).json({ success: true, data: {} });
});

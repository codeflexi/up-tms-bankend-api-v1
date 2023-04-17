const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Vehicle = require('../models/Vehicle');


// @desc      Get all products
// @route     GET /api/v1/products
// @route     GET /api/v1/bootcamps/:bootcampId/products
// @access    PUblic

exports.getVehicles = asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults);
});

// @desc      Get single product
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getVehicle = asyncHandler(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return next(
            new ErrorResponse(`No vehicle with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: vehicle
    });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addVehicle = asyncHandler(async (req, res, next) => {
    // Assign bootcampId to req.body for adding bootcampid 

    // Create Course for that bootcamp
    const vehicle = await Vehicle.create(req.body);

    res.status(200).json({
        success: true,
        data: vehicle
    });
});

// @desc      Update course
// @route     POST /api/v1/courses/:id
// @access    Private
exports.updateVehicle = asyncHandler(async (req, res, next) => {


    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return next(
            new ErrorResponse(`No Vehicle with the if of ${req.params.id}`),
            404
        );
    }

    // Update course
    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: vehicle
    });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteVehicle = asyncHandler(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
        return next(
            new ErrorResponse(`No verhicle with the id of ${req.params.id}`),
            404
        );
    }


    await vehicle.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});



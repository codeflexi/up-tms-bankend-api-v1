const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Route = require('../models/Route');
const RouteMapping = require('../models/RouteMapping');


// @desc      Get all products
// @route     GET /api/v1/products
// @route     GET /api/v1/bootcamps/:bootcampId/products
// @access    PUblic

exports.getRoutes = asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults);
});

exports.getRouteMappings = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc      Get single product.c
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getRoute = asyncHandler(async (req, res, next) => {
    const route = await Route.findById(req.params.id);

    if (!route) {
        return next(
            new ErrorResponse(`No route with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: route
    });
});

exports.findRouteByPostcode = asyncHandler(async (req, res, next) => {
    const routemapping = await RouteMapping.findOne({postcode:req.params.id})
    .populate('route')
  
    if (!routemapping) {
        return next(
            new ErrorResponse(`No route with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: routemapping
    });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addRoute = asyncHandler(async (req, res, next) => {
    // Assign bootcampId to req.body for adding bootcampid 

    // Create Course for that bootcamp
    const route = await Route.create(req.body);

    res.status(200).json({
        success: true,
        data: route
    });
});

// @desc      Add Multiple Root
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addRouteMany = asyncHandler(async (req, res, next) => {
    // Assign bootcampId to req.body for adding bootcampid 

    // Create Course for that bootcamp
    const route = await Route.insertMany(req.body);

    res.status(200).json({
        success: true,
        data: route
    });
});


exports.addRouteMapping = asyncHandler(async (req, res, next) => {
    // Assign bootcampId to req.body for adding bootcampid 

    // Create Course for that bootcamp
    const routemapping = await RouteMapping.create(req.body);

    res.status(200).json({
        success: true,
        data: routemapping
    });
});

// @desc      Update course
// @route     POST /api/v1/courses/:id
// @access    Private
exports.updateRoute = asyncHandler(async (req, res, next) => {


    let route = await Route.findById(req.params.id);

    if (!route) {
        return next(
            new ErrorResponse(`No route with the if of ${req.params.id}`),
            404
        );
    }

    // Update course
    route = await Route.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: route
    });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteRoute = asyncHandler(async (req, res, next) => {
    const route = await Route.findById(req.params.id);

    if (!route) {
        return next(
            new ErrorResponse(`No route with the id of ${req.params.id}`),
            404
        );
    }


    await route.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

exports.deleteRouteMapping = asyncHandler(async (req, res, next) => {
    const routemapping = await RouteMapping.findById(req.params.id);

    if (!routemapping) {
        return next(
            new ErrorResponse(`No route with the id of ${req.params.id}`),
            404
        );
    }

    await RouteMapping.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});



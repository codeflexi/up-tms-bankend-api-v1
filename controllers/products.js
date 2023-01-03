const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');


// @desc      Get all products
// @route     GET /api/v1/products
// @route     GET /api/v1/bootcamps/:bootcampId/products
// @access    PUblic

exports.getProducts = asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults);
});

// @desc      Get single product
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`No product with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addProduct = asyncHandler(async (req, res, next) => {
    // Assign bootcampId to req.body for adding bootcampid 
console.log(req.body);
    // Create Course for that bootcamp
    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc      Update course
// @route     POST /api/v1/courses/:id
// @access    Private
exports.updateProduct = asyncHandler(async (req, res, next) => {


    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`No course with the if of ${req.params.id}`),
            404
        );
    }

    // Update course
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const prouduct = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`No product with the id of ${req.params.id}`),
            404
        );
    }


    await product.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});



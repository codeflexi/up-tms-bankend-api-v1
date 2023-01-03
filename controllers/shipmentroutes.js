const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Shipment = require('../models/Shipment');

const ShipmentRoute = require('../models/ShipmentRoute');

// @desc      Get all Shipment
// @route     GET /api/v1/Shipments
// @access    Private/Admin
exports.getShipmentRoutes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipmentRoute = asyncHandler(async (req, res, next) => {

  const shipmentroute = await ShipmentRoute.findById(req.params.id)
    .populate('user', 'name')
    .populate('shipment_ids')
    .populate('from_source')
    .populate('to_destination')
   
  
  if (!shipmentroute) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: shipmentroute });

});

// @desc    Create new shipments
// @route   POST /api/v1/shipments
// @access  Private

exports.createShipmentRoute = asyncHandler(async (req, res, next) => {

const randomInit = `RO${Date.now()}${(Math.round(Math.random() * 10))}`


  // Add user to req.body
  req.body.user = req.user.id;
  req.body.route_number = randomInit;
  //req.body.shipment_items = shipmentItemIds;

  //const shipment = await shipment.create(req.body);
  // shipment = await shipment.save();
  // Create Course for that bootcamp
  const shipmentroute = await ShipmentRoute .create(req.body);

  res.status(201).json({
    success: true,
    data: shipmentroute
  });

});


// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.updateShipmentRoute  = asyncHandler(async (req, res, next) => {
  const shipmentroute = await ShipmentRoute.findById(req.params.id);

  if (!shipmentroute) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }

  // Update shipment
  const shipmentrouteupdate = await ShipmentRoute.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // const names = req.body.shipment_ids
  // for (const index in names) {  
  //   console.log(names[index])
  // }


  res.status(200).json({ success: true, data: shipmentrouteupdate });
});

// @desc      Delete shipment
// @route     DELETE /api/v1/shipments/:id
// @access    Private
exports.deleteShipmentRoute= asyncHandler(async (req, res, next) => {
  const shipmentroute = await ShipmentRoute.findById(req.params.id);

  if (!shipmentroute) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }


  await shipmentroute.remove();
  res.status(200).json({ success: true, data: {} });
});

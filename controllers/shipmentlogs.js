const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ShipmentLog = require('../models/ShipmentLog');
const Shipment = require('../models/Shipment');

// @desc      Get reviews
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getShipmentLogs = asyncHandler(async (req, res, next) => {
  if (req.params.shipmentId) {
    const shipmentlogs = await ShipmentLog.find({ shipment_id: req.params.shipmentId })
    .populate('user')
    .sort({logged_date:'desc'});
   // query.sort({ field: 'asc', test: -1 });
    return res.status(200).json({
      success: true,
      count: shipmentlogs.length,
      data: shipmentlogs
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getShipmentLog = asyncHandler(async (req, res, next) => {
  const shipmentlog = await ShipmentLog.findById(req.params.id).populate({
    path: 'shipment_id',
    select: 'waybill_number  shipment_number'
  });

  if (!shipmentlog) {
    return next(
      new ErrorResponse(`No shipment found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: shipmentlog
  });
});

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.addShipmentLog = asyncHandler(async (req, res, next) => {
  req.body.shipment_id = req.params.shipmentId;
  req.body.user = req.user.id;
  const randomLogInt = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`
  
 

  const shipment = await Shipment.findById(req.params.shipmentId);

  if (!shipment) {
    return next(
      new ErrorResponse(
        `No shipment with the id of ${req.params.shipmentId}`,
        404
      )
    );
  }
  req.body.log_number = randomLogInt
  req.body.waybill_number = shipment.waybill_number
  req.body.shipment_number = shipment.shipment_number

  const shipmentlog = await ShipmentLog.create(req.body);

  res.status(201).json({
    success: true,
    data: shipmentlog
  });
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateShipmentLog = asyncHandler(async (req, res, next) => {
  let shipmentlog = await ShipmentLog.findById(req.params.id);

  if (!shipmentlog) {
    return next(
      new ErrorResponse(`No shipment with the id of ${req.params.id}`, 404)
    );
  }



  shipmentlog = await ShipmentLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: shipmentlog
  });
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteShipmentLog= asyncHandler(async (req, res, next) => {
  const shipmentlog = await ShipmentLog.findById(req.params.id);

  if (!shipmentlog) {
    return next(
      new ErrorResponse(`No Shipment with the id of ${req.params.id}`, 404)
    );
  }


  await shipmentlog.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

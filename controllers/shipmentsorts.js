const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Shipment = require('../models/Shipment');

const ShipmentSort = require('../models/ShipmentSort');

// @desc      Get all Shipment
// @route     GET /api/v1/Shipments
// @access    Private/Admin
exports.getShipmentSorts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipmentSort = asyncHandler(async (req, res, next) => {

  const shipmentsort = await ShipmentSort.findById(req.params.id)
    .populate('user', 'name')
    .populate('shipment_ids')
    .populate('route')
  // .populate('from_source')
  // .populate('to_destination')


  if (!shipmentsort) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: shipmentsort });

});

// @desc    Create new shipments
// @route   POST /api/v1/shipments
// @access  Private

exports.createShipmentSort = asyncHandler(async (req, res, next) => {

  const randomInit = `SO${Date.now()}${(Math.round(Math.random() * 10))}`

  // Add user to req.body
  req.body.user = req.user.id;
  if (req.body.sort_number != "") {
    req.body.sort_number = randomInit;
  }

  // Start Update Shipment Status
  //  Save shipment items
  const shipmentItemsIds = Promise.all(req.body.shipment_ids.map(async (shipmentid) => {
    return shipmentid;
  }));

  // Update Shipment Status
  for (var item in shipmentItemsIds) {
    const shipment = await Shipment.findById(item);
    console.log(item)
    if (!shipment) {
      return next(
        new ErrorResponse(`Shipment not found with id of ${item}`, 404)
      );
    }

   
    shipment = await Shipment.findByIdAndUpdate(item, { status: 'SORTED' }, {
      new: true,
      runValidators: true
    });
  }

   // Update shipment
   const shipmentsort = await ShipmentSort.create(req.body);

  // End Update Shipment Status

  res.status(201).json({
    success: true,
    data: shipmentsort
  });

});


// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.updateShipmentSort = asyncHandler(async (req, res, next) => {
  const shipmentsort = await ShipmentSort.findById(req.params.id);

  if (!shipmentsort) {
    return next(
      new ErrorResponse(`Shipment sort not found with id of ${req.params.id}`, 404)
    );
  }

  // Update shipment
  shipmentsort = await ShipmentSort.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // const names = req.body.shipment_ids
  // for (const index in names) {  
  //   console.log(names[index])
  // }


  res.status(200).json({ success: true, data: shipmentsort });
});

// @desc      Delete shipment
// @route     DELETE /api/v1/shipments/:id
// @access    Private
exports.deleteShipmentSort = asyncHandler(async (req, res, next) => {
  const shipmentsort = await ShipmentSort.findById(req.params.id);

  if (!shipmentsort) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }


  await shipmentsort.remove();
  res.status(200).json({ success: true, data: {} });
});

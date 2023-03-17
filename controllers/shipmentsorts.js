const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Shipment = require('../models/Shipment');

const ShipmentSort = require('../models/ShipmentSort');
const ShipmentLog = require('../models/ShipmentLog')

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

  const randomInit = `ST${Date.now()}${(Math.round(Math.random() * 10))}`

  // Add user to req.body
  req.body.user = req.user.id;
  if (req.body.sort_number != "") {
    req.body.sort_number = randomInit;
  }

  // Start Update Shipment Status
  //  Save shipment items
  //console.log("Update Shipment Status")
  const shipmentItemsIds = Promise.all(req.body.shipment_ids.map(async (shipmentid) => {
    return shipmentid;
  }));

  const shipmentItemsIdsResolved = await shipmentItemsIds;


  // Update Shipment Status
  const updateshipment = await Promise.all(shipmentItemsIdsResolved.map(async (shipmentItemId) => {

    const shipment = await Shipment.findById(shipmentItemId);

    if (!shipment) {
      return next(
        new ErrorResponse(`Shipment not found with id of ${item}`, 404)
      );
    }

    const update = {
      status: 'SORTED'
    }

    await Shipment.findByIdAndUpdate(shipmentItemId, update, {
      new: true,
      runValidators: true
    });

    //Create Log of New Shipments
    const randomLogInt = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`
    const shipmentlog = {
      user: req.user.id,
      log_number: randomLogInt,
      waybill_number: shipment.waybill_number,
      shipment_number: shipment.shipment_number,
      event: "SORTED",
      shipment_id: shipment._id,
      ref_number: randomInit
    }
    const shipmentlogadd = await ShipmentLog.create(shipmentlog);
    //console.log(shipmentlogadd)

  }))


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

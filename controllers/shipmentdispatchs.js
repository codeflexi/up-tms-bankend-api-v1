const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Shipment = require('../models/Shipment');
const Vehicle = require('../models/Vehicle');

const ShipmentPick = require('../models/ShipmentPick');
const ShipmentDispatch = require('../models/ShipmentDispatch');
const ShipmentLog = require('../models/ShipmentLog')

// @desc      Get all Shipment
// @route     GET /api/v1/Shipments
// @access    Private/Admin
exports.getShipmentDispatchs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipmentDispatch = asyncHandler(async (req, res, next) => {

  const shipmentdispatch = await ShipmentDispatch.findById(req.params.id)
  .populate('user', 'name')
  .populate({
    path:'shipment_ids',
    populate:'company'
  },
  )

  .populate('company')
  .populate('warehouse')
  .populate('driver')
  .populate('vehicle')



  if (!shipmentdispatch) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: shipmentdispatch });

});

// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipmentDispatchByUser = asyncHandler(async (req, res, next) => {
console.log(req.params.userId)
  const shipmentdispatch = await ShipmentDispatch.find({ driver: req.params.userId, status: "CREATED" })
    .populate('user', 'name')
    .populate('shipment_ids')
    .populate('company')
    .populate('warehouse')
    .populate('driver')
    .populate('vehicle')
    .sort({planned_date:1})


  if (!shipmentdispatch) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({
      success: true,
      count: shipmentdispatch.length,
      data: shipmentdispatch
    });

});


// @desc    Create new shipments
// @route   POST /api/v1/shipments
// @access  Private

exports.createShipmentDispatch = asyncHandler(async (req, res, next) => {

  const randomInit = `DP${Date.now()}${(Math.round(Math.random() * 10))}`

  // Add user to req.body
  req.body.user = req.user.id;

  if (req.body.dispatch_number != "") {
    req.body.dispatch_number = randomInit;
  }


  const vehicle = await Vehicle.findById(req.body.vehicle);
  req.body.driver = vehicle.driver


  // Start Update Shipment Status
  //  Save shipment items

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

    // Update Shipment Documents
    const update = {
      status: 'DISPATCHING',
      driver: req.body.driver,
      vehicle: vehicle._id,
      dispatching_date: req.body.planned_date,
      shipment_dispatch: randomInit,
      updated_by: req.body.user,
      updated_date: Date.now()
    }

    await Shipment.findByIdAndUpdate(shipmentItemId, update, {
      new: true,
      runValidators: true
    });

    //Create Log of New Shipments
    //console.log('Add Log Dispaching')
    const randomLogInt = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`
    const shipmentlog = {
      user: req.user.id,
      log_number: randomLogInt,
      waybill_number: shipment.waybill_number,
      shipment_number: shipment.shipment_number,
      event: 'DISPATCHING',
      shipment_id: shipment._id,
      ref_number: randomInit
    }
    await ShipmentLog.create(shipmentlog);
    //console.log(shipmentlogadd)

  }))

  // Update shipment
  const shipmentdispatch = await ShipmentDispatch.create(req.body);

  // End Update Shipment Status

  res.status(201).json({
    success: true,
    data: shipmentdispatch
  });

});

// @desc    Create Picked Up Transaction
// @route   POST /api/v1/shipments
// @access  Private

exports.createDispatch = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;

  const shipmentdispatch = await ShipmentDispatch.findById(req.params.id);

  if (!shipmentdispatch) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }
  // Start Update Shipment Status
  //  Save shipment items

  const shipmentItemsIds = Promise.all(req.body.shipment_ids.map(async (shipmentid) => {
    return shipmentid;
  }));

  const shipmentItemsIdsResolved = await shipmentItemsIds;

  // Update Shipment Status Loop all Shipments
  // 1. Insert Log
  // 2. Udaate Shipment Status & Insert Image&Signature 
  const updateshipment = await Promise.all(shipmentItemsIdsResolved.map(async (shipmentItemId) => {

    const shipment = await Shipment.findById(shipmentItemId);

    if (!shipment) {
      return next(
        new ErrorResponse(`Shipment not found with id of ${item}`, 404)
      );
    }



    //const url = process.env.PROTOCAL + req.get('host');
    const url = process.env.BACKEND_URL;
    const baseurl = url + '/public/images-dispatch/';
    var photo = ''
    var signature = ''

    if (req.body.photo && req.body.signature) {
      photo = baseurl + `${req.params.id}-photo.jpg`;
      signature = baseurl + `${req.params.id}-signature.jpg`;

    } else {
      photo = shipment.loaded_info.photo
      signature = shipment.loaded_info.signature
    }

    // 3.Update shipment 
    //cont updateStatus = if ()
    let shipmentUpdate = {
      picked_date: Date.now(),
      updated_date: Date.now(),
      updated_by: req.user.id,
      status: 'OUT FOR DELIVERY',
      loaded_info: {
        photo: photo,
        signature: signature,
        driver: req.user.id
      }

    }

    await Shipment.findByIdAndUpdate(shipmentItemId, shipmentUpdate, {
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
      event: 'OUT FOR DELIVERY',
      shipment_id: shipment._id,
      ref_number: shipmentdispatch.dispatch_number
    }
    const shipmentlogadd = await ShipmentLog.create(shipmentlog);
    //console.log(shipmentlogadd)

  }))

  // Update shipment Pick
  const update = {
    status: "COMPLETED",
    updated_date: Date.now(),
    loaded_date: Date.now(),
  }

  const shipmentdispatchupdate = await ShipmentDispatch.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true
  });

  // End Update Shipment Status

  res.status(200).json({ success: true, data: shipmentdispatchupdate });
});


// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.updateShipmentPick = asyncHandler(async (req, res, next) => {
  const shipmentpick = await ShipmentPick.findById(req.params.id);

  if (!shipmentpick) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }

  // Update shipment
  const shipmentpickupdate = await ShipmentPick.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // const names = req.body.shipment_ids
  // for (const index in names) {  
  //   console.log(names[index])
  // }

  res.status(200).json({ success: true, data: shipmentpickupdate });
});

// @desc      Delete shipment
// @route     DELETE /api/v1/shipments/:id
// @access    Private
exports.deleteShipmentPick = asyncHandler(async (req, res, next) => {
  const shipmentpick = await ShipmentPick.findById(req.params.id);

  if (!shipmentpick) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }


  await shipmentpick.remove();
  res.status(200).json({ success: true, data: {} });
});

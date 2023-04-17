const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Shipment = require('../models/Shipment');
const Vehicle = require('../models/Vehicle');

const ShipmentPick = require('../models/ShipmentPick');
const ShipmentLog = require('../models/ShipmentLog')

// @desc      Get all Shipment
// @route     GET /api/v1/Shipments
// @access    Private/Admin
exports.getShipmentPicks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipmentPick = asyncHandler(async (req, res, next) => {

  const shipmentpick = await ShipmentPick.findById(req.params.id)
    .populate('user', 'name')
    .populate('shipment_ids')
    .populate('company')
    .populate('warehouse')
    .populate('driver')
    .populate('vehicle')
   
  
  if (!shipmentpick) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: shipmentpick });

});

// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipmentPickByUser = asyncHandler(async (req, res, next) => {

  const shipmentpick = await ShipmentPick.find({ driver: req.params.userId , status: "CREATED"})
    .populate('user', 'name')
    .populate('shipment_ids')
    .populate('company')
    .populate('warehouse')
    .populate('driver')
    .populate('vehicle')
   
  
  if (!shipmentpick) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, 
      count:shipmentpick.length,
      data: shipmentpick });

});


// @desc    Create new shipments
// @route   POST /api/v1/shipments
// @access  Private

exports.createShipmentPick = asyncHandler(async (req, res, next) => {

  const randomInit = `PK${Date.now()}${(Math.round(Math.random() * 10))}`

  // Add user to req.body
  req.body.user = req.user.id;

  if (req.body.pick_number != "") {
    req.body.pick_number = randomInit;
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
      status: 'PICKING UP',
      driver: req.body.driver,
      vehicle : vehicle._id,
      picking_date :  req.body.planned_date,
      shipment_pick :  randomInit,
      updated_by: req.body.user,
      updated_date: Date.now()
    }

      await Shipment.findByIdAndUpdate(shipmentItemId,update, {
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
      event: 'PICKING UP' ,
      shipment_id: shipment._id,
      ref_number: randomInit
    }
    const shipmentlogadd = await ShipmentLog.create(shipmentlog);
    //console.log(shipmentlogadd)
    
  }))

   // Update shipment
   const shipmentpick = await ShipmentPick.create(req.body);

  // End Update Shipment Status

  res.status(201).json({
    success: true,
    data: shipmentpick
  });

});

// @desc    Create Picked Up Transaction
// @route   POST /api/v1/shipments
// @access  Private

exports.createPicked = asyncHandler(async (req, res, next) => {


 
  const shipmentpick = await ShipmentPick.findById(req.body.pick_id);

  if (!shipmentpick) {
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


  // Update Shipment Status
  const updateshipment = await Promise.all(shipmentItemsIdsResolved.map(async (shipmentItemId) => {

    const shipment = await Shipment.findById(shipmentItemId);

    if (!shipment) {
      return next(
        new ErrorResponse(`Shipment not found with id of ${item}`, 404)
      );
    }

    const update = {
      status: 'PICKED UP' 
    }

      await Shipment.findByIdAndUpdate(shipmentItemId,update, {
        new: true,
        runValidators: true
      });

       //Create Log of New Shipments
    const randomLogInt = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`
    const shipmentlog = {
      user: shipmentpick.driver,
      log_number: randomLogInt,
      waybill_number: shipment.waybill_number,
      shipment_number: shipment.shipment_number,
      event: 'PICKED UP' ,
      shipment_id: shipment._id,
      ref_number: shipmentpick.pick_number
    }
    const shipmentlogadd = await ShipmentLog.create(shipmentlog);
    //console.log(shipmentlogadd)
    
  }))

   // Update shipment Pick

   const update = {
    status: "COMPLETED",
    updated_date: Date.now(),
    picked_date: Date.now(),
   }
   
   const shipmentpickupdate = await ShipmentPick.findByIdAndUpdate(req.body.pick_id, update, {
    new: true,
    runValidators: true
  });

  // End Update Shipment Status

  res.status(200).json({ success: true, data: shipmentpickupdate });
});


// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.updateShipmentPick  = asyncHandler(async (req, res, next) => {
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
exports.deleteShipmentPick= asyncHandler(async (req, res, next) => {
  const shipmentpick = await ShipmentPick.findById(req.params.id);

  if (!shipmentpick) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }


  await shipmentpick.remove();
  res.status(200).json({ success: true, data: {} });
});

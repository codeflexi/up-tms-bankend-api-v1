const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Shipment = require('../models/Shipment');
const ShipmentLog = require('../models/ShipmentLog');
const ShipmentItem = require('../models/ShipmentItem');
const ShipmentPick = require('../models/ShipmentPick');

// @desc      Get all Shipment
// @route     GET /api/v1/Shipments
// @access    Private/Admin
exports.getShipments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


// @desc    Get single Shipments
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipment = asyncHandler(async (req, res, next) => {

  const shipment = await Shipment.findById(req.params.id)
    .populate('user', 'name')
    .populate('company')
    .populate('warehouse')
    .populate('driver')
    .populate('vehicle')
    .populate(
      {
        path: 'shipment_items',
        populate: { path: 'product', select: 'code name price' }
      })

  if (!shipment) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: shipment });

});

// @desc    Get  Shipments by Ids
// @route   GET /api/v1/Shipments/:id
// @access  Public
exports.getShipmentByIds = asyncHandler(async (req, res, next) => {

  var ids = req.params.id.split(',');

  const shipment = await Shipment.find({ _id: { $in: ids } })
    .select('waybill_number company warehouse')

  // const shipment = await Shipment.findById(req.params.id)
  //   .populate('user', 'name')
  //   .populate('company')
  //   .populate('warehouse')
  //   .populate(
  //     {
  //       path: 'shipment_items',
  //       populate: { path: 'product', select: 'code name price' }
  //     })

  if (!shipment) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: shipment });

});


exports.getShipmentLogs = asyncHandler(async (req, res, next) => {

  const shipmentlog = await ShipmentLog.find({ shipment_id: req.params.id })
    .populate('user', 'name')
    .populate('shipment_id')


  if (!shipmentlog) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, data: shipmentlog });
});

// @desc    Create new shipments
// @route   POST /api/v1/shipments
// @access  Private

exports.createShipment = asyncHandler(async (req, res, next) => {

  let totalPrice = 0
  if (req.body.shipment_items) {
    //  Save shipment items
    const shipmentItemsIds = Promise.all(req.body.shipment_items.map(async (shipmentItem) => {
      let newShipmentItem = new ShipmentItem({
        quantity: shipmentItem.quantity,
        product: shipmentItem.product
      })
      newShipmentItem = await newShipmentItem.save();
      return newShipmentItem._id;
    }));


    const shipmentItemsIdsResolved = await shipmentItemsIds;

    const totalPrices = await Promise.all(shipmentItemsIdsResolved.map(async (shipmentItemId) => {
      const shipmentItem = await ShipmentItem.findById(shipmentItemId).populate('product', 'price');
      const totalPrice = shipmentItem.product.price * shipmentItem.quantity;
      return totalPrice
    }))

    totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    req.body.shipment_items = shipmentItemsIdsResolved;

  }
  const randomInit = `TH${Date.now()}${(Math.round(Math.random() * 1000))}`
  // Add user to req.body
  req.body.user = req.user.id;
  req.body.total_price = totalPrice;
  req.body.waybill_number = randomInit;
  //req.body.shipment_items = shipmentItemIds;

  //if(!shipment)
  //return res.status(400).send('the shipment cannot be created!')

  //res.send(shipment);

  // Check for published shipment
  const shipmentCheckDuplicate = await Shipment.findOne({ shipment_number: req.body.shipment_number });

  // If duplicate shipment
  if (shipmentCheckDuplicate) {
    return next(
      new ErrorResponse(
        `The Shipment number ${req.body.shipment_number} has already exists`,
        400
      )
    );
  }

  // Create New Shipment
  const shipment = await Shipment.create(req.body);

  //Create Log of New Shipments
  const randomLogInt = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`
  const shipmentlog = {
    user: req.user.id,
    log_number: randomLogInt,
    waybill_number: randomInit,
    shipment_number: shipment.shipment_number,
    event: "DATA SUBMITTED",
    shipment_id: shipment._id,
    ref_number: randomInit
  }
  const shipmentlogadd = await ShipmentLog.create(shipmentlog);
  //console.log(shipmentlogadd)

  res.status(201).json({
    success: true,
    data: shipment
  });
  //await Character.create([{ name: 'Will Riker' }, { name: 'Geordi LaForge' }]);
});


exports.createShipmentLog = asyncHandler(async (req, res, next) => {

  const randomInit = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`


  // Add user to req.body
  req.body.user = req.user.id;
  req.body.log_number = randomInit;

  //const shipment = await shipment.create(req.body);
  // shipment = await shipment.save();
  // Create Course for that bootcamp
  const shipmentlog = await ShipmentLog.create(req.body);
  res.status(201).json({
    success: true,
    data: shipmentlog
  });
});

// @desc      Add Multiple Root
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.uploadShipment = asyncHandler(async (req, res, next) => {
  // Assign bootcampId to req.body for adding bootcampid 

  // Create Course for that bootcamp
  const shipment = await Shipment.insertMany(req.body);

  res.status(200).json({
    success: true,
    count: shipment.length,
    data: shipment
  });
});


// @desc      Update shipment
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.updateShipment = asyncHandler(async (req, res, next) => {
  let shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }

  if (req.body.status === 'ARRIVED HUB') {

    //Create Log of New Shipments
    const randomLogInt = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`
    const shipmentlog = {
      user: req.user.id,
      log_number: randomLogInt,
      waybill_number: shipment.waybill_number,
      shipment_number: shipment.shipment_number,
      event: "ARRIVED HUB",
      shipment_id: shipment._id,
      ref_number: 'Receiving'
    }
    const shipmentlogadd = await ShipmentLog.create(shipmentlog);
  }

  // Update shipment
  if (!req.body.cargo_info.item_type) {
    req.body.cargo_info.item_type = shipment.cargo_info.item_type
  }

  shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });


  res.status(200).json({ success: true, data: shipment });
});


// @desc      Update shipment Pickup
// @route     PUT /api/v1/shipments/:id
// @access    Public
exports.updatePickup = asyncHandler(async (req, res, next) => {
  let shipment = await Shipment.findById(req.params.id);

  req.body.user = req.user.id;

  if (!shipment) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }

  //1.Create Log of New Shipments
  const randomLogInt = `LG${Date.now()}${(Math.round(Math.random() * 1000))}`
  const shipmentlog = {
    user: req.user.id,
    log_number: randomLogInt,
    waybill_number: shipment.waybill_number,
    shipment_number: shipment.shipment_number,
    event: 'PICKED UP',
    shipment_id: shipment._id,
    ref_number: shipment.shipment_pick
  }
  await ShipmentLog.create(shipmentlog);

  // 2.Update Shipment Pick Status
  const filters = { pick_number: shipment.shipment_pick }
  const pickupdate = { status: 'COMPLETED' }
  const shipmentpick = await ShipmentPick.findOneAndUpdate(filters, pickupdate, {
    new: true
  });


  const url = process.env.PROTOCAL + req.get('host');
  const baseurl = url + '/public/images-pickup/';
  var photo = ''
  var signature = ''

  if (req.body.photo && req.body.signature) {
    photo = baseurl + `${req.params.id}-photo.jpg`;
    signature = baseurl + `${req.params.idr}-signature.jpg`;

  } else {
    photo = shipment.picked_up_info.photo
    signature = shipment.picked_up_info.signature
  }

  // 3.Update shipment
  shipmentUpdate = {
    picked_date: Date.now(),
    updated_date: Date.now(),
    updated_by: req.user.id,
    status: 'PICKED UP',
    picked_up_info: {
      photo: photo,
      signature: signature,
      driver: req.user.id
    }

  }

  shipment = await Shipment.findByIdAndUpdate(req.params.id, shipmentUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: shipment });
});


// @desc      Delete shipment
// @route     DELETE /api/v1/shipments/:id
// @access    Private
exports.deleteShipment = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    return next(
      new ErrorResponse(`Shipment not found with id of ${req.params.id}`, 404)
    );
  }

  // // Make sure user is shipment owner
  // if (shipment.user.toString()) {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to update this shipment`, 401
  //     )
  //   );
  // }

  // delete order items
  await shipment.shipment_items.map(async shipmentitem => {
    await ShipmentItem.findByIdAndRemove(shipmentitem)

  })
  await shipment.remove();

  res.status(200).json({ success: true, data: {} });
});

const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Shipment = require('../models/Shipment');
const ShipmentItem = require('../models/ShipmentItem');

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
    .populate(
      {
        path: 'shipment_items',
        populate: { path: 'product', select: 'code name price' }
      })
     



  if (!shipment) {
    return next(
      new ErrorResponse(`Shipment not fond with id of ${req.params.id}`, 404));
  }

  // Depending on timezone, your results will vary
  const event = new Date("2022-12-10T14:45:09.126Z");

  console.log(event.toLocaleTimeString('en-TH').toString);
  console.log(event.toLocaleDateString('en-TH').toString);

  shipment.updated_date = event.toLocaleDateString('en-TH');

  res
    .status(200)
    .json({ success: true, data: shipment });


});

// @desc    Create new shipments
// @route   POST /api/v1/shipments
// @access  Private

exports.createShipment = asyncHandler(async (req, res, next) => {

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

 const randomInit = `TH${Date.now()}${(Math.round(Math.random() * 1000))}`


  

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  // Add user to req.body
  req.body.user = req.user.id;
  req.body.shipment_items = shipmentItemsIdsResolved;
  req.body.total_price = totalPrice;
  req.body.waybill_number = randomInit;
  //req.body.shipment_items = shipmentItemIds;

  // let shipment = new shipment({
  //   shipment_items: shipmentItemsIdsResolved,
  //   shipment_number: req.body.shipment_number,
  //   shipping_address_line1: req.body.shipping_address_line1,
  //   shipping_address_line2: req.body.shipping_address_line2,
  //   city: req.body.city,
  //   state: req.body.state,
  //   zipcode: req.body.zipcode,
  //   country: req.body.country,
  //   phone: req.body.phone,
  //   phone_alt: req.body.phone_alt,
  //   channel: req.body.channel,
  //   //status: req.body.status,
  //   total_price: totalPrice,
  //   user: req.body.user,
  //   company: req.body.company
  // })
  // shipment = await shipment.save();

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


  //const shipment = await shipment.create(req.body);
  // shipment = await shipment.save();
  // Create Course for that bootcamp
  const shipment = await Shipment.create(req.body);

  res.status(201).json({
    success: true,
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

  // // Make sure user is shipment owner
  // if (shipment.user.toString() !== req.user.id) {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to update this shipment`, 401
  //     )
  //   );
  // }

  // Update shipment
  shipment = await Shipment.findOneAndUpdate(req.params.id, req.body, {
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
    console.log()
  })
    await shipment.remove();

  res.status(200).json({ success: true, data: {} });
});

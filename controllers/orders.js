const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const { response } = require('express');

// @desc      Get all Order
// @route     GET /api/v1/Orders
// @access    Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


// @desc    Get single Orders
// @route   GET /api/v1/Orders/:id
// @access  Public
exports.getOrder = asyncHandler(async (req, res, next) => {

  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate('company')
    .populate(
      {
        path: 'order_items',
        populate: { path: 'product', select: 'code name price' }
      });




  if (!order) {
    return next(
      new ErrorResponse(`Order not fond with id of ${req.params.id}`, 404));
  }

  // Depending on timezone, your results will vary
  const event = new Date(order.updated_date);

  console.log(event.toLocaleTimeString('en-TH').toString);
  console.log(event.toLocaleDateString('en-TH').toString);

  order.updated_date = event.toLocaleDateString('en-TH');

  res
    .status(200)
    .json({ success: true, data: order });


});

// @desc    Create new orders
// @route   POST /api/v1/orders
// @access  Private

exports.createOrder = asyncHandler(async (req, res, next) => {

  //  Save order items
  const orderItemsIds = Promise.all(req.body.order_items.map(async (orderItem) => {
    let newOrderItem = new OrderItem({
      quantity: orderItem.quantity,
      product: orderItem.product
    })
    newOrderItem = await newOrderItem.save();
    return newOrderItem._id;
  }));


  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {

    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice
  }))

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  // Add user to req.body
  req.body.user = req.user.id;
  req.body.order_items = orderItemsIdsResolved;
  req.body.total_price = totalPrice;
  //req.body.order_items = orderItemIds;

  // let order = new Order({
  //   order_items: orderItemsIdsResolved,
  //   order_number: req.body.order_number,
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
  // order = await order.save();

  //if(!order)
  //return res.status(400).send('the order cannot be created!')

  //res.send(order);

  // Check for published order
  const orderCheckDuplicate = await Order.findOne({ order_number: req.body.order_number });

  // If duplicate order
  if (orderCheckDuplicate) {
    return next(
      new ErrorResponse(
        `The Order number ${req.body.order_number} has already exists`,
        400
      )
    );
  }


  //const order = await Order.create(req.body);
  // order = await order.save();
  // Create Course for that bootcamp
  const order = await Order.create(req.body);
  console.log(order._id);

  res.status(201).json({
    success: true,
    data: order
  });

});



// @desc      Update order
// @route     PUT /api/v1/orders/:id
// @access    Public
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // // Make sure user is order owner
  // if (order.user.toString() !== req.user.id) {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to update this order`, 401
  //     )
  //   );
  // }

  // Update order
  order = await Order.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: order });
});

// @desc      Delete order
// @route     DELETE /api/v1/orders/:id
// @access    Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
    );
  }

  // // Make sure user is order owner
  // if (order.user.toString()) {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to update this order`, 401
  //     )
  //   );
  // }

 // delete order items
  await order.order_items.map(async orderitem => {
  await OrderItem.findByIdAndRemove(orderitem)
  console.log()
})
  await order.remove();
  
  res.status(200).json({ success: true, data: {} });
});

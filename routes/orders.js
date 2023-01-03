const express = require('express');

const { getOrders, 
    getOrder, 
    updateOrder, 
    createOrder, 
    deleteOrder } = require('../controllers/orders');

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
// const courseRouter = require('./courses');
// const reveiwRouter = require('./reviews');


const router = express.Router();

// Re-Route in to other resource routers
// router.use('/:bootcampId/courses',courseRouter);
// router.use('/:bootcampId/reviews',reveiwRouter);


const { protect , authorize} = require('../middleware/auth');

router
.route('/')
.get(
    advancedResults(Order,
        [ {
      path: 'user',
      select: 'name'
    },
    {
        path: 'company',
        select: 'name'
      },

    {
        path: 'order_items',
        populate:{path:'product',select:'name price'}
      }
]
    ),
    getOrders
  )
 

.post(protect ,authorize('publisher','admin'), createOrder);

router
.route('/:id')
.get(
    getOrder)

.put(protect,authorize('publisher','admin'),updateOrder)
.delete(protect,authorize('publisher','admin'),deleteOrder);

module.exports = router;
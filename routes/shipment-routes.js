const express = require('express');

const { getShipmentRoutes, 
    getShipmentRoute, 
    updateShipmentRoute, 
    createShipmentRoute, 
    deleteShipmentRoute } = require('../controllers/shipmentroutes');

const ShipmentRoute = require('../models/ShipmentRoute');
const Shipment = require('../models/Shipment');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
 //const shipmentRouter = require('./shipments');
// const reveiwRouter = require('./reviews');


const router = express.Router();

// Re-Route in to other resource routers
// router.use('/:bootcampId/courses',courseRouter);
// router.use('/:bootcampId/reviews',reveiwRouter);


const { protect , authorize} = require('../middleware/auth');

router
.route('/')
.get(
    advancedResults(ShipmentRoute,
        [ {
      path: 'user',
      select: 'name'
    },
    {
        path: 'shipment_ids'
      },
      {path:'from_source'},
      {path:'to_destination'}
]
    ),
    getShipmentRoutes
  )
 

.post(protect ,authorize('publisher','admin'), createShipmentRoute);

router
.route('/:id')
.get(
    getShipmentRoute)
.put(protect,authorize('publisher','admin'),updateShipmentRoute)
.delete(protect,authorize('publisher','admin'),deleteShipmentRoute);

module.exports = router;
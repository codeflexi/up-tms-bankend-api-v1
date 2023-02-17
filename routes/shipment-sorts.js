const express = require('express');

const { getShipmentSorts, 
    getShipmentSort, 
    updateShipmentSort, 
    createShipmentSort, 
    deleteShipmentSort } = require('../controllers/shipmentsorts');

const ShipmentSort = require('../models/ShipmentSort');
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
    advancedResults(ShipmentSort,
        [ {
      path: 'user',
      select: 'name'
    },
    {
        path: 'shipment_ids'
      }
      ,
      {path:'route'},
]
    ),
    getShipmentSorts
  )
 

.post(protect ,authorize('publisher','admin'), createShipmentSort);

router
.route('/:id')
.get(
    getShipmentSort)
.put(protect,authorize('publisher','admin'),updateShipmentSort)
.delete(protect,authorize('publisher','admin'),deleteShipmentSort);

module.exports = router;
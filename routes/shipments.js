const express = require('express');

const { getShipments, 
    getShipment, 
    getShipmentLogs,
    updateShipment, 
    createShipment, 
    createShipmentLog,
    deleteShipment } = require('../controllers/shipments');

const Shipment = require('../models/Shipment');
const ShipmentItem = require('../models/ShipmentItem');

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
    advancedResults(Shipment,
        [ {
      path: 'user',
      select: 'name'
    },
    {
        path: 'company',
        select: 'name'
      },
      {
        path: 'warehouse'
      },
    {
        path: 'shipment_items',
        populate:{path:'product',select:'name price'}
      }
]
    ),
    getShipments
  )
 

.post(protect ,authorize('publisher','admin'), createShipment);

router
.route('/logs')
.post(protect ,authorize('publisher','admin'), createShipmentLog);

router
.route('/:id')
.get(
    getShipment)
.put(protect,authorize('publisher','admin'),updateShipment)
.delete(protect,authorize('publisher','admin'),deleteShipment);

router
.route('/logs/:id')
.get(
    getShipmentLogs)


module.exports = router;
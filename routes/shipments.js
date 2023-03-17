const express = require('express');

const { getShipments,
  getShipment,
  getShipmentLogs,
  updateShipment,
  createShipment,
  uploadShipment,
  createShipmentLog,
  deleteShipment,
  getShipmentByIds
} = require('../controllers/shipments');

const Shipment = require('../models/Shipment');

// Include other resource routers
const shipmentLogRouter = require('./shipment-logs');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:shipmentId/shipmentlogs', shipmentLogRouter);

router
  .route('/')
  .get(
    advancedResults(Shipment,
      [{
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
        populate: { path: 'product', select: 'name price' }
      }
      ]
    ),
    getShipments
  )


  .post(protect, authorize('publisher', 'admin'), createShipment);

router
  .route('/logs')
  .post(protect, authorize('publisher', 'admin'), createShipmentLog);

router
  .route('/:id')
  .get(
    getShipment)
  .put(protect, authorize('publisher', 'admin'), updateShipment)
  .delete(protect, authorize('publisher', 'admin'), deleteShipment);

router
  .route('/list/:id')
  .get(
    getShipmentByIds)


router
  .route('/logs/:id')
  .get(
    getShipmentLogs)

    router
    .route('/upload')
    .post(protect, authorize('publisher', 'admin'),   uploadShipment,
    );
    
module.exports = router;
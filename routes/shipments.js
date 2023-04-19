const express = require('express');

const { getShipments,
  getShipment,
  getShipmentLogs,
  updateShipment,
  createShipment,
  uploadShipment,
  uploadShipmentLog,
  createShipmentLog,
  deleteShipment,
  getShipmentByIds,
  updatePickup,
  updateDispatch
} = require('../controllers/shipments');

const Shipment = require('../models/Shipment');

// Include other resource routers
const shipmentLogRouter = require('./shipment-logs');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { validateFilePickupPhoto } = require('../middleware/validateFilePickupPhoto');
const { validateFileSPickupSinature } = require('../middleware/validateFileSPickupSinature');


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
        path: 'driver'
      },
      {
        path: 'vehicle'
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
  .route('/direct-pickup/:id')
  .put(protect, authorize('publisher', 'admin','user'),validateFilePickupPhoto,validateFileSPickupSinature, updatePickup);

  router
  .route('/dispatch/:id')
  .put(protect, authorize('publisher', 'admin','user'),validateFilePickupPhoto,validateFileSPickupSinature, updateDispatch);


router
  .route('/:id')
  .get(
    getShipment)
  .put(protect, authorize('publisher', 'admin'), updateShipment)
  .delete(protect, authorize('publisher', 'admin'), deleteShipment);

router
  .route('/list/:id')
  .get(
    getShipmentByIds);

router
  .route('/logs/:id')
  .get(
    getShipmentLogs);

router
  .route('/upload')
  .post(protect, authorize('user','publisher', 'admin'), uploadShipment,
  );

router
  .route('/log-upload')
  .post(protect, authorize('user','publisher', 'admin'), uploadShipmentLog,
  );




module.exports = router;
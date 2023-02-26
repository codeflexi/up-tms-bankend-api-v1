const express = require('express');
const {
  getShipmentLogs,
  getShipmentLog,
  addShipmentLog,
  updateShipmentLog,
  deleteShipmentLog
} = require('../controllers/shipmentlogs');

const ShipmentLog = require('../models/ShipmentLog');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(ShipmentLog, {
      path: 'shipment_id',
      select: 'waybill_number shipment_number'
    }),
    getShipmentLogs
  )
  .post(protect, authorize('user', 'admin'), addShipmentLog);

router
  .route('/:id')
  .get(getShipmentLog)
  .put(protect, authorize('user', 'admin'), updateShipmentLog)
  .delete(protect, authorize('user', 'admin'), deleteShipmentLog);

module.exports = router;

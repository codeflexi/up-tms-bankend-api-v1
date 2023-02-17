const express = require('express');
const {
  getVehicles,
  getVehicle,
  addVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicles');

const Vehicle = require('../models/Vehicle');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Vehicle, {
      path: 'driver',
      select: '_id name'
    }),
    getVehicles
  )
  .post(protect, authorize('publisher', 'admin'), addVehicle);

router
  .route('/:id')
  .get(getVehicle)
  .put(protect, authorize('publisher', 'admin'), updateVehicle)
  .delete(protect, authorize('publisher', 'admin'), deleteVehicle);

module.exports = router;

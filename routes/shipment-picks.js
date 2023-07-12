const express = require('express');

const { getShipmentPicks,
  getShipmentPick,
  getShipmentPickByUser,
  updateShipmentPick,
  createShipmentPick,
  createPicked,
  deleteShipmentPick } = require('../controllers/shipmentpicks');

const ShipmentPick = require('../models/ShipmentPick');
const Shipment = require('../models/Shipment');

const advancedResults = require('../middleware/advancedResults');

// const { validateFilePickupPhoto } = require('../middleware/validateFilePickupPhoto');
// const { validateFileSPickupSinature } = require('../middleware/validateFileSPickupSinature');

 const { uploadS3PickupPhoto } = require('../middleware/uploadS3PickupPhoto');
 const { uploadS3PickupSignature } = require('../middleware/uploadS3PickupSignature');

// Include other resource routers
//const shipmentRouter = require('./shipments');
// const reveiwRouter = require('./reviews');


const router = express.Router();

// Re-Route in to other resource routers
// router.use('/:bootcampId/courses',courseRouter);
// router.use('/:bootcampId/reviews',reveiwRouter);


const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(ShipmentPick,
      [{
        path: 'user',
        select: 'name'
      },
      {
        path: 'shipment_ids'
      },
      { path: 'company' },
      { path: 'warehouse' },
      { path: 'vehicle' },
      { path: 'driver' }
      ]
    ),
    getShipmentPicks
  )
  .post(protect, authorize('publisher', 'admin','user'), createShipmentPick);

router
  .route('/:id')
  .get(
    getShipmentPick)
  .put(protect, authorize('publisher', 'admin'), updateShipmentPick)
  .delete(protect, authorize('publisher', 'admin'), deleteShipmentPick);

router
  .route('/driver/:userId')
  .get(
    getShipmentPickByUser)

router
  .route('/picked/:id')
  .put(protect, authorize('publisher', 'admin','user'),uploadS3PickupPhoto,uploadS3PickupSignature, createPicked);



module.exports = router;
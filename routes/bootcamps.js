const express = require('express');

const { getBootcamps, 
    getBootcamp, 
    updateBootcamp, 
    createBootcamp, 
    deleteBootcamp } = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');
const reveiwRouter = require('./reviews');

const router = express.Router();

// Re-Route in to other resource routers
router.use('/:bootcampId/courses',courseRouter);
router.use('/:bootcampId/reviews',reveiwRouter);

const { protect , authorize} = require('../middleware/auth');

router
.route('/')
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(protect ,authorize('publisher','admin'), createBootcamp);

router
.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp);

module.exports = router;
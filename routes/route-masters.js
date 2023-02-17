const express = require('express');
const {
  getRoutes,
  getRoute,
  addRoute,
  updateRoute,
  deleteRoute,
  getRouteMappings,
  findRouteByPostcode,
  deleteRouteMapping,
  addRouteMapping
} = require('../controllers/routes');

const Route = require('../models/Route');
const RouteMapping = require('../models/RouteMapping');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');


router
.route('/')
.get(advancedResults(Route),getRoutes)
.post(protect, authorize('publisher', 'admin'), addRoute);

router
.route('/mapping')
.get(advancedResults(RouteMapping, {
  path: 'route',
  select: 'code name description'
}),getRouteMappings)
.post(protect, authorize('publisher', 'admin'), addRouteMapping);
 

router
  .route('/:id')
  .get(getRoute)
  .put(protect, authorize('publisher', 'admin'), updateRoute)
  .delete(protect, authorize('publisher', 'admin'), deleteRoute);

  router
  .route('/mapping/:id')
  .delete(protect, authorize('publisher', 'admin'), deleteRouteMapping);

  router
  .route('/mapping/find/:id')
  .delete(findRouteByPostcode);


module.exports = router;

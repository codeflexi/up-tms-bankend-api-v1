const express = require('express');

const {getWarehouses, 
    getWarehouse, 
    updateWarehouse, 
    createWarehouse, 
    deleteWarehouse } = require('../controllers/warehouses');

const Warehouse = require('../models/Warehouse');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const userRouter = require('./users');


const router = express.Router();

// Re-Route in to other resource routers
router.use('/:warehouseId/users',userRouter);


const { protect , authorize} = require('../middleware/auth');

router
.route('/')
.get(advancedResults(Warehouse),getWarehouses)
.post(protect ,authorize('publisher','admin'), createWarehouse);

router
.route('/:id')
.get(getWarehouse)
.put(protect,authorize('publisher','admin'),updateWarehouse)
.delete(protect,authorize('publisher','admin'),deleteWarehouse);

module.exports = router;
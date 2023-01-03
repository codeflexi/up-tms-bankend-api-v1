const express = require('express');

const { getBranches, 
    getBranch, 
    updateBranch, 
    createBranch, 
    deleteBranch } = require('../controllers/branches');

const Branch = require('../models/Branch');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const userRouter = require('./users');


const router = express.Router();

// Re-Route in to other resource routers
router.use('/:branchId/users',userRouter);


const { protect , authorize} = require('../middleware/auth');

router
.route('/')
.get(advancedResults(Branch),getBranches)
.post(protect ,authorize('publisher','admin'), createBranch);

router
.route('/:id')
.get(getBranch)
.put(protect,authorize('publisher','admin'),updateBranch)
.delete(protect,authorize('publisher','admin'),deleteBranch);

module.exports = router;
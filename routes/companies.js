const express = require('express');

const { getCompanies, 
    getCompany, 
    updateCompany, 
    createCompany, 
    deleteCompany } = require('../controllers/companies');

const Company = require('../models/Company');

const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const userRouter = require('./users');


const router = express.Router();

// Re-Route in to other resource routers
router.use('/:companyId/users',userRouter);


const { protect , authorize} = require('../middleware/auth');

router
.route('/')
.get(advancedResults(Company),getCompanies)
.post(protect ,authorize('publisher','admin'), createCompany);

router
.route('/:id')
.get(getCompany)
.put(protect,authorize('publisher','admin'),updateCompany)
.delete(protect,authorize('publisher','admin'),deleteCompany);

module.exports = router;
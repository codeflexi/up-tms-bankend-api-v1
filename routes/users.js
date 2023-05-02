const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getRecUser,
  addFollow,
  unFollow
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Create a multer instance with the storage engine
const upload = require('../middleware/multer');
const  { validateFile } = require('../middleware/fileValidator');

router.use(protect);
router.use(authorize('user','admin','publisher'));

router
  .route('/user-rec')
  .get(getRecUser);


router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(protect,upload.single('image') ,createUser);

router
  .route('/:id')
  .get(getUser)
  .put(protect,updateUser)
  .delete(protect,deleteUser);

router
  .route('/upload-image/:id')
  .put(protect,upload.single('image'),validateFile,updateUser);

  router
  .route('/:id/follow')
  .put(protect,addFollow);

  router
  .route('/:id/un-follow')
  .put(protect,unFollow);


module.exports = router;



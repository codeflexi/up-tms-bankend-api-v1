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
  unFollow,
  uploadImage,
  uploadUserImageMid
} = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');


const { protect, authorize } = require('../middleware/auth');

// Create a multer instance with the storage engine
const upload = require('../middleware/multer');
const uploadMulterImage = require('../middleware/multerImage');
const uploadSignature = require('../middleware/multerSignature');
const  { validateFile } = require('../middleware/fileValidator');
const { uploadS3PickupPhoto }= require('../middleware/uploadS3PickupPhoto');

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
  .route('/upload-image-s3/:id')
  .put(protect,uploadS3PickupPhoto,uploadUserImageMid);

  router
  .route('/upload/:id')
  .put(protect,uploadMulterImage.single('image'),updateUser);

  router
  .route('/:id/follow')
  .put(protect,addFollow);

  router
  .route('/:id/un-follow')
  .put(protect,unFollow);


module.exports = router;



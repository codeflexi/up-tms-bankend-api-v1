const express = require('express');
const multer = require('multer');

const { getPosts,
  getPost,
  updatePost,
  createPost,
  deletePost,
  getPostByCustomerId,
  addComment,
  deleteComment
} = require('../controllers/posts');

const Post = require('../models/Post');


const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Upload Image
const MIME_TYPE_MAP = {
  'video/mp4': 'mp4'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
          error = null;
      }
      cb(error, "public/videos/");
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split('.');
      const ch = fileName[0];
      const name = ch.split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, Date.now()  + '-' + name + '.' + ext);
      console.log("File" + name + '-' + Date.now() + '.' + ext);
  }
});

// Create a multer instance with the storage engine
const upload = multer({ storage: storage })


router
  .route('/')
  .get(
    advancedResults(Post,
      [{
        path: 'user'
      },
      {
        path: 'customer'
      },
      ]
    ),
    getPosts
  )
  .post(protect, authorize('user','publisher', 'admin'),upload.single('video') , createPost);

router
  .route('/customer/:customerId')
  .get(getPostByCustomerId);

  router
  .route('/:id/comment')
  .put(addComment)
  .delete(deleteComment);

router
  .route('/:id')
  .get(
    getPost)
  .put(protect, authorize('user','publisher', 'admin'), updatePost)
  .delete(protect, authorize('user','publisher', 'admin'), deletePost);

module.exports = router;
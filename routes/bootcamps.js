const express = require('express');
const multer = require('multer');

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

const { protect , authorize  } = require('../middleware/auth');
//const { storage } = require('../middleware/uploadImage');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "public/images/");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split('.');
        const ch = fileName[0];
        const name = ch.split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, Date.now()  + '-' + name + '.' + ext);
        console.log("File" + name + '-' + Date.now() + '.' + ext);
    }
})

// Create a multer instance with the storage engine
const upload = multer({ storage: storage })

router
.route('/')
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(protect , authorize('publisher','admin'), upload.single('image') , createBootcamp);

router
.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp);

module.exports = router;
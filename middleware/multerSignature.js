const multer = require('multer');

// Upload Image
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
  }
  
  const limits = {
    fields: 10,
   // fileSize: 500 * 1024,
   fileSize: 1024 * 1024 * 5, // 5MB
    files: 1,
  };
  
const storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        //const isValid = MIME_TYPE_MAP[file.mimetype];
        const isValid = file.mimetype.startsWith("image")
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        if (req.body.image) {
          cb(error, "public/images/");
        } else if (req.body.signature) 
        {
          cb(error, "public/images-pickup/");
        } 
      
       console.log('save')
      //  cb(null, path.join(__dirname, "public/images/"));
    },
    filename: (req, file, cb) => {
        const changeName = ''

        if (req.body.image) {
          const changeName = `${req.params.id}-image.jpg`
        } else if (req.body.signature) 
        {
          const changeName = `${req.params.id}-signature.jpg`
        }
        
        const fileName = file.originalname.toLowerCase().split('.');
        const ch = fileName[0];
        const name = ch.split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        //cb(null, Date.now()  + '-' + name + '.' + ext);
        cb(null, changeName);
        console.log(changeName);
    }
  });

module.exports  = multer({ storage: storage ,limits})
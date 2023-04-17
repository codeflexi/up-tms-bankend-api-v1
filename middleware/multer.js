const multer = require('multer');

// Upload Image
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
  }
  
  const limits = {
    fields: 10,
    fileSize: 500 * 1024,
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
       cb(error, "public/images/");
       console.log('save')
      //  cb(null, path.join(__dirname, "public/images/"));
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

module.exports  = multer({ storage: storage ,limits})
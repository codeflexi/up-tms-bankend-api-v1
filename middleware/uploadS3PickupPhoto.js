const sharp = require('sharp');
const AWS = require('aws-sdk');
//const {v4: uuidv4} = require('uuid);

const uploadS3PickupPhoto = (req,res,next) => {

    // AWS S3 Configuration
var accessKeyId = process.env.S3_ACCESS_KEY_ID;
var secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
var bucketName = '';

const s3 = new AWS.S3(
    {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
);
    
    // Decode the base64 image to binary data
  const base64Image = req.body.photo;

  const parts = base64Image.split(';');
  const mimType = parts[0].split(':')[1];
  const imageData = parts[1].split(',')[1];

  var imageBuffer = new Buffer.from(imageData, 'base64');

  if ( req.body.status  === 'DELIVERED') {
    bucketName = process.env.S3_BUCKET_IMAGES_DISPATCH;
  } else {
    bucketName = process.env.S3_BUCKET_IMAGES_PICKUP;
  }


  // Generate a unique filename for the image
  const filename = `${req.params.id}-photo.jpg`;

  // Set up S3 upload parameters
  const uploadParams = {
    Bucket: bucketName,
    Key: filename,
    Body: imageBuffer,
    ACL: 'public-read', // Optional - set ACL permissions for the uploaded file
    ContentType: 'image/jpeg', // Optional - set content type based on your image type
  };
    // Upload the image to S3
    s3.upload(uploadParams, (err, data) => {
        if (err) {
          console.error('Error uploading image:', err);
          res.status(500).json({ error: 'Failed to upload image' });
        } else {
          // Provide the S3 URL of the uploaded image as the response
          const imageUrl = data.Location;
         // res.json({ imageUrl });
         //req.phone = 'tttt';
         
        };
      })
next();
}


module.exports = {
    uploadS3PickupPhoto
  }
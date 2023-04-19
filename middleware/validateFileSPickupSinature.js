const sharp = require('sharp');
const validateFileSPickupSinature = (req,res,next) => {
    
  const base64Image = req.body.signature;
  let parts = base64Image.split(';');
  let mimType = parts[0].split(':')[1];
  let imageData = parts[1].split(',')[1];
  var img = new Buffer.from(imageData, 'base64');
  let folder = ''
  if ( req.body.status  === 'DELIVERED') {
    folder = 'public/images-dispatch/'
  } else {
    folder = 'public/images-pickup/'
  }
  sharp(img)
 // .extract({ left: req.body.left, top: req.body.top, width: req.body.width, height: req.body.height })
  //.toBuffer()
  //.resize(req.body.width,req.body.height)
  .jpeg({quality : 50})
  .toFile(
  `${folder}${req.params.id}-signature.jpg`)
  .catch(error => {
    return next(
      new ErrorResponse(`No User with the if of ${req.params.id}`),
      404
  );
  
  })


next();
}

module.exports = {
  validateFileSPickupSinature
}
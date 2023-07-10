const ErrorResponse = require('../utils/errorResponse');
const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log(err);
  console.log(err.name);



  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Log to winton
  let ms = ` ${req.method} ://${req.get('host')}${req.originalUrl} : ${JSON.stringify(req.body)} :${JSON.stringify(req.headers)}` 
 const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    label({ label: ms }),
    prettyPrint()
  ),
// format: format.json(),
//  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.File({ filename: './_logfile/error.log', level: 'error' }),
   // new transports.File({ filename: 'combined.log' }),
  ],
});
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

 
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
 // logger.error(error.message, error);
 logger.log('error', error.message)
}


  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    errorcode: error.statusCode
  });
};

module.exports = errorHandler;

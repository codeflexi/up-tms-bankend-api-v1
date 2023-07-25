const express = require('express');
const dotenv = require('dotenv');
const moment = require('moment-timezone')
const fs = require('fs');
const connectDB = require('./config/db');
//const winston = require('winston');
const logging = require('./config/logging');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const errorHandler = require('./middleware/error');
//const bodyParser = require('body-parser');
//const logger = require('./middleware/logger');
const morgan = require('morgan');
//Route file
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const companies = require('./routes/companies');
const branches = require('./routes/branches');
const warehouses = require('./routes/warehouses');
const products = require('./routes/products');
const vehicles = require('./routes/vehicles');
const routes = require('./routes/route-masters');
const orders = require('./routes/orders');
const shipments = require('./routes/shipments');
const shipmentRoutes = require('./routes/shipment-routes');
const shipmentPicks = require('./routes/shipment-picks');
const shipmentDispatchs = require('./routes/shipment-dispatchs');
const shipmentSorts = require('./routes/shipment-sorts');
const shipmentLogs = require('./routes/shipment-logs');
const posts = require('./routes/posts');

const auth = require('./routes/auth');
const cors = require('cors');
// const Warehouse = require('./models/Warehouse');


//Load ENV vars
dotenv.config({path:'./config/config.env'});

//Connect Database
connectDB();

const app = express();

// app.use(cors());
// app.options('*',cors());

// app.use(cors({
//   origin: '*'
// }));

// let corsOptions = {
//   origin : ['http://localhost:5500'],
// }
// app.use(cors(corsOptions))

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));

//Access-Control-Allow-Origin: *


 //Body paser
//app.use(bodyParser.json());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));

// Cookie parser
app.use(cookieParser());

// Set Static Path
app.use('/public/images',express.static(__dirname + '/public/images'));
app.use('/public/videos',express.static(__dirname + '/public/videos'));
app.use('/public/images-dispatch',express.static(__dirname + '/public/images-dispatch'));
app.use('/public/images-pickup',express.static(__dirname + '/public/images-pickup'));

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));

var accessLogStream = fs.createWriteStream(`${__dirname}/_logfile/access.log`, { flags: 'a' })
// var errorLogStream = fs.createWriteStream(`${__dirname}/_logfile/error.log`, { flags: 'a' })

  // เขียน Log ลงไฟล์ access.log
  morgan.token('type',function(req,res) {
    return req.headers['content-type']
    })

    morgan.token('error',function(req,res) {
        return  res.error
        })
    

//morgan.token('error', (req, res) => `${req.error.message} - ${req.error.stack}`);

morgan.token('date', (req, res, tz) => {
  return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
  })
  // morgan.format('myformat', :date[Asia/Taipei] | :method | :url | :response-time ms');
  // app.use(morgan('myformat'))

const getCustomLogMorganFormat = () => JSON.stringify({
  status: ':status',
  timestamp: ':date[Asia/Bangkok]',
 // timestamp: moment(Date.now()).format("MMM D HH:mm") ,
  method: ':method',
  url: ':url',
  http_version: ':http-version',
  response_time: ':response-time ms',
 
  // content_length: ':res[content-length]',
  // headers_count: 'req-headers-length',
  // type: ':type',
});

// app.use(morgan(getCustomErrorMorganFormat(), {
//     skip: (req, res) => (res.statusCode < 400),
//     stream: errorLogStream,
// }));

// app.use(morgan('combined', {
// 	stream: accessLogStream,
// }));
 
// นำไปใช้โดยกำหนดผ่าน option: stream
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan(getCustomLogMorganFormat(), { stream: accessLogStream }))

}

//app.use(logging)

// Sanitize data
app.use(mongoSanitize());

// Mount router
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use('/api/v1/reviews',reviews);
app.use('/api/v1/users',users);
app.use('/api/v1/companies',companies);
app.use('/api/v1/branches',branches);
app.use('/api/v1/warehouses',warehouses);
app.use('/api/v1/products',products);
app.use('/api/v1/vehicles',vehicles);
app.use('/api/v1/orders',orders);
app.use('/api/v1/shipments',shipments);
app.use('/api/v1/shipment-routes',shipmentRoutes);
app.use('/api/v1/shipment-picks',shipmentPicks);
app.use('/api/v1/shipment-dispatchs',shipmentDispatchs);
app.use('/api/v1/shipment-sorts',shipmentSorts);
app.use('/api/v1/shipment-logs',shipmentLogs);
app.use('/api/v1/route-masters',routes);
app.use('/api/v1/posts',posts);
app.use('/api/v1/auth',auth);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,
    console.log(`Server run in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Handle unhandled promise rejection
process.on('unhandledRjection',(err,promise) => {

console.log(`Error: ${err.message}`);
server.close(()=>process.exit(1));
});
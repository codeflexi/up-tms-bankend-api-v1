const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
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
const orders = require('./routes/orders');
const shipments = require('./routes/shipments');
const auth = require('./routes/auth');
const cors = require('cors');
const Warehouse = require('./models/Warehouse');


//Load ENV vars
dotenv.config({path:'./config/config.env'});

//Connect Database
connectDB();


const app = express();

app.use(cors());
app.options('*',cors());

 //Body paser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV=== 'development'){
    app.use(morgan('dev'));
}

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
app.use('/api/v1/orders',orders);
app.use('/api/v1/shipments',shipments);
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
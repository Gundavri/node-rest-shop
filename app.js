const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://Gundavri:' 
                    + process.env.MONGO_ATLAS_PW 
                        + '@node-rest-shop-2xspm.mongodb.net/test?retryWrites=true&w=majority',
                        {
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useCreateIndex: true
                        });

// Deprecation warning
// mongoose.Promise = global.Promise;


// Middleware for logs
app.use(morgan('dev'));
// Middleware to make 'uploads' folder publicaly available
app.use('/uploads', express.static('uploads'));
// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Middleware to put headers for Access Controls
app.use(cors());

// Routes which handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;
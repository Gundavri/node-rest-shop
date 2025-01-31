const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

module.exports.orders_get_all = (req, res, next) => {
    Order.find().select('product quantity _id').populate('product', 'name price').then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        });
    }).catch(err => {
        res.status(500).json({error: err});
    });
};

module.exports.orders_post = (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        console.log(product);
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        order.save().then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Product not found',
            error: err
        });
    });
}

module.exports.orders_get_single = (req, res, next) => {
    Order.findById(req.params.orderId).populate('product').then(order => {
        if(!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders/'
            }
        });
    }).catch(err => {
        res.status(500).json({error: err});
    });
}

module.exports.orders_delete = (req, res, next) => {
    Order.deleteOne({_id: req.params.orderId}).then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { productId: "ID", quantity: "Number" }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}
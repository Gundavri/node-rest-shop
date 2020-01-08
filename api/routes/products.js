const express = require('express');
const router = express.Router();

// Requests for all products

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    })
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    })
});


// Requests for individual products

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(id === 'special') {
        res.status(200).json({
            message: 'You discovered a special id',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'updated product!'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'deleted product!'
    });
});


module.exports = router;
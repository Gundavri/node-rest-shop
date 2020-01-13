const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrderController = require('../controllers/orders');

// Handle incoming GET requests to /orders
router.get('/', checkAuth, OrderController.orders_get_all);

router.post('/', checkAuth, OrderController.orders_post);

router.get('/:orderId', checkAuth, OrderController.orders_get_single);

router.delete('/:orderId', checkAuth, OrderController.orders_delete);

module.exports = router;
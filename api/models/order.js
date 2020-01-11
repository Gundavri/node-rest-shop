const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // Relates to productSchema
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },
    quantity: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('Order', orderSchema);
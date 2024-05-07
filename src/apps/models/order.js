
const mongoose = require('../../common/database')();
const mongooseDelete = require('mongoose-delete');

const orderSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Products'
            },
            quantity:{
                type:Number,
                required: true
            }
        }
    ],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers'
    },
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    add: {
        type: String,
        required: true
    },
    date_order: {
        type: Date,
        default: Date.now()
    },
    statuc: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });
orderSchema.plugin(mongooseDelete,{
    deletedAt:true,
    overrideMethods:["find"]
})

module.exports = mongoose.model('Orders', orderSchema, "orders")
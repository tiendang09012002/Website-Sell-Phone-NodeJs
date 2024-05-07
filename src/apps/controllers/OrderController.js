const orderModel = require('../models/order')
const pagination = require('../../common/pagination')
const { formatter } = require('../../lib/index')
const moment = require('moment')

const index = async (req, res) => {

    const totalTrash=(await orderModel.findDeleted()).length
    const totalRow = await orderModel.find({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const orders = await orderModel.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'items', populate: { path: "product" } })
    res.render('admin/orders/order', { formatter, orders, pages, currentPage, totalPages, moment,totalTrash })
}

// chi tiết đơn hàng
const edit = async (req, res) => {
    const order = await orderModel.findById(req.params.id).populate({ path: 'items', populate: { path: "product" } })
    res.render('admin/orders/orderDetail', { order,moment,formatter })
}
//cập nhật trạng thái đơn hàng
const update = async (req, res) => {
    await orderModel.update({_id: req.params.id},{statuc:req.query.status})
    res.redirect('/admin/orders')

}

const del = async (req, res) => {
    await orderModel.delete({ _id: req.params.id })
    res.redirect('/admin/orders')
}

const delMany = async (req, res) => {
    await orderModel.delete({
        _id: {
            $in: req.body.orders
        }
    })
    res.redirect('/admin/orders')

}

const trash = async (req, res) => {
    const totalRow = await orderModel.findDeleted({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const orders = await orderModel.findDeleted()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/orders/trash_order', { orders, pages, currentPage, totalPages,moment })
}

const delReal=async (req, res)=>{
    await orderModel.deleteOne({ _id: req.params.id })
    res.redirect("/admin/orders/trash")
}
const restore = async (req, res) => {
    await orderModel.update({ _id: req.params.id },{deleted: false})
    res.redirect("/admin/orders/trash")
}
const actionMany=async (req, res) => {
    const {action, orders} =req.body
    if(action==="delete"){
        await orderModel.deleteMany({_id:{$in:orders}})
    }
    if(action==="restore"){
        await orderModel.update({_id:{$in:orders}},{deleted: false})
    }
    res.redirect("/admin/orders/trash")

}
module.exports = {
    index,
    del,
    delMany,
    edit,update,actionMany,restore,trash,delReal
}
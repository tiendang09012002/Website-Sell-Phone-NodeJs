const CustomerModel = require('../models/customer')
const pagination = require('../../common/pagination')
const bcrypt = require('bcrypt');
const moment=require('moment')
const index = async (req, res) => {

    const totalTrash=(await CustomerModel.findDeleted()).length
    const totalRow = await CustomerModel.find({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const customers = await CustomerModel.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/customers/customer', { customers,pages,currentPage,totalPages,totalTrash })
}

const del = async (req, res) => {
    await CustomerModel.delete({ _id: req.params.id })
    res.redirect('/admin/customers')
}

const delMany=async(req, res) => {
    await CustomerModel.delete({
        _id: {
            $in: req.body.customers
        }
    })
    res.redirect('/admin/customers')

}
const trash = async (req, res) => {
    const totalRow = await CustomerModel.findDeleted({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const customers = await CustomerModel.findDeleted()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/customers/trash_customer', { customers, pages, currentPage, totalPages,moment })
}

const delReal=async (req, res)=>{
    await CustomerModel.deleteOne({ _id: req.params.id })
    res.redirect("/admin/customers/trash")
}
const restore = async (req, res) => {
    await CustomerModel.update({ _id: req.params.id },{deleted: false})
    res.redirect("/admin/customers/trash")
}
const actionMany=async (req, res) => {
    const {action, customers} =req.body
    if(action==="delete"){
        await CustomerModel.deleteMany({_id:{$in:customers}})
    }
    if(action==="restore"){
        await CustomerModel.update({_id:{$in:customers}},{deleted: false})
    }
    res.redirect("/admin/customers/trash")

}
module.exports = {
     del, index,
    delMany,delReal,actionMany,restore,trash
}
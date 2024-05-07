const commentModel = require('../models/comment')
const keywordModel = require('../models/keyword')

const pagination = require('../../common/pagination')
const moment = require('moment')

const index = async (req, res) => {

    const totalTrash=(await commentModel.findDeleted()).length
    const totalRow = await commentModel.find({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const comments = await commentModel.find().populate("prd_id")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/comments/comment', { comments, pages, currentPage, totalPages, moment,totalTrash })
}


const del = async (req, res) => {
    await commentModel.delete({ _id: req.params.id })
    res.redirect('/admin/comments')
}
const delMany = async (req, res) => {
    await commentModel.delete({ _id: {$in:req.body.comments} })
    res.redirect('/admin/comments')
}

const trash = async (req, res) => {
    const totalRow = await commentModel.findDeleted({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const comments = await commentModel.findDeleted()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/comments/trash_comment', { comments, pages, currentPage, totalPages,moment })
}

const delReal=async (req, res)=>{
    await commentModel.deleteOne({ _id: req.params.id })
    res.redirect("/admin/comments/trash")
}
const restore = async (req, res) => {
    await commentModel.update({ _id: req.params.id },{deleted: false})
    res.redirect("/admin/comments/trash")
}
const actionMany=async (req, res) => {
    const {action, comments} =req.body
    if(action==="delete"){
        await commentModel.deleteMany({_id:{$in:comments}})
    }
    if(action==="restore"){
        await commentModel.update({_id:{$in:comments}},{deleted: false})
    }
    res.redirect("/admin/comments/trash")

}
const active=async(req,res) => {
    await commentModel.updateOne({_id:req.params.id},{active:true})
    res.redirect("/admin/comments")
}

const addKeyword=async (req, res) =>{
    const {keywords} = req.body
    const arrKeywords =keywords.split(',').map(item => item.trim())
    await Promise.all(arrKeywords.map(async (item) =>{
        await new keywordModel({keyword: item}).save()
    }))
    res.redirect("/admin/comments")
}

module.exports = {
    // store, update,
    // create, edit, del,
    index, del, delMany,actionMany,restore,trash,delReal,addKeyword,active
}

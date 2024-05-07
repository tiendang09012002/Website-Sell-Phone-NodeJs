const categoryModel = require('../models/category')
const productModel = require('../models/product')
const moment=require('moment')
const pagination = require('../../common/pagination')
const slug = require('slug')

const index = async (req, res) => {
    const totalTrash=(await categoryModel.findDeleted()).length
    const totalRow = await categoryModel.find({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const categories = await categoryModel.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/categories/category', { categories, pages, currentPage, totalPages,totalTrash })
}

const create = (req, res) => {
    res.render('admin/categories/add_category', { category: {} })

}
const store = async (req, res) => {
    const category = await categoryModel.findOne({ title: req.body.title })
    if (category) {
        res.render('admin/categories/add_category', {
            category: {
                title: req.body.title,
                message: "Danh mục đã tồn tại !"
            }
        })
    } else {
        await new categoryModel({ title: req.body.title, slug: slug(req.body.title) }).save()
        res.redirect("/admin/categories")
    }

}
const edit = async (req, res) => {
    const category = await categoryModel.findById(req.params.id)
    res.render('admin/categories/edit_category', { category })

}
const update = async (req, res) => {
    const categoryID = await categoryModel.findById(req.params.id)
    const category = await categoryModel.findOne({ title: req.body.title })
    if (category) {
        res.render('admin/categories/edit_category', {
            category: {
                _id: req.params.id,
                title: categoryID.title,
                titleNew: req.body.title,
                message: "Danh mục đã tồn tại !"
            }
        })
    } else {
        await categoryModel.updateOne({ _id: req.params.id }, { title: req.body.title, slug: slug(req.body.title) })
        res.redirect("/admin/categories")
    }

}

const del = async (req, res) => {
    const categoryDelete = await categoryModel.findOne({ _id: req.params.id })
    if (categoryDelete.title === "Category Root")
        return res.redirect("/admin/categories")
    let categoryRoot = await categoryModel.findOne({ title: "Category Root" })
    const category = new categoryModel({ title: "Category Root", slug: slug("Category Root") })
    if (!categoryRoot) categoryRoot = await category.save()

    // await productModel.updateMany
    await categoryModel.delete({ _id: req.params.id })
    await productModel.updateMany({ cat_id: req.params.id }, { cat_id: categoryRoot._id })
    res.redirect("/admin/categories")
}

const delReal=async (req, res)=>{
    await categoryModel.deleteOne({ _id: req.params.id })
    res.redirect("/admin/categories/trash")
}

const delMany = async (req, res) => {
    let categoryRoot = await categoryModel.findOne({ title: "Category Root" })
    const category = new categoryModel({ title: "Category Root", slug: slug("Category Root") })
    if (!categoryRoot){
        categoryRoot = await category.save()
    }
    const filter=req.body.categories.filter((item)=>item!==categoryRoot.id)
    await categoryModel.delete({
        _id: {
            $in: filter
        }
    })
    await productModel.updateMany({
        cat_id: {
            $in: filter
        }
    }, { cat_id: categoryRoot._id })

    res.redirect("/admin/categories")

}

const trash = async (req, res) => {
    const totalRow = await categoryModel.findDeleted({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const categories = await categoryModel.findDeleted()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/categories/trash_category', { categories, pages, currentPage, totalPages,moment })
}

const restore = async (req, res) => {
    await categoryModel.update({ _id: req.params.id },{deleted: false})
    res.redirect("/admin/categories/trash")
}
const actionMany=async (req, res) => {
    const {action, categories} =req.body
    if(action==="delete"){
        await categoryModel.deleteMany({_id:{$in:categories}})
    }
    if(action==="restore"){
        await categoryModel.update({_id:{$in:categories}},{deleted: false})
    }
    res.redirect("/admin/categories/trash")

}


module.exports = {
    create, edit, del, index,
    store, update, delMany,trash,restore,delReal,actionMany
}
const productModel = require('../models/product')
const pagination = require('../../common/pagination')
const categoryModel = require('../models/category')
const slug = require('slug')
const fs = require('fs')
const path = require('path')
const commentModel = require('../models/comment')
const { formatter } = require('../../lib/index')
const moment =require('moment')
const index = async (req, res) => {
    const query = {};
    if (req.query.filter !== undefined) {
        query.cat_id = req.query.filter;
    }
    if (req.query.is_stock !== undefined) {
        query.is_stock = req.query.is_stock;
    }
    const totalTrash = (await productModel.findDeleted()).length
    const totalRow = await productModel.find(query).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const categories= await categoryModel.find({})
    
    const products = await productModel.find(query)

        .populate({ path: "cat_id" })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/products/product', { products, pages, currentPage, totalPages, totalTrash, formatter, categories ,filter: query.cat_id})
}

const create = async (req, res) => {
    const categories = await categoryModel.find().sort({ _id: -1 })
    res.render('admin/products/add_product', { categories })

}
const store = async (req, res) => {
    const { body, file } = req
    const thumbnail = `products/${file.originalname}`
    const product = new productModel({
        ...body,
        slug: slug(body.name),
        featured: body.featured == "on",
        thumbnail
    })


    fs.renameSync(file.path, path.resolve("src/public/uploads/images", thumbnail))
    await product.save()
    res.redirect('/admin/products')

}
const edit = async (req, res) => {
    const product = await productModel.findById(req.params.id)
    const categories = await categoryModel.find().sort({ _id: -1 })
    res.render('admin/products/edit_product', { product, categories })
}
const update = async (req, res) => {
    const { body, file } = req
    const product = {
        description: body.description,
        price: body.price,
        cat_id: body.cat_id,
        status: body.status,
        featured: body.featured === "on",
        promotion: body.promotion,
        warranty: body.warranty,
        accessories: body.accessories,
        is_stock: body.is_stock,
        name: body.name,
        slug: slug(body.name),
    }
    if (file) {
        thumbnail = "products/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/uploads/images", thumbnail))
        product["thumbnail"] = thumbnail;
    }

    await productModel.updateOne({ _id: req.params.id }, product)
    res.redirect('/admin/products')
}

const del = async (req, res) => {
    await productModel.delete({ _id: req.params.id })
    res.redirect('/admin/products')
}
const delMany = async (req, res) => {
    await productModel.delete({ _id: { $in: req.body.products } })
    res.redirect('/admin/products')
}
const trash = async (req, res) => {
    const totalRow = await productModel.findDeleted({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const products = await productModel.findDeleted()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/products/trash_product', { products, pages, currentPage, totalPages, moment, formatter })
}

const delReal = async (req, res) => {
    const product = await productModel.findById(req.params.id)
    const pathImage = path.resolve("src/public/uploads/images", product.thumbnail)
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
    await productModel.deleteOne({ _id: req.params.id })
    await commentModel.deleteMany({ prd_id: req.params.id })
    res.redirect("/admin/products/trash")
}
const restore = async (req, res) => {
    await productModel.update({ _id: req.params.id }, { deleted: false })
    res.redirect("/admin/products/trash")
}
const actionMany = async (req, res) => {
    const { action, products } = req.body
    if (action === "delete") {
        const product = await productModel.findDeleted({ _id: { $in:products } })
        product.forEach((item) => {
            const pathImage = path.resolve("src/public/uploads/images", item.thumbnail)
            if (fs.existsSync(pathImage)) {
                fs.unlinkSync(pathImage)
            }
        })    
        await productModel.deleteMany({ _id: { $in: products } })
        await commentModel.deleteMany({ prd_id: { $in: products } })
    }
    if (action === "restore") {
        await productModel.update({ _id: { $in: products } }, { deleted: false })
    }
    res.redirect("/admin/products/trash")

}

module.exports = {
    create, edit, del, index,
    store, update, delMany, actionMany, restore, trash, delReal
}
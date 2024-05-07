const userModel = require('../models/user')
const pagination = require('../../common/pagination')
const bcrypt = require('bcrypt');
const moment=require('moment')
const index = async (req, res) => {

    const totalTrash=(await userModel.findDeleted()).length
    const totalRow = await userModel.find({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const users = await userModel.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/users/user', { users,pages,currentPage,totalPages,totalTrash })
}

const create = (req, res) => {
    res.render('admin/users/add_user', { user: {} })
}
const store = async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (user) {
        res.render('admin/users/add_user', {
            user: {
                ...req.body,
                message: "Email này đã tồn tại !"
            }
        })
    } else {
        const hashPassword=await bcrypt.hash(req.body.password, 10)
        await new userModel({...req.body,
            password:hashPassword}).save()
        res.redirect('/admin/users')
    }
}
const edit = async (req, res) => {
    const user = await userModel.findById(req.params.id)
    res.render('admin/users/edit_user', { user })
}
const update = async (req, res) => {
    const userID = await userModel.findById(req.params.id)
    const user = await userModel.findOne({ email: req.body.email })

    const newUser = {
        full_namenew: req.body.full_name,
        emailnew: req.body.email,
        passwordnew: req.body.password,
        re_password: req.body.re_password,
        rolenew: req.body.role
    }
    const regemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regemail.test(req.body.email)) {
        res.render('admin/users/edit_user', {
            user: {
                ...newUser,
                full_name: userID.full_name,
                message: "Email không hợp lệ !"
            }
        })
    } else
        if (req.body.password != req.body.re_password) {
            res.render('admin/users/edit_user', {
                user: {
                    ...newUser,
                    full_name: userID.full_name,
                    message: "Mật khẩu không khớp !"
                }
            })
        }
        else if (user && userID.email != req.body.email) {
            res.render('admin/users/edit_user', {
                user: {
                    ...newUser,
                    full_name: userID.full_name,
                    message: "Email đã tồn tại !"
                }
            })
        } else {
            await userModel.updateOne({ _id: req.params.id }, req.body)
            res.redirect('/admin/users')
        }

}

const del = async (req, res) => {
    await userModel.delete({ _id: req.params.id })
    res.redirect('/admin/users')
}

const delMany=async(req, res) => {
    await userModel.delete({
        _id: {
            $in: req.body.users
        }
    })
    res.redirect('/admin/users')

}
const trash = async (req, res) => {
    const totalRow = await userModel.findDeleted({}).countDocuments()
    const limit = parseInt(req.query.limit) || 10
    const currentPage = parseInt(req.query.page) || 1
    const skip = (currentPage - 1) * limit
    const pages = pagination(currentPage, limit, totalRow);
    const totalPages = Math.ceil(totalRow / limit)
    const users = await userModel.findDeleted()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
    res.render('admin/users/trash_user', { users, pages, currentPage, totalPages,moment })
}

const delReal=async (req, res)=>{
    await userModel.deleteOne({ _id: req.params.id })
    res.redirect("/admin/users/trash")
}
const restore = async (req, res) => {
    await userModel.update({ _id: req.params.id },{deleted: false})
    res.redirect("/admin/users/trash")
}
const actionMany=async (req, res) => {
    const {action, users} =req.body
    if(action==="delete"){
        await userModel.deleteMany({_id:{$in:users}})
    }
    if(action==="restore"){
        await userModel.update({_id:{$in:users}},{deleted: false})
    }
    res.redirect("/admin/users/trash")

}
module.exports = {
    create, edit, del, index,
    store, update,delMany,delReal,actionMany,restore,trash
}
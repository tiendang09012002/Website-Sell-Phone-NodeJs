const productModel = require('../models/product')
const commentModel = require('../models/comment')
const userModel = require('../models/user')


const index =async (req, res) => {
    const sumProduct=await productModel.find({}).countDocuments()
    const sumComment=await commentModel.find({}).countDocuments()
    const sumUser=await userModel.find({}).countDocuments()

    res.render('admin/dashboard',{data:{sumComment,sumUser,sumProduct}})
}


module.exports={
    index
}

const categoryModel = require('../models/category')
const slug = require('slug')
const fs = require('fs')
const path = require('path')
const commentModel = require('../models/comment')
const bannerModel=require('../models/banner.js')
const slideModel=require('../models/slide.js')

const banner=async(req,res)=>{
    const banners = await bannerModel.find({}).sort({ _id:1 });
        
     res.render('admin/banner',{banners});
    
};
const create=(req, res)=>{
    res.render('admin/add_banner');
}
const store = async (req, res) => {
    const { body, file } = req;
    const banner={
        name:body.name,
        position:body.position,
        
    };
if(file){
    const thumbnail=`banner/${file.originalname}`;
    banner["thumbnail"]=thumbnail;
    fs.renameSync(file.path, path.resolve("src/public/uploads/images", thumbnail));

    new bannerModel(banner).save();
    res.redirect('/admin/banners');
}
}
const edit = async (req, res) => {
    const banner = await bannerModel.findById(req.params.id)
    res.render('admin/edit_banner', { banner })
}
const update = async (req, res) => {
    const { body, file } = req
    const banner = {
        position: body.position,
        name: body.name,
    }
    if (file) {
        thumbnail = "banner/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/uploads/images", thumbnail))
        banner["thumbnail"] = thumbnail;
    }

    await bannerModel.updateOne({ _id: req.params.id }, banner)
    res.redirect('/admin/banners')
}
const del = async (req, res) => {
    const banner = await bannerModel.findById(req.params.id)
    const pathImage = path.resolve("src/public/uploads/images", banner.thumbnail)
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }

    await bannerModel.deleteOne({ _id: req.params.id })
    res.redirect('/admin/banners')
}

module.exports={
    banner,
    create,
    store,
    del,
    edit,
    update,
}
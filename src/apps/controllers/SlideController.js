
const slideModel =require('../models/slide')
const slug = require('slug')
const fs = require('fs')
const path = require('path')


const slide=async(req,res)=>{
    const slides = await slideModel.find({}).sort({ _id:1 });
        
     res.render('admin/slide',{slides});
    
};
const create=(req, res)=>{
    res.render('admin/add_slide');
}
const store = async (req, res) => {
    const { body, file } = req;
    const slide={
        name:body.name,
        position:body.position,
    };
if(file){
    const thumbnail=`slide/${file.originalname}`;
    slide["thumbnail"]=thumbnail;
    fs.renameSync(file.path, path.resolve("src/public/uploads/images", thumbnail));

    await new slideModel(slide).save();
    res.redirect('/admin/slides');
}
}
const edit = async (req, res) => {
    const slide = await slideModel.findById(req.params.id)
    res.render('admin/edit_slide', { slide })
}
const update = async (req, res) => {
    const { body, file } = req
    const slide = {
        position: body.position,
      
        name: body.name,
    }
    if (file) {
        const thumbnail = "slide/" + file.originalname;
        fs.renameSync(file.path, path.resolve("src/public/uploads/images", thumbnail))
        slide["thumbnail"] = thumbnail;
    }

    await slideModel.updateOne({ _id: req.params.id }, slide)
    res.redirect('/admin/slides')
}
const del = async (req, res) => {
    const slide = await slideModel.findById(req.params.id)
   const pathImage = path.resolve("src/public/uploads/images", slide.thumbnail)
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }

    await slideModel.deleteOne({ _id: req.params.id })
    
    res.redirect('/admin/slides')
}

module.exports={
    slide,
    create,
    store,
    del,
    edit,
    update,
}
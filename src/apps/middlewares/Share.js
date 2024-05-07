const categoryModel = require('../models/category')
const settingModel=require('../models/setting')
const bannerModel=require('../models/banner.js')
const slideModel=require('../models/slide.js')
const HTMLReactParser=require('html-react-parser')
const share=async (req, res, next) => {
    const categories = await categoryModel.find({})
    res.locals.categories=categories
    res.locals.totalCartItems=req.session.cart.reduce((total,item)=>total+parseInt(item.qty),0)
    res.locals.classActive=req.path.split('/')
    res.locals.user=req.session.user
    res.locals.setting=await settingModel.findOne()
    res.locals.parser=HTMLReactParser

     const banners = await bannerModel.find({})
    .sort({ position: -1 }).limit(3);
    const slides = await slideModel.find({})
    .sort({ position: -1 });
    res.locals.slides=slides
    res.locals.banners=banners

    next()
}

module.exports = share

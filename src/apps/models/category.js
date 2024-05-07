const mongoose=require('../../common/database')();
const mongooseDelete = require('mongoose-delete');


const categorySchema=new mongoose.Schema({
    description:{
        type:String,
        default:"",
    },
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
},{
    timestamps:true,
})

categorySchema.plugin(mongooseDelete,{
    deletedAt:true,
    overrideMethods:["find"]
})

const categoryModel=mongoose.model("Categories",categorySchema,"categories")

module.exports=categoryModel;
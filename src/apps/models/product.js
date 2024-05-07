const mongoose=require('../../common/database')();
const mongooseDelete = require('mongoose-delete');

const productSchema=new mongoose.Schema({
    thumbnail:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Categories"
    },
    status:{
        type:String,
        default:""
    },
    featured:{
        type:Boolean,
        default:false
    },
    promotion:{
        type:String,
        required:true
    },
    warranty:{
        type:String,
        required:true
    },
    accessories:{
        type:String,
        required:true
    },
    is_stock:{
        type:Boolean,
        default:true
    },
    name:{
        type:String,
        text:true,
        required:true
    },
    slug:{
        type:String,
        
    },
},{
    timestamps:true,
})
productSchema.plugin(mongooseDelete,{
    deletedAt:true,
    overrideMethods:["find"]
})

module.exports=mongoose.model("Products",productSchema,"products")
const mongoose = require('../../common/database')();
const mongooseDelete = require('mongoose-delete');

const commentSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    full_name:{
        type:String,
        required:true
    },
    prd_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Products"
    },
    active:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
commentSchema.plugin(mongooseDelete,{
    deletedAt:true,
    overrideMethods:["find"]
})
module.exports=mongoose.model('Comments',commentSchema,"comments")
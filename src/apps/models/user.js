const mongoose=require('../../common/database')();
const mongooseDelete = require('mongoose-delete');

const userSchema=new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'member'
    },
    full_name: {
        type: String,
        required: true
    },
})
userSchema.plugin(mongooseDelete,{
    deletedAt:true,
    overrideMethods:["find"]
})

module.exports=mongoose.model('Users',userSchema,"users")
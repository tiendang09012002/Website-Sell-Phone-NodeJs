const mongoose = require('../../common/database')();

const settingSchema= new mongoose.Schema({
    logo:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    add:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true,
    },
    hotline:{
        type:String,
        required:true,
    },

    footer:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Settings',settingSchema,"settings")
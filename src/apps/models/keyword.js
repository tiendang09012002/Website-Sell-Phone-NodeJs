const mongoose = require('../../common/database')();

const keywordSchema= new mongoose.Schema({
    keyword:{
        type:String,
        required:true
    },
},{
    timestamps:true
})

module.exports=mongoose.model('Keywords',keywordSchema,"keywords")
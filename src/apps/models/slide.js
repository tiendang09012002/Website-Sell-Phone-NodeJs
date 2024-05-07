const mongoose=require('../../common/database')();

const slideSchema=new mongoose.Schema({
    thumbnail:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    name:{
        type:String,
        text:true,
        required:true
    },
   
},{
    timestamps:true,
})

module.exports=mongoose.model("Slides",slideSchema,"slides")
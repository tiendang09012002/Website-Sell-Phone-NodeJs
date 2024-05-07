const mongoose = require("../../common/database")();
const mongooseDelete = require('mongoose-delete');

const customerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      
    },
    full_name: {
      type: String,
      required: true,
    },
    provider:{
      type:String,
      default: "local",
    }
  },
  {
    timestamps: true,
  }
);
customerSchema.plugin(mongooseDelete,{
  deletedAt:true,
  overrideMethods:["find"]
})
const CustomerModel = mongoose.model("Customers", customerSchema, "customers");
module.exports = CustomerModel;

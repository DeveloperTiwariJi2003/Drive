const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{require:true,
        type:String
    },
    email:{required:true,type:String, unique:true },
    password:{required:true,type:String}
})
module.exports=mongoose.model("user",userSchema)
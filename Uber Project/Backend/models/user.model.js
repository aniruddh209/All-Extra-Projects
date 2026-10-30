const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


const userSchema=new mongoose.Schema({
    fullname:{
     firstname:{
        type:String,
        required:true,
        minlength:[3,'First Name Must be at least 3 Character'],
     },
     lastname:{
        type:String,
        minlength:[3,'First Name Must be at least 3 Character'],
     }
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
        minlength:[5,'Password Must be at least 8 Character long'],
        
    },
    socketId:{
        type:String,
    },
})

userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET)
    return token;
}
userSchema.method.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}

const userModel=mongoose.model('user',userSchema);
module.exports=userModel;
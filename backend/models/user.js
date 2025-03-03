import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname : {
        type : String, 
        required : true
    },
    lastname : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String, //hashed password is stored not actual password
        required : true
    },

    //otp fields
    otpToken : {
        type : String, //hashed otp
    },
    otpExpires : {
        type : Date //otp expire time
    }

},{timestamps : true}) //timestamps automatically add createdAt and updatedAt fields

const User = mongoose.model("User", UserSchema);

export default User
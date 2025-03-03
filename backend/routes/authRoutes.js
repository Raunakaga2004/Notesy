import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//utilities
import User from "../models/user.js"
import {signInSchema, signUpSchema } from "../models/zodSchema.js"
import {verifyToken} from "../middlewares/verifyToken.js"
import { sendEmail } from "../utils/emailService.js"

const router = express.Router();

//SignUp
router.post("/signup", async (req,res)=>{
    try{
        const {firstname, lastname , email, password} = req.body;
        const hashedpass = await bcrypt.hash(password, 10); //securely hashes the password with a salt of 10 rounds

        const userEmail = email.toLowerCase(); // convert email into lowercase

        const validate = signUpSchema.safeParse({firstname, lastname , email, password})
        if(!validate.success){
            return res.status(400).json("Password must be of 8 characters and First name should contain atleast 3 characters!")
        }

        const newUser = new User({
            firstname : firstname,
            lastname : lastname,
            email : userEmail,
            password : hashedpass
        })

        await newUser.save();

        res.status(200).json({
            message : "User Registered Successfully!"
        })
    } catch (e){
        res.status(500).json({
            error : "User already exists!"
        })
    }
})

//SignIn
router.post("/signin", async (req,res)=>{
    try{
        const {email, password} = req.body;
        
        const userEmail = email.toLowerCase();

        const validate = signInSchema.safeParse({email, password})
        if(!validate.success){
            return res.status(400).json("Invalid Credentials")
        }

        const user = await User.findOne({email : userEmail}) //find the one user with this email in database

        if(!user) return res.status(400).json({
            error : "User Not Found!"
        })

        const isMatch = await bcrypt.compare(password, user.password);// bcrypt then compares the original password and stored hashed password

        if(!isMatch) return res.status(400).json({
            error : "Invalid Credentials!"
        })

        const token = jwt.sign({ // user _id is converted into json web token
            userId : user._id
        }, process.env.JWT_SECRET, {
            expiresIn : "1d"
        })

        res.status(200).cookie("token", token, { //json web token is stored in cookie named 'token'
            httpOnly : true,
            secure : true,
            sameSite : true
        }).json({
            message : "Login Successfull!"
        }) // this cookie will be sent to client
        // "token" is the name of cookie
        // token is the value of cookie

        //cookie options
        //httpOnly: true, // cookie can only be accessed by server
        //secure: true, // cookie can only be accessed over HTTPS
        //sameSite: "strict", // meaning the cookie will only be sent if the request is coming from the same origin as the domain
    } catch (e){
        res.status(500).json({
            error : e.message
        })
    }
})

//profile with id
router.get("/profile", verifyToken , async (req, res) => {
    try{
        const userId = req.user.userId;
        if(!userId) res.status(401).json({
            message : "No token provided. Sign In first!"
        })
        const user = await User.findById(userId).select("-password"); //exclude password
        res.json(user);

    } catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})

//signout
router.post("/signout", (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" }); //remove the cookie named 'token'
});

const generateotp = ()=> Math.floor(Math.random()*1000000).toString() 

//forgot-password
router.post("/forgotpassword", async (req,res)=>{
    try{
        const {email} =  req.body;
        const userEmail = email.toLowerCase();

        const user = await User.findOne({email : userEmail});
        if(!user) return res.status(404).json({message : "User not found"})

        const otp = generateotp();

        user.otpToken = otp;
        user.otpExpires = Date.now() + 10*60*1000; //expires in 10 minutes

        await user.save();

        await sendEmail(user.email, "Password reset OTP!", `Your OTP is : ${otp}`);

        res.status(200).json({
            message : "otp sent!"
        })

    }catch(e){
        res.status(500).json({
            error : e.message
        })
    }
})

//verify-otp
router.post("/verifyotp", async (req, res) => {
    try{
        const {otp, email} = req.body;
        const userEmail = email.toLowerCase();

        const user = await User.findOne({email : userEmail});
        if(!user) return res.status(404).json({
            message : "User not found"
        })

        if(Date.now() > user.otpExpires){
            return res.status(400).json({
                message : "OTP expired"
            })
        }

        if(user.otpToken === otp.toString()){
            return res.status(200).json({
                message: "user verified!"
            })
        }

        res.status(400).json({
            message: "Invalid OTP"
        })

    } catch(e) {
        res.status(500).json({
            error : e.message
        })
    }
})

//reset password
router.post("/resetpassword", async (req, res) => {
    try{
        const {email, password} = req.body;
        const userEmail = email.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({email : userEmail});
        if(!user) return res.status(404).json({
            message : "User not found"
        })
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message : "Password reset successfully"
        })
    } catch(e) {
        res.status(500).json({
            error : e.message
        })
    }
})

export default router;
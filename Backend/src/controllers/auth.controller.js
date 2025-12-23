import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup=async(req,res)=>{
    try {
        const {fullName,email,password}=req.body;
        if(!password||!fullName||!email){
            return res.status(400).json({message:"All fields are required and none empty"})
        }
        if(!password||password<6){
            return res.status(400).json({message:"Invalid password"})
        }
        if(!fullName||fullName.trim()===""){
            return res.status(400).json({message:"Invalid name"})
        }
        if(!email||email.trim()===""){
            return res.status(400).json({message:"Invalid email"})
        }


        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        const salt=bcrypt.genSaltSync(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create({fullName,email,password:hashedPassword})

        if(newUser){
            //generate token
            generateToken(newUser._id,res)
            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,  
            })
        }
        else{
            return res.status(500).json({message:"Failed to create user"})
        }

        
        
    } catch (error) {
        console.log("Error in signup controller",error.message)
        return res.status(500).json({message:"Failed to signup due to internal server Error"})
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"All fields are required and none empty"})
        }

        if([email,password].some((field)=>field.trim()==="")){
            return res.status(400).json({message:"Invalid input"})
        }

        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({message:"User not found"})
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid)
        {
            return res.status(400).json({message:"Invalid password"})
        }

        generateToken(user._id,res)
        return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,  
        })

    } catch (error) {
        console.log("Error in login controller",error.message)
        return res.status(500).json({message:"Failed to login due to internal server Error"})
    }
}

export const logout=(req,res)=>{
    try {
        res.cookie("token","",{maxAge:0})
        return res.status(200).json({message:"Logout successfully"})
    } catch (error) {
        console.log("Error in logout",error.message)
        return res.status(500).json({message:"Failed to logout due to internal server Error"})
    }
}


export const updateProfile=async(req,res)=>{
    try {
        
        const {profilePic}=req.body;
        if(!profilePic)
        {
            return res.status(400).json({message:"No file uploaded"})
        }

        if(profilePic?.size>10*1024*1024)
        {
            return res.status(400).json({message:"File size should be less than 10MB"})
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic)
        const profilePicUrl=uploadResponse.secure_url;

        const updatedUser=await User.findByIdAndUpdate(req.userId,{profilePic:profilePicUrl},{new:true})
        if(updatedUser)
        {
            return res.status(200).json({
                _id:updatedUser._id,
                fullName:updatedUser.fullName,
                email:updatedUser.email,
                profilePic:updatedUser.profilePic,  
            })
        }
        else
        {
            return res.status(500).json({message:"Failed to update profile"})
        }
        
    } catch (error) {
        console.log("Error in updateProfile controller",error.message)
        return res.status(500).json({message:"Failed to update profile due to internal server Error"})
    }
}


export const checkAuth=async(req,res)=>{
    try {
        if(!req.user)
        {
            console.log("User not found")
            
        }
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller",error.message)
        return res.status(500).json({message:"Failed to check auth due to internal server Error"})
    }
}

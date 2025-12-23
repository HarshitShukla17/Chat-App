import jwt from "jsonwebtoken"
import User from "../models/user.model.js"



export const protectRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        
        if(!token){
            return res.status(401).json({message:"Unauthorized Access"})
        }

        const decodedData= jwt.verify(token,process.env.JWT_SECRET)
        req.userId=decodedData.userId;

        
        const user=await User.findById({_id:decodedData.userId}).select("-password")
        
        
        if(!user)
        {
           
            return res.status(401).json({message:"Unauthorized Access"})
        }
        req.user=user;
        next()
    } catch (error) {
        console.log("Error in protectRoute middleware",error.message)
        return res.status(500).json({message:"Failed to protect route due to internal server Error"})
    }
}



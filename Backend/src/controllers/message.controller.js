import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import {getReceiverSocketId} from "../lib/socket.js"
import {io} from "../lib/socket.js"
import cloudinary from "cloudinary"

export const getUsersForSidebar=async(req,res)=>{
    try {
        const loggedInUserId=req.userId;

        const filteredUsers=await User.find({
            _id:{$ne:loggedInUserId}
        }).select("-password")

        return res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar controller",error.message)
        return res.status(500).json({message:"Failed to get users for sidebar due to internal server Error"})
    }
}


export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.userId;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })

        return res.status(200).json(messages)

    } catch (error) {
        console.log("Error in getMessages controller",error.message)
        return res.status(500).json({message:"Failed to get messages due to internal server Error"})
    }
}


export const sendMessage=async(req,res)=>{
    try {
        const {id:receiverId}=req.params;
        const senderId=req.userId;
        const {text,image}=req.body;

        let imageUrl;
        if(image)
        {
            const uploadResponse=await cloudinary.uploader.upload(image)
            if(!uploadResponse) console.log("failed to upload the image on the cloudinary")
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=await Message.create({senderId,receiverId,text,image:imageUrl||null}) //used null explicitely...
        //todo: real time functionality goes here=>socket.io

        const receiverSocketId=getReceiverSocketId(receiverId)
        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller",error.message)
        return res.status(500).json({message:"Failed to send message due to internal server Error"})
    }
}
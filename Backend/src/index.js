import express from "express"
import authRoutes from "./routes/auth.route.js"

import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv"
dotenv.config() //to load environment variables from .env file
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"

import cors from "cors"
import {io,server,app} from "./lib/socket.js"


app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
))

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)



server.listen(process.env.PORT,()=>{console.log(`Server running on port ${process.env.PORT}`)
    connectDB()
})
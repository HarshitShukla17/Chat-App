import {create} from "zustand";
import axiosInstance from "../lib/axios";
import {toast} from "react-hot-toast";
import {io} from "socket.io-client";

const baseURL="http://localhost:5001"

export  const useAuthStore = create((set,get) => ({
    authUser:null,

    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,


    checkAuth:async()=>{
        try {
            const responce=await axiosInstance.get("/auth/check");
            
            set({authUser:responce.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error checking auth",error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true})
        try {
            const responce=await axiosInstance.post("/auth/signup",data)
            set({authUser:responce.data})
            
            toast.success("Signup successful")
            get().connectSocket()
            
        } catch (error) {
            toast.error(
                error.response.data.message,
                {
                    duration:3000,
                    
                }
            )
            console.log("Error signing up",error)
        }finally{
            set({isSigningUp:false})
        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            
            toast.success("Logout successful")
            get().disconnectSocket()
        } catch (error) {
            toast.error("Logout failed")
            console.log("Error logging out",error)
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update/profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket:async()=>{
        const authUser=get().authUser
        if(!authUser||get().socket?.connected)return;
        const socket=io(baseURL,{
            query:{
                userId:authUser._id,
            }
        });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
            console.log("online users",userIds)
        })
       
      },
      disconnectSocket:async()=>{
        if(get().socket?.connected)get().socket.disconnect();

        
        
      }

    
}))
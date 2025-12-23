import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import {useEffect} from "react"
import {Loader} from "lucide-react"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"

import {useAuthStore} from "./store/useAuthStore"
import {Navigate} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import {useThemeStore} from "./store/useThemeStore"


const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme,setTheme} = useThemeStore();
  console.log(onlineUsers)

  useEffect(()=>{
    setTheme(localStorage.getItem("chat-theme") || "coffee");
  },[])
  
  useEffect(()=>{
    checkAuth();
  },[checkAuth])

  // Apply theme to the entire document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  console.log(authUser)
  if(isCheckingAuth&&!authUser)return(
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login" />} />
        <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/" />} />
        <Route path="/signup" element={!authUser?<SignupPage />:<Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
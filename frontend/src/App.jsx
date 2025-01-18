import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './Components/NavBar.jsx';
import HomePage from './Pages/HomePage.jsx';
import SignupPage from './Pages/SignupPage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import SettingsPage from './Pages/SettingsPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';
import {Loader} from 'lucide-react';
import {Toaster} from 'react-hot-toast';
export default function App() {
    const { checkAuth, authUser,isCheckingAuth,onlineUsers } = useAuthStore();
    const {theme,setTheme} = useThemeStore();
    React.useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if(isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        )
    }
    return (
            <div data-theme={theme} className="App min-h-screen flex flex-col">
                <NavBar />
                <Routes>
                    <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
                    <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
                </Routes>
                <Toaster />
            </div>
    );
}
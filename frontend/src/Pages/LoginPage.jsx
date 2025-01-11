import React from 'react'
import {MessageSquare,User,Mail,Lock,Eye,EyeOff,Loader2} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../Components/AuthImagePattern';
import toast from 'react-hot-toast'
export default function LoginPage() {
    const [showPassword,setShowPassword] = React.useState(false);
    const [user,setUser] = React.useState({email:"",password:""});
    const {login,isLoggingIn} = useAuthStore();
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    } 

    const validateForm = () => {
        if (!user.email.trim() || !user.password.trim()) {
            toast.error("Please fill in all fields");
            return false;
        }
        if(user.password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        if (!/\S+@\S+\.\S+/.test(user.email)) return toast.error("Invalid email format");

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid === true) {
            login(user);
        }
    }

    return (
        <div className='min-h-screen grid lg:grid-cols-2'>
            <div className='flex items-center justify-center flex-col p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                        <div
                            className="size-14 rounded-xl bg-primary/10 flex items-center justify-center 
                        group-hover:bg-primary/20 transition-colors"
                        >
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                        <p className="text-base-content/60">Sign into your account</p>
                        </div>
                    </div>
                    {/*form*/}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="E-mail"
                                    className="input input-bordered pl-10 w-full rounded-lg h-12"
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="input input-bordered pl-10 w-full rounded-lg h-12"
                                />
                                <button type='button' className='absolute inset-y-0 right-0 pr-3 flex items-center' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                <Loader2 className="size-5 animate-spin" />
                                Loading...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            {/*right side*/}
            <AuthImagePattern 
                title="Welcome Back!"
                subtitle="Sign in to continue chatting with your friends,family and colleagues"
            />
        </div>
    )
}

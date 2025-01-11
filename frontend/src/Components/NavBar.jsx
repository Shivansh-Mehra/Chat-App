import React from 'react';
import {MessageSquare, User,LogOut} from 'lucide-react'
import {Settings} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';
import {Link} from 'react-router-dom';
export default function NavBar() {
    const {authUser,logout} = useAuthStore();
    return (
        <nav className='flex justify-between h-16 border-b w-full items-center'>
            <div className='flex items-center justify-center gap-2 font-bold'>
                <div className="logo text-blue-500">
                    <MessageSquare />
                </div>
                <div className="text-blue-500">
                    ChatRoom
                </div>
            </div>
            <div className='flex items-center justify-center gap-4 w-70 mr-8'>
                <Link className="text-blue-500" to='/settings'>
                    <Settings />
                </Link>
                <Link className='text-blue-500' to='/settings'>
                    Settings
                </Link>
                {authUser && <>
                    <Link to='/profile' className='text-blue-500 flex'>
                    <User className='size-5 text-blue-500' />
                    <span className='hidden sm:inline'>Profile</span>
                    </Link>

                    <button className='flex gap-2 items-center' onClick={logout}>
                        <LogOut className='size-5 text-blue-500' />
                        <span className='hidden sm:inline'>Logout</span>
                    </button>
                </>}
            </div>
        </nav>
    )
}
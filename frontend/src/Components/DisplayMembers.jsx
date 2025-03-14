import React from 'react'
import { useChatStore } from '../store/useChatStore'
import defaultProfilePic from '../assets/default_insta.jpg'
import {useAuthStore} from '../store/useAuthStore'

export default function DisplayMembers({groupId}) {
    const {onlineUsers} = useAuthStore();
    const {members,getGroupMembers} = useChatStore();
    React.useEffect(() => {
        getGroupMembers(groupId);
    },[groupId,getGroupMembers]);
    return (
        <div className="w-full h-full flex flex-col flex-1 overflow-auto">
            <div className="w-full border-b border-gray-200 flex items-center justify-between p-4">
                <h2 className="text-xl font-semibold">Members</h2>
                <div className='flex gap-2'>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                        Add Member
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                            Leave Group
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4">
                {members.map(member => (
                    <div key={member._id} className="flex items-center gap-2">
                        <img src={member.profilePic && member.profilePic.url ? member.profilePic.url : defaultProfilePic} alt="User profile" 
                            className="border rounded-full w-12 h-12"
                        />
                        <div>
                            <p className="font-medium">{member.username}</p>
                            <p className='text-xs text-gray-500'>{onlineUsers.includes(member._id) ? "Online" : "Offline"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )    
}
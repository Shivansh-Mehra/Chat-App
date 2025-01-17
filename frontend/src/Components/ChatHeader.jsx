import { useChatStore } from "../store/useChatStore"
import defaultProfilePic from "../assets/default_insta.jpg"
import {X} from 'lucide-react'
export default function ChatHeader() {
    const {selectedUser,setSelectedUser} = useChatStore()
    return (
        <div className="w-full border-b border-gray-200 flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <img src={selectedUser.profilePic ? selectedUser.profilePic.url : defaultProfilePic} alt="hm" 
                    className="border rounded-full w-12 h-12"
                />
                <div>
                    <p className="font-medium">{selectedUser.username}</p>
                    <p className="text-xs text-gray-500">Offline</p>
                </div>
            </div>

            <div>
                <X className="w-6 h-6 cursor-pointer" onClick={() => {setSelectedUser(null)}} />
            </div>
        </div>
    )
}
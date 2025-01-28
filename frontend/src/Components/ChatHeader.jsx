import { useChatStore } from "../store/useChatStore"
import defaultProfilePic from "../assets/default_insta.jpg"
import {X} from 'lucide-react'
export default function ChatHeader() {
    const {selectedUser,setSelectedUser,selectedGroup,setSelectedGroup} = useChatStore()
    return (
        <div className="w-full border-b border-gray-200 flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
            {selectedUser ? (
                    <>
                        <img src={selectedUser.profilePic && selectedUser.profilePic.url ? selectedUser.profilePic.url : defaultProfilePic} alt="User profile" 
                            className="border rounded-full w-12 h-12"
                        />
                        <div>
                            <p className="font-medium">{selectedUser.username}</p>
                            <p className="text-xs text-gray-500">{selectedUser.isOnline ? "Online" : "Offline"}</p>
                        </div>
                    </>
                ) : selectedGroup ? (
                    <>
                        <img src={defaultProfilePic} alt="Group profile" 
                            className="border rounded-full w-12 h-12"
                        />
                        <div>
                            <p className="font-medium">{selectedGroup.name}</p>
                            <p className="text-xs text-gray-500">Group</p>
                        </div>
                    </>
                ) : null}
            </div>

            <div>
                <X className="w-6 h-6 cursor-pointer" onClick={() => {setSelectedUser(null); setSelectedGroup(null)}} />
            </div>
        </div>
    )
}
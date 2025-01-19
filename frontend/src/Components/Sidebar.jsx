//issue -> when i send a message initially it shows the message from sender side for both users but on refreshing it fixes
import { Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "../Components/skeleton/SidebarSkeleton";
import React from "react";
import defaultProfilePic from "../assets/default_insta.jpg";
export default function Sidebar() {
  const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser } =
    useChatStore();
    const { onlineUsers } = useAuthStore();
  const [showOnline,setShowOnline] = React.useState(false);
  const filteredUsers = showOnline ? users.filter((user) => onlineUsers.includes(user._id)) : users;
  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }
  return (
    <aside className="h-full flex flex-col w-20 lg:w-72 border-r border-gray-200 transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-2 mb-2 flex items-center gap-2">
          <input type="checkbox" name="online" id="online" onChange={() => setShowOnline(!showOnline)} className="mr-2"/>
          <label htmlFor="online" className="flex items-center">Show online users only</label>
        </div>

        <div className="overflow-y-auto h-96 w-full">
            {filteredUsers.map((user) => {
                return <div
                    key = {user._id}
                    onClick = {() => setSelectedUser(user)}
                    className="flex items-center hover:bg-gray-100 gap-2 p-2 cursor-pointer"
                >
                    <img src={user.profilePic && user.profilePic.url !== "" ? user.profilePic.url : defaultProfilePic} alt="profile pic" className="border rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"/>
                    <div className="hidden lg:block">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{onlineUsers.includes(user._id) ? "Online" : "Offline"}</p>
                    </div>
                </div>
            })}
        </div>

      </div>
    </aside>
  );
}

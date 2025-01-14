import { Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "../Components/skeleton/SidebarSkeleton";
import React from "react";
import defaultProfilePic from "../assets/default_insta.jpg";
export default function Sidebar() {
  const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser } =
    useChatStore();
    const { authUser } = useAuthStore();
  {
    /*change after implementing socket.io*/
  }
  React.useEffect(() => {
    getUsers();
    console.log(users);
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
        <div className="">
            {/*Later change this to onlineusers*/}
        </div>

        <div className="overflow-y-auto h-96 w-full">
            {users.map((user) => {
                return <div
                    key = {user.id}
                    onClick = {() => setSelectedUser(user)}
                    className="flex items-center hover:bg-gray-100 gap-2 p-2 cursor-pointer"
                >
                    <img src={user.profilePic.url ? user.profilePic.url : defaultProfilePic} alt="profile pic" className="border rounded-full size-12"/>
                    <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">Offline</p>
                    </div>
                </div>
            })}
        </div>

      </div>
    </aside>
  );
}

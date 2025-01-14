import { Divide } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "../Components/skeleton/SidebarSkeleton";
import React from "react";
export default function Sidebar() {
    const {users,getUsers,isUsersLoading,selectedUser,setSelectedUser} = useChatStore();
    const onlineusers = []; {/*change after implementing socket.io*/}
    React.useEffect(() => {
        getUsers();
    },[getUsers])

    if(isUsersLoading) {
        return <SidebarSkeleton />
    }
    return (
        <aside></aside>
    )
}
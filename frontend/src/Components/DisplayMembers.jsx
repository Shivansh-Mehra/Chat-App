import React from 'react'
import { useChatStore } from '../store/useChatStore'
import defaultProfilePic from '../assets/default_insta.jpg'
import { useAuthStore } from '../store/useAuthStore'

export default function DisplayMembers({ groupId }) {
    const { onlineUsers,authUser } = useAuthStore();
    const { members, getGroupMembers, addGroupMember, users, getUsers,leaveGroup } = useChatStore();
    const [addMemberModal, setAddMemberModal] = React.useState(false);

    React.useEffect(() => {
        getGroupMembers(groupId);
        getUsers();
    }, [groupId, getGroupMembers, getUsers]);

    if (addMemberModal) {
        const availableUsers = users.filter(
            user => !members.some(member => member._id === user._id)
        );
        return (
            <div className="w-full h-full flex flex-col flex-1 overflow-auto">
                <div className="w-full border-b border-gray-200 flex items-center justify-between p-4">
                    <h2 className="text-xl font-semibold">Add Member</h2>
                    <div>
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            onClick={() => setAddMemberModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    {availableUsers.length > 0 ? (
                        availableUsers.map(user => (
                            <div key={user._id} className="flex items-center gap-2">
                                <img
                                    src={
                                        user.profilePic && user.profilePic.url
                                            ? user.profilePic.url
                                            : defaultProfilePic
                                    }
                                    alt="User profile"
                                    className="border rounded-full w-12 h-12"
                                />
                                <div>
                                    <p className="font-medium">{user.username}</p>
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                        onClick={() => addGroupMember(groupId, user._id)}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No users available to add.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col flex-1 overflow-auto">
            <div className="w-full border-b border-gray-200 flex items-center justify-between p-4">
                <h2 className="text-xl font-semibold">Members</h2>
                <div className="flex gap-2">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => setAddMemberModal(!addMemberModal)}
                    >
                        Add Member
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onClick={() => {leaveGroup(groupId,authUser._id)}}>
                        Leave Group
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4">
                {members.map(member => (
                    <div key={member._id} className="flex items-center gap-2">
                        <img
                            src={
                                member.profilePic && member.profilePic.url
                                    ? member.profilePic.url
                                    : defaultProfilePic
                            }
                            alt="User profile"
                            className="border rounded-full w-12 h-12"
                        />
                        <div>
                            <p className="font-medium">{member.username}</p>
                            <p className="text-xs text-gray-500">
                                {onlineUsers.includes(member._id) ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
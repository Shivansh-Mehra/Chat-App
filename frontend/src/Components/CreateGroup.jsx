import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

export default function CreateGroup({ func }) {
    const { createGroup, getUsers, users } = useChatStore();
    const { authUser } = useAuthStore();
    const [name, setName] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([authUser._id]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const toggleUserSelection = (userId) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || selectedUserIds.length === 0) return;
        try {
            await createGroup(name, selectedUserIds);
            setName('');
            setSelectedUserIds([authUser._id]);
            if (typeof func === 'function') {
                func(false);
            }
        } catch (error) {
            //console.log(error);
            setName('');
            setSelectedUserIds([authUser._id]);
            if (typeof func === 'function') {
                func(false);
            }
            
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
            <h2 className="text-xl font-bold">Create Group</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Group Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Members
                </label>
                <div className="max-h-60 overflow-y-auto border rounded p-2">
                    {users &&
                        users
                            .filter(user => user._id !== authUser._id)
                            .map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => toggleUserSelection(user._id)}
                                    className={`cursor-pointer p-2 rounded ${
                                        selectedUserIds.includes(user._id) ? 'bg-blue-100' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <p className="text-sm font-medium">{user.username}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            ))}
                </div>
            </div>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                Create Group
            </button>
        </form>
    );
}
import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';

export default function CreateGroup() {
    const [name, setName] = useState('');
    const [members, setMembers] = useState('');
    const { createGroup } = useChatStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const membersArray = members.split(',').map(member => member.trim());
        await createGroup(name, membersArray);
        setName('');
        setMembers('');
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
                <label htmlFor="members" className="block text-sm font-medium text-gray-700">
                    Members (comma-separated user IDs)
                </label>
                <input
                    type="text"
                    id="members"
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                />
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
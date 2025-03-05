import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import CreateGroup from './CreateGroup';

const NoChatSelected = () => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowCreateGroup(true)}
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          Create Group
        </button>
      </div>
      {showCreateGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowCreateGroup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <CreateGroup func={setShowCreateGroup} />
          </div>
        </div>
      )}
      <div className="flex justify-center gap-4 mb-4">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
          >
            <MessageSquare className="w-8 h-8 text-primary " />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold">Welcome to Chat Room!</h2>
      <p className="text-base-content/60">
        Select a conversation from the sidebar to start chatting
      </p>
    </div>
  );
};

export default NoChatSelected;
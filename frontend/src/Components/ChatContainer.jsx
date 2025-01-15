import React from 'react'
import ChatHeader from "./ChatHeader";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import MessageSkeleton from './skeleton/MessageSkeleton';
export default function ChatContainer() {
  const {selectedUser,messages,getMessages,isMessagesLoading} = useChatStore();  
  React.useEffect(() => {
    getMessages(selectedUser._id);
  },[selectedUser,getMessages]);

  if(isMessagesLoading) return (
    <div className="w-full h-full flex flex-col flex-1 overflow-auto">
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>
  )
  return (
    <div className="w-full h-full flex flex-col flex-1 overflow-auto">
      <ChatHeader />
      <div className='flex-grow overflow-y-auto'>
        
      </div>
      <MessageInput  />
    </div>
  );
}

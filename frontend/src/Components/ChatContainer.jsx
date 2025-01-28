import React from 'react'
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import MessageSkeleton from './skeleton/MessageSkeleton';
import defaultProfilePic from '../assets/default_insta.jpg';
import { formatMessageTime } from '../lib/times'; 
export default function ChatContainer() {
  const messageEndRef = React.useRef(null);
  const {authUser} = useAuthStore();
  const {selectedUser,messages,getMessages,isMessagesLoading,subscribeToMessages,unsubscribeFromMessages,getGroupMessages,selectedGroup} = useChatStore();  
  React.useEffect(() => {
    if(selectedUser) {
      getMessages(selectedUser._id);
      console.log("selectedUser",selectedUser);
    }
    if(selectedGroup) {
      getGroupMessages(selectedGroup._id);
      console.log("selectedGroup",selectedGroup);
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  },[selectedUser,getMessages,subscribeToMessages,unsubscribeFromMessages,selectedGroup,getGroupMessages]);

  React.useEffect(() => {
    if(messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  },[messages]);

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
        {Array.isArray(messages) && messages &&  messages.map((msg) => (
          <div key={msg._id} className={`chat ${msg.senderId._id !== authUser._id ? 'chat-start' : 'chat-end'}`} ref={messageEndRef}>
            <div className="chat-image ">
              <img src={msg.senderId.profilePic ? msg.senderId.profilePic.url : defaultProfilePic} alt="avatar" className="size-10 rounded-full border" />
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(msg.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {msg.image && (
                <img src={msg.image.url} alt="message" className="w-32 h-32 object-cover rounded" />
              )}
              {msg.message && <p className="text-sm">{msg.message}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput  />
    </div>
  );
}

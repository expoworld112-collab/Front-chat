import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import ChatMessage from "./ChatMessage";

function ChatContainer() {
  const {
    selectedUser,
    messages,
    isMessagesLoading,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
const socket = useAuthStore((state) => state.socket);

  const { authUser } = useAuthStore((state)=> state.authUser);
  const messageEndRef = useRef(null);
   

   useEffect(() => {
    if(!selectedUser || !socket) return ;
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages(socket);

    return () => unsubscribeFromMessages(socket);
  }, [selectedUser?._id , socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <NoChatHistoryPlaceholder name="Select a chat" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
        {isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        // ) : (
        //   messages.map((msg) => (
        //     <ChatMessage
        //       key={msg._id}
        //       message={msg}
        //       isSender={msg.senderId === authUser._id}
        //       avatar={
        //         msg.senderId === authUser._id
        //           ? authUser.profilePic
        //           : selectedUser.profilePic
        //       }
        //       name={
        //         msg.senderId === authUser._id
        //           ? authUser.fullName
        //           : selectedUser.fullName
        //       }
        //     />
        //   ))
        // ) 

        ) : (
  <>
    {messages.map((msg) => {
      const senderId = msg.senderId?.toString();
      const authId = authUser?._id?.toString();

      const isSender = senderId === authId;

      return (
        <ChatMessage
          key={msg._id}
          message={msg}
          isSender={isSender}
          avatar={isSender ? authUser.profilePic : selectedUser.profilePic}
          name={isSender ? authUser.fullName : selectedUser.fullName}
        />
      );
    })}
  </>
)}

        
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;

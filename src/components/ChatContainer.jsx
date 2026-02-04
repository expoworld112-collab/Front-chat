import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder.jsx";

import { useEffect ,useRef } from "react";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessagesLoadingSkeleton from "./MessageLoadingSkeleton.jsx";
// function ChatContainer() {
//   const { selectedUser, getMessagesByUserId , messages, isMessagesLoading , subscribeToMessages , unsubscribeFromMessages } = useChatStore();
//   const { authUser } = useAuthStore();
//   const messageEndRef= useRef(null);

  


//   useEffect(()=> {
//     getMessagesByUserId(selectedUser._id);
//     subscribeToMessages();

//     //clean up 
//     return () => unsubscribeFromMessages();
//   } , [selectedUser]) ;  
// useEffect(() => {
//   if (messageEndRef.current){
//     messageEndRef.current.scrollIntoView({ behavior: "smooth"});
//   }
// }, [messages]);

// if (!selectedUser) {
//   return (
//     <div className="flex-1 flex items-center justify-center">
//       <NoChatHistoryPlaceholder name="Select a chat" />
//     </div>
//   );
// }
//   return (
//     <>
//       <ChatHeader />
//       <div className="flex-1 px-6 overflow-y-auto py-8">
//         {messages.length > 0 && !isMessagesLoading ? (
//           <div className="max-w-3xl mx-auto space-y-6">
//             {messages.map(msg => (
//               <div key={msg._id}
//                 className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
//                 <div className={`chat-bubble relative ${msg.senderId === authUser._id
//                     ? "bg-cyan-600  text-white"
//                     : "bg-slate-800 text-slate-200"
//                   }`}>
//                   {msg.image && (
//                     <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
//                   )}
//                   {msg.text && <p className="mt-2">{msg.text}</p>}
//                   <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
//                     {new Date(msg.createdAt).toLocaleTimeString(undefined,{
//                       hour: "2-digit" ,
//                       minute: "2-digit" ,
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}
            
//             <div ref={messageEndRef}/>
//           </div>
//         ) : isMessagesLoading ? ( <MessagesLoadingSkeleton />  ): (
//           <NoChatHistoryPlaceholder name={selectedUser.fullName} />
//         )}
//       </div>
//       <MessageInput />
//     </>
//   );
// }
function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // ✅ Only run when a user is selected
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Early return AFTER hooks
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <NoChatHistoryPlaceholder name="Select a chat" />
      </div>
    );
  }

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(msg => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  {/* ✅ Prevent crash if date missing */}
                  {msg.createdAt && (
                    <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  );
}

export default ChatContainer;

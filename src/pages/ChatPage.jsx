import { useChatStore } from '../store/useChatStore';
import BorderAnimatedContainer from "../components/BoarderAnimatedContainer.jsx";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ActiveTabSwitch from "../components/ActiveTabSwitch.jsx";
import ChatsList from "../components/ChatList";
 import ContactList from "../components/ContactList.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder.jsx";
import { useEffect } from 'react';
import { getMessagesByUserId } from '../../../backend/src/controllers/message.controllers.js';

function ChatPage() {
const {activeTab , selectedUser} = useChatStore(); 

 useEffect(() => {
  const {
    subscribeToProfileUpdates,
    unsubscribeFromProfileUpdates,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore.getState();

  subscribeToProfileUpdates();

  return () => {
    unsubscribeFromProfileUpdates();
    unsubscribeFromMessages();
  };
}, []);
useEffect(() => {
  const {
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    getMessagesByUserId,
  } = useChatStore.getState();

  if (selectedUser?._id) {
    getMessagesByUserId(selectedUser._id);   // load chat history
    subscribeToMessages();                   // start realtime
  }

  return () => unsubscribeFromMessages();    // stop old listener
}, [selectedUser]);
  return (
    <div className =" relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
        <ProfileHeader/>
        <ActiveTabSwitch/>
        <div className =" flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === "chats" ? <ChatsList/>: <ContactList/>}
      </div>
    </div >
   {/*RIGHT SIDE */}
   <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
   {selectedUser ? <ChatContainer/ >: <NoConversationPlaceholder/>}

   </div>
   </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;


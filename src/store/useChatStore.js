import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {useAuthStore }from "../store/useAuthStore.js";
export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({ isSoundEnabled: !get().isSoundEnabled })
    },
// setActiveTab: (tab) =>
//   set(state => ({
//     activeTab: tab,
//     // If leaving chats tab, close any open conversation
//     selectedUser: tab === "chats" ? state.selectedUser : null,
//     messages: tab === "chats" ? state.messages : []
//   })),
   
setActiveTab: (tab) =>
  set((state) => ({
    activeTab: tab,
    selectedUser: tab === "chats" ? state.selectedUser : null,
    messages: tab === "chats" ? state.messages : [],
  })),

setSelectedUser: (selectedUser) => set({ selectedUser }),


    // getAllContancts: async () => {
    //     set({ isUsersLoading: true });
    //     try {
    //         const res = await axiosInstance.get("/messages/contacts");
    //         set({ allContacts: res.data });

    //     } catch (error) {
    //         toast.error(error.response.data.message);
    //     }
    //     finally {
    //         set({ isUsersLoading: false });
    //     }
    // },
  getAllContacts: async () => {
    set({ isUserLoading: true }); // start loading
    try {
        const res = await axiosInstance.get("/messages/contacts"); // fetch all contacts

        // exclude the current user from the contact list
        const { authUser } = useAuthStore.getState();
        const filteredContacts = res.data.filter(u => u._id !== authUser._id);

        set({ allContacts: filteredContacts }); // update state
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
        set({ isUserLoading: false }); // stop loading
    }
},


    getMyChatPartners: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");

            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },
    getMessagesByUserId: async (userId) => {
          set ({isMessagesLoading: true}) ;
          try {
            const res = await axiosInstance.get(`/messages/${userId}`) ;
            set({ messages: res.data}) ;

            
          } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong") ;

          }finally {
            set({ isMessagesLoading : false });
          }
    },
    // sendMessage: async(messageData) => {
    //     const {selectedUser , messages} = get ();
    //    const {authUser}  = useAuthStore.getState()
    //    const tempId = `temp-${Date.now()}`
    //    const optimisticMessage = {
    //      _id:tempId,
    //      senderId: authUser._id,
    //      receiverId: selectedUser._id,
    //      text: messageData.text,
    //      image: messageData.image,
    //      createdAt: new Date().toISOString(),
    //      isOptimistic : true,

    //    };
    //    // imidetaly update the ui by adding the message
    //    set({messages:[...messages,optimisticMessage]});
    //     try {
    //         const res =await axiosInstance.post(`/messages/send/${selectedUser._id }`, messageData);
    //         set({messages:messages.concat(res.data)});
    //     } catch (error) {
    //         set({messages:messages});
    //         toast.error(error.response?.data?.message || " Something went wrong");
            
    //     }
    // },
    
    sendMessage: async (messageData) => {
  const { selectedUser } = get();
  const { authUser } = useAuthStore.getState();

  const tempId = `temp-${Date.now()}`;

  const optimisticMessage = {
    _id: tempId,
    senderId: authUser._id,
    receiverId: selectedUser._id,
    text: messageData.text,
    image: messageData.image,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
  };

  // optimistic UI update
  set(state => ({ messages: [...state.messages, optimisticMessage] }));

  try {
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

    // replace optimistic message with real one
    set(state => ({
      messages: state.messages.map(msg =>
        msg._id === tempId ? res.data : msg
      )
    }));
  } catch (error) {
    // rollback if failed
    set(state => ({
      messages: state.messages.filter(msg => msg._id !== tempId)
    }));

    toast.error(error.response?.data?.message || "Something went wrong");
  }
},
fetchUnreadCounts: async () => {
  const res = await axios.get("/api/messages/unread", {
    withCredentials: true,
  });

  const map = {};
  res.data.forEach(item => {
    map[item._id] = item.count;
  });

  set({ unreadCounts: map });
},

    
    subscribeToMessages: () => {
    const {selectedUser , isSoundEnabled  } =get () ;
    if(!selectedUser) return;
    const socket = useAuthStore.getState().socket ;
    //ver important controls that ui update only when message is sent from selected user to its .

    socket.on("newMessage" , (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if(!isMessageSentFromSelectedUser) return;
        //-----------//
      const currentMessages  = get().messages;
      set({messages:[...currentMessages , newMessage]});
      if(isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3") ;

        notificationSound.currentTime = 0 ;
        notificationSound.play().catch((e)=> console.log("Audio play failed" ,e ));
      }
    });
     },
     unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
         socket.off("newMessage");
     },
}));


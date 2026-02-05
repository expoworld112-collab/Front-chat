// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import {useAuthStore }from "../store/useAuthStore.js";
// export const useChatStore = create((set, get) => ({
//     allContacts: [],
//     chats: [],
//     messages: [],
//     activeTab: "chats",
//     selectedUser: null,
//     isUserLoading: false,
//     isMessagesLoading: false,
//     isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

//     toggleSound: () => {
//         localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
//         set({ isSoundEnabled: !get().isSoundEnabled })
//     },
// // setActiveTab: (tab) =>
// //   set(state => ({
// //     activeTab: tab,
// //     // If leaving chats tab, close any open conversation
// //     selectedUser: tab === "chats" ? state.selectedUser : null,
// //     messages: tab === "chats" ? state.messages : []
// //   })),
   
// setActiveTab: (tab) =>
//   set((state) => ({
//     activeTab: tab,
//     selectedUser: tab === "chats" ? state.selectedUser : null,
//     messages: tab === "chats" ? state.messages : [],
//   })),

// setSelectedUser: (selectedUser) => set({ selectedUser }),


//     // getAllContancts: async () => {
//     //     set({ isUsersLoading: true });
//     //     try {
//     //         const res = await axiosInstance.get("/messages/contacts");
//     //         set({ allContacts: res.data });

//     //     } catch (error) {
//     //         toast.error(error.response.data.message);
//     //     }
//     //     finally {
//     //         set({ isUsersLoading: false });
//     //     }
//     // },
//   getAllContacts: async () => {
//     set({ isUserLoading: true }); // start loading
//     try {
//         const res = await axiosInstance.get("/messages/contacts"); // fetch all contacts

//         // exclude the current user from the contact list
//         const { authUser } = useAuthStore.getState();
//         const filteredContacts = res.data.filter(u => u._id !== authUser._id);

//         set({ allContacts: filteredContacts }); // update state
//     } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to load contacts");
//     } finally {
//         set({ isUserLoading: false }); // stop loading
//     }
// },


//     getMyChatPartners: async () => {
//         set({ isUserLoading: true });
//         try {
//             const res = await axiosInstance.get("/messages/chats");

//             set({ chats: res.data });
//         } catch (error) {
//             toast.error(error.response.data.message);
//         } finally {
//             set({ isUserLoading: false });
//         }
//     },
//     getMessagesByUserId: async (userId) => {
//           set ({isMessagesLoading: true}) ;
//           try {
//             const res = await axiosInstance.get(`/messages/${userId}`) ;
//             set({ messages: res.data}) ;

            
//           } catch (error) {
//             toast.error(error.response?.data?.message || "Something went wrong") ;

//           }finally {
//             set({ isMessagesLoading : false });
//           }
//     },
//     // sendMessage: async(messageData) => {
//     //     const {selectedUser , messages} = get ();
//     //    const {authUser}  = useAuthStore.getState()
//     //    const tempId = `temp-${Date.now()}`
//     //    const optimisticMessage = {
//     //      _id:tempId,
//     //      senderId: authUser._id,
//     //      receiverId: selectedUser._id,
//     //      text: messageData.text,
//     //      image: messageData.image,
//     //      createdAt: new Date().toISOString(),
//     //      isOptimistic : true,

//     //    };
//     //    // imidetaly update the ui by adding the message
//     //    set({messages:[...messages,optimisticMessage]});
//     //     try {
//     //         const res =await axiosInstance.post(`/messages/send/${selectedUser._id }`, messageData);
//     //         set({messages:messages.concat(res.data)});
//     //     } catch (error) {
//     //         set({messages:messages});
//     //         toast.error(error.response?.data?.message || " Something went wrong");
            
//     //     }
//     // },
    
//     sendMessage: async (messageData) => {
//   const { selectedUser } = get();
//   const { authUser } = useAuthStore.getState();

//   const tempId = `temp-${Date.now()}`;

//   const optimisticMessage = {
//     _id: tempId,
//     senderId: authUser._id,
//     receiverId: selectedUser._id,
//     text: messageData.text,
//     image: messageData.image,
//     createdAt: new Date().toISOString(),
//     isOptimistic: true,
//   };

//   // optimistic UI update
//   set(state => ({ messages: [...state.messages, optimisticMessage] }));

//   try {
//     const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

//     // replace optimistic message with real one
//     set(state => ({
//       messages: state.messages.map(msg =>
//         msg._id === tempId ? res.data : msg
//       )
//     }));
//   } catch (error) {
//     // rollback if failed
//     set(state => ({
//       messages: state.messages.filter(msg => msg._id !== tempId)
//     }));

//     toast.error(error.response?.data?.message || "Something went wrong");
//   }
// },
// fetchUnreadCounts: async () => {
//   const res = await axios.get("/api/messages/unread", {
//     withCredentials: true,
//   });

//   const map = {};
//   res.data.forEach(item => {
//     map[item._id] = item.count;
//   });

//   set({ unreadCounts: map });
// },

    
//     subscribeToMessages: () => {
//     const {selectedUser , isSoundEnabled  } =get () ;
//     if(!selectedUser) return;
//     const socket = useAuthStore.getState().socket ;
//     //ver important controls that ui update only when message is sent from selected user to its .

//     socket.on("newMessage" , (newMessage) => {
//         const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
//         if(!isMessageSentFromSelectedUser) return;
//         //-----------//
//       const currentMessages  = get().messages;
//       set({messages:[...currentMessages , newMessage]});
//       if(isSoundEnabled) {
//         const notificationSound = new Audio("/sounds/notification.mp3") ;

//         notificationSound.currentTime = 0 ;
//         notificationSound.play().catch((e)=> console.log("Audio play failed" ,e ));
//       }
//     });
//      },
//      unsubscribeFromMessages: () => {
//         const socket = useAuthStore.getState().socket;
//          socket.off("newMessage");
//      },


     
// }));


import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  // ----- Friend Request State -----
  friends: [],
  friendRequests: [], // requests received by auth user
  sentRequests: [],   // requests sent by auth user

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: tab,
      selectedUser: tab === "chats" ? state.selectedUser : null,
      messages: tab === "chats" ? state.messages : [],
    })),

  setSelectedUser: (selectedUser) => {
    const { friends } = get();
    const canChat = friends.some((f) => f._id === selectedUser._id);

    if (!canChat) {
      toast.error(
        "You must be friends to start a chat. Send a friend request first."
      );
      set({ selectedUser: null });
      return;
    }
    set({ selectedUser });
  },

  // ----- Contacts -----
  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      const { authUser } = useAuthStore.getState();
      const filteredContacts = res.data.filter((u) => u._id !== authUser._id);
      set({ allContacts: filteredContacts });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ----- Send Message with optimistic update -----
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

    set((state) => ({ messages: [...state.messages, optimisticMessage] }));

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? res.data : msg
        ),
      }));
    } catch (error) {
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  fetchUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread", {
        withCredentials: true,
      });
      const map = {};
      res.data.forEach((item) => {
        map[item._id] = item.count;
      });
      set({ unreadCounts: map });
    } catch (error) {
      console.error("Failed to fetch unread counts", error);
    }
  },

  // ----- Socket subscription -----
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // ----- Friend Requests -----
  fetchFriendData: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/friends/incoming"); // backend endpoint
      set({
                friends: res.data.friends,         // accepted friends

        friendRequests: res.data.received, // pending requests to auth user
        sentRequests: res.data.sent,       // requests sent by auth user
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load friend data");
    } finally {
      set({ isUserLoading: false });
    }
  },

  sendFriendRequest: async (receiverId) => {
    try {
      await axiosInstance.post(`/friends/send/${receiverId}`);
      toast.success("Friend request sent");
      get().fetchFriendData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/friends/accept/${requestId}`);
      toast.success("Friend request accepted");
      get().fetchFriendData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept friend request");
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/friends/reject/${requestId}`);
      toast.success("Friend request rejected");
      get().fetchFriendData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject friend request");
    }
  },
}));



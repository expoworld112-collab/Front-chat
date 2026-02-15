


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
  UnreadCounts:{},
  friends: [],
  friendRequests: [],
  sentRequests: [],
getOnlineUsers,
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
      toast.error("You must be friends to chat. Send a friend request first.");
      set({ selectedUser: null });
      return;
    }
    set({ selectedUser });
  },

  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/friends/contacts");
      const { authUser } = useAuthStore.getState();
      const filtered = res.data.filter((u) => u._id !== authUser._id);
      set({ allContacts: filtered });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUserLoading: false });
    }
  },

  fetchFriendData: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/friends/incoming");
      set({
        friends: res.data.friends,
        friendRequests: res.data.received,
        sentRequests: res.data.sent,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch friend data");
    } finally {
      set({ isUserLoading: false });
    }
  },

  sendFriendRequest: async (receiverId) => {
    try {
      await axiosInstance.post(`/friends/send/${receiverId}`);
      toast.success("Friend request sent");
      get().fetchFriendData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/friends/accept/${requestId}`);
      toast.success("Friend request accepted");
      get().fetchFriendData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept request");
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/friends/reject/${requestId}`);
      toast.success("Friend request rejected");
      get().fetchFriendData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request");
    }
  },

  
  removeFriend: async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/${friendId}`);
      toast.success("Friend removed");
      get().fetchFriendData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove friend");
    }
  },

  subscribeToMessages: () => {
  const  socket  = useAuthStore.getState().socket;

  if (!socket) {
    console.warn("❌ Socket not initialized");
    return;
  }

  socket.off("newMessage"); 

  socket.on("newMessage", (message) => {
    console.log("📩 SOCKET MESSAGE RECEIVED:", message);

    set((state) => ({
      messages: [...state.messages, message],
    }));
  });
},

getMessagesByUserId: async (userId) => {
  set({ isMessagesLoading: true });

  const res = await axiosInstance.get(`/messages/${userId}`);

  const unique = Array.from(
    new Map(res.data.map(m => [m._id, m])).values()
  );

  set({
    messages: unique,
    isMessagesLoading: false,
  });
},



unsubscribeFromMessages: () => {
  const socket = useAuthStore.getState().socket ;
  if (!socket) return ;
  socket?.off("newMessage");
},

subscribeToProfileUpdates: () => {
  const socket = useAuthStore.getState().socket;
  // const socket = connectSocket();

  if (!socket) {
    console.warn("Socket not initialized yet");
    return;
  }
    socket.on("newMessage", (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  });

    socket.off("profileUpdated"); 


  socket.on("profileUpdated", ({ userId, profilePic }) => {
    set((state) => ({
      allContacts: state.allContacts.map((c) =>
        c._id === userId ? { ...c, profilePic } : c
      ),
      chats: state.chats.map((c) =>
        c._id === userId ? { ...c, profilePic } : c
      ),
    }));
  });
},

unsubscribeFromProfileUpdates: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.off("profileUpdated");
},






sendMessage: async (receiverId ,messageData) => {
  const { selectedUser } = get();
  const { authUser, socket } = useAuthStore.getState();

  const tempId = `temp-${Date.now()}`;

  const isFormData = messageData instanceof FormData;
  const text = isFormData ? messageData.get("text") : messageData.text;
  const file = isFormData ? messageData.get("file") : null;

  const optimisticMessage = {
    _id: tempId,
    senderId: authUser._id,
    receiverId ,
    text: text || "",
    fileUrl: file ? URL.createObjectURL(file) : null,
    fileType: file ? file.type : null,
    createdAt: new Date().toISOString(),
    isOptimistic: true,
  };

  set((state) => ({
    messages: [...state.messages, optimisticMessage],
  }));

  try {
    const res = await axiosInstance.post(
      `/messages/send/${receiverId}`,
      messageData,
      {
        withCredentials: true ,
        headers : isFormData
        ? {"Content-Type": "multipart/form-data"}
:{} ,
      }
    );

    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === tempId ? res.data : msg
      ),
    }));


  } catch (error) {
    // rollback
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== tempId),
    }));

    toast.error(
      error.response?.data?.message || "Failed to send message"
    );
  }
},


getMyChatPartners: async () => {
  set({ isUserLoading: true });
  try {
    const res = await axiosInstance.get("/messages/chats");
    set({ chats: res.data });
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to load chats");
  } finally {
    set({ isUserLoading: false });
  }
},

}));

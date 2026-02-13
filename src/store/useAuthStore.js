import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
// helper to safely extract the error text
const getErrorMessage = (error, fallback = "Something went wrong") => {
  return error?.response?.data?.message || error?.message || fallback;
};

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";
// export const useAuthStore = create((set, get) => ({
//     authUser: null,
//     isCheckingAuth: true,
//     isSigningUp: false,
//     isLoggingIn: false,
//     socket: null,
//     onlineUsers: [],
//     checkAuth: async () => {
//         try {
//             const res = await axiosInstance.get("/auth/check");
//             set({ authUser: res.data });
//             get().connectSocket();

//         } catch (error) {
//             console.log("Auth check FULL error:", error.response || error.message || error);


//             set({ authUser: null });
//         } finally {
//             set({ isCheckingAuth: false });
//         }
//     },


//     signup: async (data) => {
//         set({ isSigningup: true });
//         try {
//             const res = await axiosInstance.post("/auth/signup", data);
//             set({ authUser: res.data });

//             toast.success("Account created successfully");
//             get().connectSocket();

//         } catch (error) {
//             toast.error(error.response.data.message);
//         } finally {
//             set({ isSigningup: false });
//         }
//     },


//     login: async (data) => {
//         set({ isLogging: true });
//         try {
//             const res = await axiosInstance.post("/auth/login", data);
//             set({ authUser: res.data });

//             toast.success("login successfully");
//             get().connectSocket();
//         } catch (error) {
//             toast.error(error.response.data.message || "login failed");
//         } finally {
//             set({ isLogging: false });
//         }
//     },


//     logout: async () => {
//         try {
//             await axiosInstance.post("/auth/logout");
//             set({ authUser: null });
//             toast.success("Logged out successfully");
//             get().disconnectSocket();
//         } catch (error) {
//             toast.error("Logout failed");
//             console.log("Logout error: ", error);
//         }
//     },
//     updateProfile: async (data) => {
//         try {
//             const res = await axiosInstance.put("/auth/update-profile", data)
//             set({ authUser: res.data })
//             toast.success("profile updated successfully");
//         } catch (error) {
//             console.log("error.response.data.message");
//             toast.error(error.response.data.message);
//         }
//     },
//     connectSocket: () => {
//         const { authUser } = get();
//         if (!authUser || get().socket.connected) return;
//         const socket = io(BASE_URL, {
//             withCredentials: true, //this ensure cookies are sent with the connection
//         });
//         socket.connect();
//         set({ socket });
//         socket.on("getOnlineUsers", (userIds) => {
//             set({ onlineUsers: userIds });
//         });

//     },
//     disconnectSocket: () => {
//         if (get().socket?.connected) get().socket.disconnect();
//     },
// }));
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],


  checkAuth: async () => {
  try {
    const res = await axiosInstance.get("/auth/check");
    set({ authUser: res.data });
    get().connectSocket();
  } catch (error) {
    if (error.response?.status === 401) {
      set({ authUser: null });
    } else {
      console.error("Auth check error:", error);
    }
  } finally {
    set({ isCheckingAuth: false });
  }
},


  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(
  error?.response?.data?.message || error.message || "Signup failed"
);

    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful");
      get().connectSocket();
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Logout failed");
      console.log("Logout error:", error);
    }
  },


updateProfile: async (file) => {
  if (!file) {
    toast.error("Please select a file");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    const res = await axiosInstance.put(
      "/auth/update-profile",
      formData,
      // {
      //   // headers: {
      //   //   "Content-Type": "multipart/form-data",
      //   // },
      // }
    );

    set({ authUser: res.data });
    toast.success("Profile updated successfully");
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Profile update failed"
    );
  }
},

  fetchUnread: async () => {
  try {
    const res = await axiosInstance.get("/messages/unread");
    set({ unreadCounts: res.data });
  } catch (error) {
    console.error("Failed to fetch unread messages", error);
  }
},


  // connectSocket: () => {
  //   const { authUser, socket } = get();
  //   if (!authUser || socket?.connected) return;

  //   const newSocket = io(BASE_URL, {
  //     withCredentials: true,
  //   });

  //   newSocket.connect();
  //   set({ socket: newSocket });

  //   newSocket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });
  // },
connectSocket: () => {
  const user = get ().authUser ;

if (!user || get().socket?.connected) return;
  const socket = io(import.meta.env.VITE_SERVER_URL, {
    withCredentials: true,
    query: {
      userId: user._id,
    },
  });

  socket.connect();
  socket.on("getOnlineUsers" , (users) => {
    set({getOnlineusers:users}) ;
  });

  set({ socket });
},

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
  },
}));

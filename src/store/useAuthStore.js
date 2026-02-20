// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { disconnectSocket } from "../lib/socket";
// const getErrorMessage = (error, fallback = "Something went wrong") => {
//   return error?.response?.data?.message || error?.message || fallback;
// };

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";





// export const useAuthStore = create((set, get) => ({
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,
//   socket: null,
//   onlineUsers: [],





// checkAuth: async () => {
//   set({ isCheckingAuth: true });
//   try {
//     const res = await fetch('https://chat-backend-sjx6.onrender.com/api/auth/check', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     });
//     const data = await res.json();
//     if (res.ok) {
//       set({ authUser: data.user });
//     } else {
//       set({ authUser: null });
//     }
//   } catch (err) {
//     set({ authUser: null });
//   } finally {
//     set({ isCheckingAuth: false });
//   }
// },

//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });
//       get().connectSocket();
//       toast.success("Account created successfully");
//     } catch (error) {
//       toast.error(
//   error?.response?.data?.message || error.message || "Signup failed"
// );

//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });
//             get().connectSocket();

//       toast.success("Login successful");
//     } catch (error) {
//       toast.error(getErrorMessage(error, "Login failed"));
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//             // get().disconnectSocket();
//    disconnectSocket();
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//     } catch (error) {
//       toast.error("Logout failed");
//       console.log("Logout error:", error);
//     }
//   },


// updateProfile: async (file) => {
//   if (!file) {
//     toast.error("Please select a file");
//     return;
//   }

//   try {
//     const formData = new FormData();
//     formData.append("profilePic", file);

//     const res = await axiosInstance.put(
//       "/auth/update-profile",
//       formData,
     
//     );

//     set({ authUser: res.data });
//     toast.success("Profile updated successfully");
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.message || "Profile update failed"
//     );
//   }
// },

//   fetchUnread: async () => {
//   try {
//     const res = await axiosInstance.get("/messages/unread");
//     set({ unreadCounts: res.data });
//   } catch (error) {
//     console.error("Failed to fetch unread messages", error);
//   }
// },

// }));
 
// // connectSocket: () => {
// //   const user = get ().authUser ;

// // if (!user || get().socket?.connected) return;
// //   const socket = io(BASE_URL, {
// //     withCredentials: true,
// //     query: {
// //       userId: user._id,
// //     },
// //   });

// //   socket.connect();
// //   socket.on("getOnlineUsers" , (users) => {
// //     // set({getOnlineusers:users}) ;
// //     set({ onlineUsers: users })

// //   });

// //   set({ socket });
// // },

// //   disconnectSocket: () => {
// //     const socket = get().socket;
// //     if (socket?.connected) socket.disconnect();
// //     set({socket:null}) ;
// //   },
// // }));
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  onlineUsers: [],
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  // ✅ CHECK AUTH
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(); // reconnect on refresh
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ SIGNUP
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Signup failed"));
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ LOGIN
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      get().connectSocket(); // 🔥 important

      toast.success("Login successful");
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  },

  // ✅ CONNECT SOCKET
  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports:["websockets"] ,
      query: {
        userId: authUser._id,
      },
    });

    newSocket.connect();

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    set({ socket: newSocket });
  },

  // ✅ DISCONNECT SOCKET
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}));
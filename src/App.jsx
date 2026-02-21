import { Routes, Route, Navigate } from "react-router";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader.jsx";
import { Toaster } from "react-hot-toast";
import { useChatStore } from "./store/useChatStore.js";

function App() {
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuthStore();
  const fetchFriendData = useChatStore((state) => state.fetchFriendData);
  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);

  // ✅ Check auth on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ After login → get friend data
  useEffect(() => {
    if (authUser?._id) {
      fetchFriendData();
    }
  }, [authUser?._id, fetchFriendData]);

  // ✅ Listen for online users from socket
  useEffect(() => {
    if (!socket) return;

    socket.off("getOnlineUsers");

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, setOnlineUsers]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/chatPage" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
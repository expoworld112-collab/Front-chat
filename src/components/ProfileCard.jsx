import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton.jsx";

function ProfileCard({ user }) {
  const {
    friends,
    friendRequests,
    sentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    fetchFriendData,
    isUserLoading,
  } = useChatStore();

  useEffect(() => {
    fetchFriendData();
  }, []);

  if (!user) return null;
  if (isUserLoading) return <UsersLoadingSkeleton />;

  // Determine relationship status
  const getFriendStatus = () => {
    if (friends.some(f => f._id === user._id))
      return { type: "friend" };

    const receivedReq = friendRequests.find(r => r.sender?._id === user._id);
    if (receivedReq)
      return { type: "requestReceived", requestId: receivedReq._id };

    const sentReq = sentRequests.find(r => r.receiver?._id === user._id);
    if (sentReq)
      return { type: "requestSent" };

    return { type: "none" };
  };

  const status = getFriendStatus();

  return (
    <div className="bg-cyan-500/10 p-6 rounded-xl flex flex-col items-center gap-4">
      <div className="avatar w-24 h-24 rounded-full overflow-hidden ring-2 ring-cyan-400">
        <img src={user.profilePic || "/avatar.png"} alt={user.fullName} />
      </div>

      <h2 className="text-xl font-semibold">{user.fullName}</h2>

      <div className="flex gap-3 mt-2 flex-wrap justify-center">
        {status.type === "friend" && (
          <span className="bg-green-500 text-white px-4 py-1 rounded-full">
            Friends
          </span>
        )}

        {status.type === "requestReceived" && (
          <>
            <button
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              onClick={() => acceptFriendRequest(status.requestId)}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              onClick={() => rejectFriendRequest(status.requestId)}
            >
              Reject
            </button>
          </>
        )}

        {status.type === "requestSent" && (
          <button
            className="bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed"
            disabled
          >
            Request Sent
          </button>
        )}

        {status.type === "none" && (
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            onClick={() => sendFriendRequest(user._id)}
          >
            Add Friend
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;

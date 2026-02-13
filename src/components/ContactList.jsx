import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function ContactList() {
  const { authUser , socket } = useAuthStore();

  const {
    getAllContacts,
    fetchFriendData,
    allContacts,
    friends,
    friendRequests,
    sentRequests,
    setSelectedUser,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    UnreadCounts,
    setUnreadCounts,
  } = useChatStore();

  useEffect(() => {
    if (!authUser) return;
    getAllContacts();
    fetchFriendData();
 
  console.log("CONTACTS:", allContacts);
// Listen for new messages for notifications
    socket?.on("newMessage", (msg) => {
      if (msg.senderId !== authUser._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    });
    
    return () => socket?.off("newMessage");
  }, [authUser, socket]);


  const getStatus = (user) => {
    if (friends.some((f) => f._id === user._id)) return { type: "friend" };

    const received = friendRequests.find((r) => r.sender._id === user._id);
    if (received) return { type: "received", requestId: received._id };

    const sent = sentRequests.find((r) => r.receiver._id === user._id);
    if (sent) return { type: "sent" };

    return { type: "none" };
  };

  if (!allContacts.length)
    return <p className="text-center text-slate-400 mt-4">No contacts found</p>;


  return (
    <>
      {allContacts.map((contact) => {
        const status = getStatus(contact);
        const isFriend = status.type === "friend";
                const Unread = UnreadCounts?.[contact._id] || 0;


        return (
          <div key={contact._id} className="bg-cyan-500/10 p-4 rounded-lg mb-2 flex flex-col">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full overflow-hidden ${contact.isOnline ? "ring-2 ring-green-400" : "opacity-50"
                  }`}
              >
                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName}   className="w-12 h-12 rounded-full object-cover"
 />
              </div>
              <h4 className="font-medium">{contact.fullName}</h4>
            </div>
            {/* <div className="mt-2 flex gap-2 flex-wrap">
              {status.type === "friend" && (
                <>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedUser(contact)}
                  >
                    Message
                  </button> */}

            <div className="mt-2 flex gap-2 flex-wrap">
              {isFriend && (
                <>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedUser(contact)}
                  >
                    Message
                  </button>
                  {/* <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => removeFriend(contact._id)}
                  >
                    Remove
                  </button> */}
                  {/* <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => removeFriend(contact._id)}


                  >
                    Remove
                  </button> */}



                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={async () => {
                      const confirmRemove = window.confirm(
                        `Remove ${contact.fullName} from friends?`
                      );
                      if (!confirmRemove) return;

                      try {
                        await removeFriend(contact._id);
                        toast.success(`${contact.fullName} removed from friends`);
                        // Optionally notify the other user via socket
                        socket?.emit("friendRemoved", { userId: contact._id });
                        fetchFriendData();
                      } catch (err) {
                        toast.error("Failed to remove friend");
                      }
                    }}
                  >
                    Remove Friend
                  </button>
                </>
              )}




              {status.type === "received" && (
                <>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => acceptFriendRequest(status.requestId)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => rejectFriendRequest(status.requestId)}
                  >
                    Reject
                  </button>
                </>
              )}

              {status.type === "sent" && (
                <button className="bg-gray-400 text-white px-3 py-1 rounded" disabled>
                  Pending
                </button>
              )}

              {status.type === "none" && (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => sendFriendRequest(contact._id)}
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ContactList;

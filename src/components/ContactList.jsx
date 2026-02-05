import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { authUser } = useAuthStore();

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
  } = useChatStore();

  useEffect(() => {
    if (!authUser) return;
    getAllContacts();
    fetchFriendData();
  }, [authUser]);

  console.log("CONTACTS:", allContacts);

  const getStatus = (user) => {
    if (friends.some((f) => f._id === user._id)) return { type: "friend" };

    const received = friendRequests.find((r) => r.sender._id === user._id);
    if (received) return { type: "received", requestId: received._id };

    const sent = sentRequests.find((r) => r.receiver._id === user._id);
    if (sent) return { type: "sent" };

    return { type: "none" };
  };

  if (!allContacts.length) {
    return <p className="text-center text-slate-400 mt-4">No contacts found</p>;
  }

  return (
    <>
      {allContacts.map((contact) => {
        const status = getStatus(contact);

        return (
          <div key={contact._id} className="bg-cyan-500/10 p-4 rounded-lg mb-2 flex flex-col">
            <h4 className="font-medium">{contact.fullName}</h4>

            <div className="mt-2 flex gap-2 flex-wrap">
              {status.type === "friend" && (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => setSelectedUser(contact)}
                >
                  Message
                </button>
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

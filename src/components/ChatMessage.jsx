import React from "react";

function ChatMessage({ message, isSender, avatar, name }) {
  console.log("MESSAGE:", message);

  return (
    <div
      className={`flex items-start gap-3 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {/* Receiver avatar */}
      {!isSender && (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={avatar || "/avatar.png"}
            alt={name || "User"}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/avatar.png")}
          />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`px-4 py-2 rounded-lg max-w-xs break-words ${
          isSender ? "bg-blue-500 text-white" : "bg-slate-700 text-white"
        }`}
      >
        {/* TEXT */}
        {message.text && <p>{message.text}</p>}

        {/* IMAGE */}
        {message.fileUrl && message.fileType?.startsWith("image/") && (
          <img
            src={message.fileUrl}
            alt="attachment"
            loading="lazy"
            className="mt-2 rounded max-w-full"
          />
        )}

        {/* VIDEO */}
        {message.fileUrl && message.fileType?.startsWith("video/") && (
          <video
            src={message.fileUrl}
            controls
            className="mt-2 rounded max-w-full"
          />
        )}

        {/* AUDIO */}
        {message.fileUrl && message.fileType?.startsWith("audio/") && (
          <audio
            src={message.fileUrl}
            controls
            className="mt-2 w-full"
          />
        )}

        {/* OTHER FILES */}
        {message.fileUrl &&
          !message.fileType?.startsWith("image/") &&
          !message.fileType?.startsWith("video/") &&
          !message.fileType?.startsWith("audio/") && (
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-blue-300 underline break-all"
            >
              📎 Download file
            </a>
          )}

        {/* TIME */}
        {message.createdAt && (
          <p className="text-xs mt-1 opacity-75">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {/* Sender avatar */}
      {isSender && (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={avatar || "/avatar.png"}
            alt={name || "You"}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/avatar.png")}
          />
        </div>
      )}
    </div>
  );
}
export default ChatMessage ;


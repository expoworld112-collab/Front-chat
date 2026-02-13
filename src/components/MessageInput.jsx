// import useKeyboardSound from "../hooks/useKeyboardSound";
// import { useChatStore } from "../store/useChatStore";
// import { useRef, useState } from "react";
// import toast from "react-hot-toast";
// import { ImageIcon, SendIcon, XIcon } from "lucide-react";
// import { Picker } from "emoji-picker-react";


// function MessageInput() {
//   const { playRandomKeyStrokeSound } = useKeyboardSound();
//   const { sendMessage, isSoundEnabled } = useChatStore();


//   const [text, setText] = useState("");
//   const [showEmoji, setShowEmoji] = useState(false);
//   const [file, setFile] = useState(null);
//   const [filePreview, setFilePreview] = useState(null);

//   const fileInputRef = useRef(null);

// const handleSendMessage = (e) => {
//     e.preventDefault()
//     if (!text.trim() && !file) return;

//     if (isSoundEnabled) playRandomKeyStrokeSound();

//     const messageData = new FormData() ;
//     messageData.append(text.text.trim());
//     if(file)messageData.append("file", file) ;
//     sendMessage = (messageData);
//     setText("");
//     setFile(null);
//     setFilePreview(null);

//     setShowEmoji(false);

//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };



//   const handleEmojiClick = (emojiObject) => {
//     setText((prev) => prev + emojiObject.emoji);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!selected) return ;
//     setFile(selected);

// if(selected.type.startsWith("/image") || selected.type.startsWith("video/")){
//     const reader = new FileReader();
//     reader.onloadend = () => setPreviFileew(reader.result);
//     reader.readAsDataURL(selected);
//   };
//   const removeFile = () => {
//     setFile(null);
//     setFilePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = " ";

//   };
//   const getFileEmoji = (file) => {
//     if (!file) return "📁";
//     if (file.type.startsWith("image/")) return "🖼️" ;
//         if (file.type.startsWith("video/")) return "📽️" ;
//     if (file.type.startsWith("image/")) return "🎵" ;
//     return "📁" ;


//   } ;
//   // return (
//   //   <div className="p-4 border-t border-slate-700/50  releative">
//   //     {filePreview && (
//   //       <div className="max-w-lg mb-3 gap-2 flex items-center">
//   //         <div className="relative">
//   //           <img
//   //             src={filePreview}
//   //             alt="preview"
//   //             className="w-20 h-20 object-cover rounded-lg border-slate-700" />
//   //           <button
//   //             onClick={removeImage}
//   //             className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700" type="button">
//   //             <XIcon className="w-4 h-4" />
//   //           </button>
//   //         </div>
//   //       </div>

//   //     )}
//   //     <div className="flex items-center gap-2 p-2 bg-slate-800 rounded">
//   //       {/* Emoji picker toggle */}
//   //       <button
//   //         type="button"
//   //         onClick={() => setShowEmoji((prev) => !prev)}
//   //         className="text-xl"
//   //       >
//   //         😊
//   //       </button>

//   //       {/* Emoji picker */}
//   //       {showEmoji && (
//   //         <div className="absolute bottom-16 left-4 z-50">
//   //           <Picker onEmojiClick={handleEmojiClick} />
//   //         </div>
//   //       )}
//   //       <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
//   //         <input type="text"
//   //           value={text}
//   //           onChange={(e) => {
//   //             setText(e.target.value);
//   //             isSoundEnabled && playRandomKeyStrokeSound()

//   //           }}
//   //           className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
//   //           placeholder="Type your message ..."
//   //         />
//   //         <input
//   //           type="file"
//   //           accept="image/*"
//   //           ref={fileInputRef}
//   //           onChange={handleImageChange}
//   //           className="hidden"
//   //         />
//   //         <button
//   //           type="button"
//   //           onClick={() => fileInputRef.current?.click()}
//   //           className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4
//   //       transition-colors ${imagePreview ? "text-cyan-500" : ""
//   //             }`}
//   //         >
//   //           <ImageIcon className="w-5 h-5" />
//   //         </button>
//   //         <button type="submit"
//   //           disabled={!text.trim() && !imagePreview}
//   //           className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py  font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-500 disabled:cursor-not-allowed">
//   //           <SendIcon className="w-5 h-5" />
//   //         </button>
//   //       </form>
//   //     </div>
//   //   </div>

//   // );

// return (
//     <div className="p-4 border-t border-slate-700/50 relative">
//       {/* File preview */}
//       {filePreview && (
//         <div className="flex items-center mb-2 gap-2 max-w-lg">
//           <div className="relative">
//             {file.type.startsWith("image/") ? (
//               <img src={filePreview} alt="preview" className="w-20 h-20 object-cover rounded" />
//             ) : file.type.startsWith("video/") ? (
//               <video src={filePreview} className="w-32 h-20 rounded" controls />
//             ) : null}
//             <button
//               onClick={removeFile}
//               className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
//             >
//               <XIcon className="w-4 h-4" />
//             </button>
//           </div>
//           <span className="text-sm text-gray-300 truncate">{file.name}</span>
//         </div>
//       )}

//       {/* Emoji Picker */}
//       {showEmoji && (
//         <div className="absolute bottom-16 left-4 z-50">
//           <Picker onEmojiClick={handleEmojiClick} />
//         </div>
//       )}

//       <form onSubmit={handleSendMessage} className="flex items-center gap-2">
//         {/* Emoji Button */}
//         <button
//           type="button"
//           onClick={() => setShowEmoji((prev) => !prev)}
//           className="text-xl"
//         >
//           😊
//         </button>

//         {/* Message input */}
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => {
//             setText(e.target.value);
//             if (isSoundEnabled) playRandomKeyStrokeSound();
//           }}
//           placeholder="Type a message..."
//           className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
//         />

//         {/* File upload button */}
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           className="hidden"
//         />
//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors`}
//         >
//           {getFileEmoji(file)}
//         </button>

//         {/* Send button */}
//         <button
//           type="submit"
//           disabled={!text.trim() && !file}
//           className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <SendIcon className="w-5 h-5" />
//         </button>
//       </form>
//     </div>
//   );
// }
// }
// export default MessageInput ;
import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { SendIcon, XIcon } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const { sendMessage, isSoundEnabled , selectedUser} = useChatStore();

  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    if (isSoundEnabled) playRandomKeyStrokeSound();
    const formData = new FormData();
    formData.append("text", text.trim());
    if (file) formData.append("file", file);

    await sendMessage(selectedUser._id, formData);



    setText("");
    setFile(null);
    setFilePreview(null);
    setShowEmoji(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    // Preview for images/videos
    if (selected.type.startsWith("image/") || selected.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileEmoji = (file) => {
    if (!file) return "📎";
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.startsWith("video/")) return "🎬";
    if (file.type.startsWith("audio/")) return "🎵";
    return "📎";
  };

  return (
    <div className="p-4 border-t border-slate-700/50 relative">
      {/* File preview */}
      {filePreview && (
        <div className="flex items-center mb-2 gap-2 max-w-lg">
          <div className="relative">
            {file.type.startsWith("image/") ? (
              <img src={filePreview} alt="preview" className="w-20 h-20 object-cover rounded" />
            ) : file.type.startsWith("video/") ? (
              <video src={filePreview} className="w-32 h-20 rounded" controls />
            ) : null}
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-300 truncate">{file.name}</span>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmoji((prev) => !prev)}
          className="text-xl"
        >
          😊
        </button>

        {/* Message input */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (isSoundEnabled) playRandomKeyStrokeSound();
          }}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
        />

        {/* File upload button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors`}
        >
          {getFileEmoji(file)}
        </button>

        {/* Send button */}
        <button
          type="submit"
          disabled={!text.trim() && !file}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;

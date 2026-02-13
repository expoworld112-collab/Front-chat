// import {useState , useRef} from "react" ;
// import {LogOutIcon , VolumeOffIcon , Volume2Icon } from "lucide-react" ;
// import {useAuthStore} from "../store/useAuthStore.js" ;
// import {useChatStore} from "../store/useChatStore.js" ;
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios.js";

// const mouseClickSound = new Audio ("/sounds/mouse-click.mp3");
//  function ProfileHeader() {
//   const {logout , authUser , updateProfile} = useAuthStore();
//   const {isSoundEnabled , toggleSound} = useChatStore();
//   const [selectedImg , setSelectedImg] = useState(null);
//   const fileInputRef = useRef(null) ;
//   const handleImageUpload =(e) => {
//     const file = e.target.files [0] 
//     if(!file) return
//     const  reader = new FileReader()
//     reader.readAsDataURL(file)
//     reader.onloadend = async  () => {
//       const base64Image = reader.result
//       setSelectedImg(base64Image)
//       await updateProfile({profilePic: base64Image});
//     };
//   };
//   return (
//     <div className=" p-6 border-b border-slate-700/50 " >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/*AVATAR */}
//           <div className="avatar online">
//             <button className="size-14 rounded-full overflow-hidden relative group"
//             onClick={( ) => fileInputRef.current.click()}>
//               <img src={selectedImg || authUser.profilePic || "/avatar.png"} alt = "User image" 
//               className="size-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
//                <span className="text-white text-xs">Change</span>
//               </div>
           
//             </button>
//             <input type = "file"
//             accept= "image/*"
//            ref={fileInputRef}
//            onChange={handleImageUpload}
//            className="hidden" />

//             </div>
//             {/*USERNAME & ONLINETEXT*/}
//             <div>
//               <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate ">
//                 {authUser.fullName }
//               </h3>
//               <p className="text-slate-400 text-xs">Online</p>
//             </div>
//         </div>
//         {/*BUTTONS */}
//         <div className="flex gap-4 items-center">
//           {/*Logout btn */} 
//           <button className="text-slate-400 hover:text-slate-200 transition-colors"
//           onClick={logout} >
//             <LogOutIcon className="size-5"/>
//           </button>
//           {/*SOUND TOGGLEBTN */}
//           <button className="text-slate-400 hover:text-slate-200 transition-colors"
//         onClick={() => {
//           mouseClickSound.currentTime =0;
//           mouseClickSound.play().catch((error) => console.log("Audio play failed:" , error));
//           toggleSound();
//         }} >
//           {isSoundEnabled ? (
//             <Volume2Icon className="size-5"/> ) : (
//               <VolumeOffIcon className="size-5" />
//             )}
          
//         </button>  
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileHeader



//updates after feature2


/////////////////////////////////
import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { authUser, setAuthUser, logout, socket } = useAuthStore();
  const { isSoundEnabled, toggleSound, fetchFriendData } = useChatStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  if (!authUser) return null;

  // Handle profile pic upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      const formData = new FormData();
      formData.append("profilePic", file);

      try {
        const res = await axiosInstance.put("/users/profile-pic", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Update local auth user
        setAuthUser({ ...authUser, profilePic: res.data.profilePic });

        // Notify friends via socket
        socket?.emit("profileUpdated", {
          userId: authUser._id,
          profilePic: res.data.profilePic,
        });

        // Refresh contacts/friends
        fetchFriendData();

        toast.success("Profile picture updated!");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to update profile pic");
      }
    };
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar online">
            <button
              className="w-14 h-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Username and online status */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          {/* Logout */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="w-5 h-5" />
          </button>

          {/* Sound toggle */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((e) => console.log("Audio play failed", e));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="w-5 h-5" />
            ) : (
              <VolumeOffIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;

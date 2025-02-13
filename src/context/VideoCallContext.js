// /* eslint-disable react/prop-types */
// import { createContext, useContext, useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// const VideoCallContext = createContext();

// export const VideoCallProvider = ({ children }) => {
//   const socket = useRef(io("http://localhost:5000"));
//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const peerConnection = useRef(null);

//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(true);

//   useEffect(() => {
//     const setupMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStreamRef.current = stream;
//       } catch (error) {
//         console.error("Error accessing media devices", error);
//       }
//     };

//     setupMedia();

//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   const toggleMute = () => {
//     localStreamRef.current
//       ?.getAudioTracks()
//       .forEach((track) => (track.enabled = !track.enabled));
//     setIsMuted(!isMuted);
//   };

//   const toggleVideo = () => {
//     localStreamRef.current
//       ?.getVideoTracks()
//       .forEach((track) => (track.enabled = !track.enabled));
//     setIsVideoOn(!isVideoOn);
//   };

//   return (
//     <VideoCallContext.Provider
//       value={{ localStreamRef, remoteStreamRef, socket, peerConnection, isMuted, isVideoOn, toggleMute, toggleVideo }}
//     >
//       {children}
//     </VideoCallContext.Provider>
//   );
// };

// export const useVideoCall = () => useContext(VideoCallContext);

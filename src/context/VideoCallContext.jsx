import { createContext, useState, useRef } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const startVideo = async () => {
    try {
      if (!stream) {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(newStream);
        if (videoRef.current) videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    } 
  };

  return (
    <VideoContext.Provider value={{ stream, startVideo, stopVideo, videoRef }}>
      {children}
    </VideoContext.Provider>
  );
};

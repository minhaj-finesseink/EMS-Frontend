import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../socket";
import { motion } from "framer-motion";
import micIcon from "../../../../assets/Icons/mic-icon.svg";
import micMuteIcon from "../../../../assets/Icons/mic-mute.svg";
import videoIcon from "../../../../assets/Icons/camera video.svg";
import videoOffIcon from "../../../../assets/Icons/camera video-silent.svg";
import arrowUpIcon from "../../../../assets/Icons/arrow up.svg";
import handRaiseIcon from "../../../../assets/Icons/hand raise.svg";
import emojiIcon from "../../../../assets/Icons/emoji.svg";
import chatIcon from "../../../../assets/Icons/chat.svg";
import AIIcon from "../../../../assets/Icons/AI Generate.svg";
import crossIcon from "../../../../assets/Icons/cross.svg";
import "./style.css";

const iceServers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    {
      urls: "turn:relay.metered.ca:80",
      username: "free",
      credential: "free",
    },
  ],
};

const MeetingRoom = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name") || "Guest";

  const videoOn = urlParams.get("video") === "true";
  const audioOn = urlParams.get("audio") === "true";

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoOn, // ✅ Use setting from URL
          audio: audioOn, // ✅ Use setting from URL
        });

        // ✅ Ensure initial mute state is applied
        stream.getVideoTracks().forEach((track) => (track.enabled = videoOn));
        stream.getAudioTracks().forEach((track) => (track.enabled = audioOn));

        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        socket.emit("join-meeting", { meetingId, name });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    startVideo();

    socket.on("user-joined", async (userId) => {
      console.log(`User joined: ${userId}`);

      if (peerConnectionsRef.current[userId]) return;

      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionsRef.current[userId] = peerConnection;

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });

      peerConnection.ontrack = (event) => {
        console.log(`Received remote stream from ${userId}`);
        setRemoteStreams((prevStreams) => ({
          ...prevStreams,
          [userId]: event.streams[0],
        }));
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            to: userId,
          });
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("offer", { offer, to: userId });
    });

    socket.on("offer", async ({ offer, from }) => {
      console.log(`Received offer from ${from}`);

      if (!peerConnectionsRef.current[from]) {
        peerConnectionsRef.current[from] = new RTCPeerConnection(iceServers);
      }

      const peerConnection = peerConnectionsRef.current[from];

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });

      peerConnection.ontrack = (event) => {
        console.log(`Received remote stream from ${from}`);
        setRemoteStreams((prevStreams) => ({
          ...prevStreams,
          [from]: event.streams[0],
        }));
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            to: from,
          });
        }
      };

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answer", { answer, to: from });
    });

    socket.on("answer", async ({ answer, from }) => {
      console.log(`Received answer from ${from}`);

      if (!peerConnectionsRef.current[from]) return;

      await peerConnectionsRef.current[from].setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      console.log(`Received ICE candidate from ${from}`);

      if (!peerConnectionsRef.current[from]) return;

      await peerConnectionsRef.current[from].addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    socket.on("user-left", (userId) => {
      console.log(`User left: ${userId}`);

      if (peerConnectionsRef.current[userId]) {
        peerConnectionsRef.current[userId].close();
        delete peerConnectionsRef.current[userId];
      }

      // ✅ Remove the user’s video from the UI
      setRemoteStreams((prevStreams) => {
        const updatedStreams = { ...prevStreams };
        delete updatedStreams[userId];
        return updatedStreams;
      });
    });

    return () => {
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      socket.emit("leave-meeting", { meetingId, name });
    };
  }, [meetingId]);

  // ✅ NEW FUNCTION: Leaves the Meeting without Ending It for Others
  const leaveMeeting = () => {
    console.log("Leaving meeting...");

    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // ✅ Notify others that this participant has left
    socket.emit("leave-meeting", { meetingId, userId: socket.id });

    // ✅ Remove the current user’s video from the UI
    setRemoteStreams((prevStreams) => {
      const updatedStreams = { ...prevStreams };
      console.log("updatedStreams", updatedStreams);
      delete updatedStreams[socket.id];
      return updatedStreams;
    });

    navigate("/lobby");
  };

  // 🎤 Toggle Audio (Mute/Unmute)
  const toggleAudio = () => {
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsAudioEnabled(!isAudioEnabled);
  };

  // 📹 Toggle Video (On/Off)
  const toggleVideo = () => {
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoEnabled(!isVideoEnabled);
  };

  // 🖥️ Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const sender = Object.values(peerConnectionsRef.current)[0]
          ?.getSenders()
          .find((s) => s.track.kind === "video");
        sender?.replaceTrack(screenStream.getVideoTracks()[0]);

        setIsScreenSharing(true);
        screenStream.getVideoTracks()[0].onended = () => {
          sender?.replaceTrack(localStreamRef.current.getVideoTracks()[0]);
          setIsScreenSharing(false);
        };
      } catch (error) {
        console.error("Error accessing screen share:", error);
      }
    }
  };

  const meetingAction = [
    {
      icon: isAudioEnabled ? micIcon : micMuteIcon,
      text: isAudioEnabled ? "Mute" : "Unmute",
      backgroundColor: "#272A32",
      onClick: toggleAudio,
    },
    {
      icon: isVideoEnabled ? videoIcon : videoOffIcon,
      text: isVideoEnabled ? "Stop video" : "Start video",
      backgroundColor: "#272A32",
      onClick: toggleVideo,
    },
    {
      icon: arrowUpIcon,
      text: isScreenSharing ? "Stop" : "Share",
      backgroundColor: "#009A4E",
      onClick: toggleScreenShare,
    },
    {
      icon: handRaiseIcon,
      text: "Hand raise",
      backgroundColor: "#272A32",
    },
    {
      icon: emojiIcon,
      text: "Reaction",
      backgroundColor: "#272A32",
    },
    {
      icon: chatIcon,
      text: "Chat",
      backgroundColor: "#272A32",
    },
    {
      icon: AIIcon,
      text: "AI",
      backgroundColor: "#272A32",
    },
    {
      icon: crossIcon,
      text: "End meeting",
      backgroundColor: "#ED1C24",
      onClick: leaveMeeting,
    },
  ];

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* <h2>Meeting ID: {meetingId}</h2>
      <h3>Welcome, {name}!</h3> */}
      <div>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "45%", border: "2px solid white" }}
        />
        {Object.entries(remoteStreams).map(([userId, stream]) => (
          <video
            key={userId}
            autoPlay
            playsInline
            style={{ width: "45%", border: "2px solid red" }}
            ref={(video) => {
              if (video && stream) {
                video.srcObject = stream;
              }
            }}
          />
        ))}
      </div>

      <div className="meeting-actions-container">
        {meetingAction.map((item, index) => (
          <motion.div
            key={index}
            className="video-home-menu"
            // whileTap={{ scale: 0.9 }} // Slight press-down effect
            whileHover={{ scale: 1.1 }} // Slight hover effect
            animate={{ opacity: 1, y: [5, 0] }} // Small bounce effect
            transition={{ type: "spring", stiffness: 300 }}
            onClick={item.onClick}
          >
            <div
              className="video-menu"
              style={{ backgroundColor: item.backgroundColor }}
            >
              <img src={item.icon} alt={`${item.text} icon`} />
            </div>
            <div style={{ marginTop: "10px" }}>{item.text}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MeetingRoom;

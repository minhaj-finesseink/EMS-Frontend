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
import recordIcon from "../../../../assets/Icons/record-icon.svg";
import recordRedIcon from "../../../../assets/Icons/record-icon-red.svg";
import pauseIcon from "../../../../assets/Icons/pause-icon.svg";
import mediaStopIcon from "../../../../assets/Icons/media-stop-icon.svg";
import infoIcon from "../../../../assets/Icons/information-icon.svg";
import gridIcon from "../../../../assets/Icons/grid-icon.svg";
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

  const [remoteUsers, setRemoteUsers] = useState({});
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoOn,
          audio: audioOn,
        });

        stream.getVideoTracks().forEach((track) => (track.enabled = videoOn));
        stream.getAudioTracks().forEach((track) => (track.enabled = audioOn));

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        } else {
          console.warn("⚠️ localVideoRef.current is NULL");
        }

        socket.emit("join-meeting", { meetingId, name });
      } catch (error) {
        console.error("❌ Error accessing media devices:", error);
      }
    };

    startVideo();

    socket.on("user-joined", async (userId) => {
      // console.log(`User joined: ${userId}`);

      if (peerConnectionsRef.current[userId]) return;

      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionsRef.current[userId] = peerConnection;

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });

      // peerConnection.ontrack = (event) => {
      //   console.log(`Received remote stream from ${userId}`);
      //   setRemoteStreams((prevStreams) => ({
      //     ...prevStreams,
      //     [userId]: event.streams[0],
      //   }));
      // };

      peerConnection.ontrack = (event) => {
        console.log(`Received remote stream from ${userId}`);

        const stream = event.streams[0];

        // Check if video track exists and is enabled
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack && !videoTrack.enabled) {
          console.log(`User ${userId} turned off their camera`);
          setRemoteStreams((prevStreams) => ({
            ...prevStreams,
            [userId]: "hidden", // ✅ Mark as hidden to show initials
          }));
        } else {
          setRemoteStreams((prevStreams) => ({
            ...prevStreams,
            [userId]: stream, // ✅ Keep video stream if video is ON
          }));
        }
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
      // console.log(`Received offer from ${from}`);

      if (!peerConnectionsRef.current[from]) {
        peerConnectionsRef.current[from] = new RTCPeerConnection(iceServers);
      }

      const peerConnection = peerConnectionsRef.current[from];

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });

      peerConnection.ontrack = (event) => {
        // console.log(`Received remote stream from ${from}`);
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
      // console.log(`Received answer from ${from}`);

      if (!peerConnectionsRef.current[from]) return;

      await peerConnectionsRef.current[from].setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice-candidate", async ({ candidate, from }) => {
      // console.log(`Received ICE candidate from ${from}`);

      if (!peerConnectionsRef.current[from]) return;

      await peerConnectionsRef.current[from].addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    socket.on("user-left", (userId) => {
      // console.log(`User left: ${userId}`);

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

  useEffect(() => {
    socket.on("toggle-video", ({ from, isVideoEnabled }) => {
      setRemoteStreams((prevStreams) => {
        if (isVideoEnabled) {
          return {
            ...prevStreams,
            [from]: peerConnectionsRef.current[from]
              ?.getReceivers()
              .find((r) => r.track?.kind === "video")?.track
              ? new MediaStream([
                  peerConnectionsRef.current[from]
                    .getReceivers()
                    .find((r) => r.track?.kind === "video")?.track,
                ])
              : prevStreams[from], // Restore if video track exists
          };
        } else {
          return { ...prevStreams, [from]: "video-off" }; // Mark as "video-off"
        }
      });
    });

    return () => {
      socket.off("toggle-video");
    };
  }, []);

  useEffect(() => {
    socket.on("toggle-audio", ({ from, isAudioEnabled }) => {
      setRemoteUsers((prev) => ({
        ...prev,
        [from]: { ...(prev[from] || {}), isAudioEnabled },
      }));
    });

    return () => {
      socket.off("toggle-audio");
    };
  }, []);

  // ✅ NEW FUNCTION: Leaves the Meeting without Ending It for Others
  const leaveMeeting = () => {
    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // ✅ Notify others that this participant has left
    socket.emit("leave-meeting", { meetingId, userId: socket.id });

    // ✅ Remove the current user’s video from the UI
    setRemoteStreams((prevStreams) => {
      const updatedStreams = { ...prevStreams };
      // console.log("updatedStreams", updatedStreams);
      delete updatedStreams[socket.id];
      return updatedStreams;
    });

    navigate("/lobby");
  };

  // 🎤 Toggle Audio (Mute/Unmute)
  // const toggleAudio = () => {
  //   localStreamRef.current.getAudioTracks().forEach((track) => {
  //     track.enabled = !track.enabled;
  //   });
  //   setIsAudioEnabled(!isAudioEnabled);
  // };

  const toggleAudio = () => {
    const newAudioState = !isAudioEnabled;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = newAudioState;
    });

    setIsAudioEnabled(newAudioState);

    // Notify server to update other participants
    socket.emit("toggle-audio", { meetingId, isAudioEnabled: newAudioState });
  };

  // 📹 Toggle Video (On/Off)
  const toggleVideo = async () => {
    if (isVideoEnabled) {
      localStreamRef.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = false));
      setIsVideoEnabled(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        localStreamRef.current
          .getVideoTracks()
          .forEach((track) => track.stop());
        localStreamRef.current = newStream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
          setTimeout(() => {
            localVideoRef.current.srcObject = newStream;
          }, 100);
        }

        Object.values(peerConnectionsRef.current).forEach((peerConnection) => {
          const sender = peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(newStream.getVideoTracks()[0]);
          }
        });

        setIsVideoEnabled(true);
      } catch (error) {
        console.error("❌ Error restarting video:", error);
      }
    }

    // ✅ Emit event to notify others
    socket.emit("toggle-video", { meetingId, isVideoEnabled: !isVideoEnabled });
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    } else {
      console.warn("⚠️ localVideoRef.current is NULL");
    }
  }, [isVideoEnabled]);

  // 🖥️ Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // 🔴 Stop screen sharing properly
      let tracks = localStreamRef.current?.getTracks();
      if (tracks) {
        tracks.forEach(track => track.stop()); // Stop all tracks
      }
  
      // 🟢 Switch back to camera stream
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      localStreamRef.current = newStream;
  
      // 🔄 Update local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }
  
      // 🔄 Replace the screen track with the camera video track for remote participants
      Object.values(peerConnectionsRef.current).forEach(peerConnection => {
        const sender = peerConnection.getSenders().find(s => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(newStream.getVideoTracks()[0]);
        }
      });
  
      setIsScreenSharing(false);
    } else {
      try {
        // 🟢 Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  
        // 🔄 Replace the local stream with screen sharing stream
        localStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
  
        // 🔄 Replace video track for remote participants
        Object.values(peerConnectionsRef.current).forEach(peerConnection => {
          const sender = peerConnection.getSenders().find(s => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });
  
        setIsScreenSharing(true);
  
        // 🔴 Stop sharing when user clicks browser's stop button
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      } catch (error) {
        console.error("Error starting screen share:", error);
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
      backgroundColor: isScreenSharing ? "#ED1C24" : "#009A4E",
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

  const participants = Object.values(remoteStreams);
  const totalParticipants = participants.length + 1; // Including self

  console.log("remoteStreams", remoteStreams);

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        padding: "0 20px",
      }}
    >
      <div className="video-home-header">
        <div style={{ width: "150px" }}>
          <motion.div
            className="video-record-container"
            onClick={handleRecordClick}
            animate={{ width: isRecording ? 150 : 100 }}
            transition={{
              duration: 0.6,
              // ease: "easeOut",
              stiffness: 500, // More bounce effect
              damping: 15, // Controls how fast it settles
              type: "spring",
            }}
          >
            <div className="video-record">
              <img
                src={isRecording ? recordRedIcon : recordIcon}
                alt="record icon"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isRecording ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {" "}
                    <span>{"00:00"}</span>{" "}
                    <img src={pauseIcon} alt="pause icon" />
                    <img src={mediaStopIcon} alt="media stop icon" />
                  </div>
                ) : (
                  "Record"
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="video-header-title-container">
          <div className="video-header-title">Quaterly planning meeting</div>
          <div className="video-header-time">10:36 pm</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={infoIcon} alt="info icon" />{" "}
            <span style={{ fontWeight: 500 }}>Meeting Agenda</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={gridIcon} alt="grid icon" />{" "}
            <span style={{ fontWeight: 500 }}>Layouts</span>
          </div>
        </div>
      </div>

      <div
        className={`video-container grid-${
          totalParticipants > 6 ? "more" : totalParticipants
        }`}
      >
        <div className="video-wrapper">
          {isVideoEnabled ? (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="video-preview"
              />
              <p>You</p>{" "}
            </>
          ) : (
            <div className="lobby-video-placeholder">
              <div className="lobby-video-initials">MM</div>
            </div>
          )}
        </div>
        {/* {Object.entries(remoteStreams).map(([userId, stream]) => (
          <div key={userId} className="video-wrapper">
            <video
              autoPlay
              playsInline
              className="video-preview"
              ref={(video) => video && (video.srcObject = stream)}
            />
            <p>{userId}</p>
          </div>
        ))} */}

        {/* Show Screen Share Locally */}
        {/* {isScreenSharing && remoteStreams.screen && (
          <div className="video-wrapper">
            <video
              autoPlay
              playsInline
              className="video-preview"
              ref={(video) => {
                if (video) video.srcObject = remoteStreams.screen;
              }}
            />
            <p>Screen Sharing</p>
          </div>
        )} */}

        {/* <div className="video-container"> */}
        {Object.entries(remoteStreams).map(([userId, stream]) => (
          <div key={userId} className="video-wrapper">
            {stream === "video-off" ? ( // Show initials if video is off
              <div className="lobby-video-placeholder">
                <div className="lobby-video-initials">
                  {userId.slice(0, 2).toUpperCase()}{" "}
                </div>
              </div>
            ) : (
              <video
                autoPlay
                playsInline
                // className="video-preview"
                className={`video-preview ${stream.isScreenShare ? "screen-share" : ""}`} 
                ref={(video) => video && (video.srcObject = stream)}
                style={{}}
              />
            )}
            <p>{userId}</p>
          </div>
        ))}
        {/* </div> */}
      </div>

      <div className="meeting-actions-container">
        {meetingAction.map((item, index) => (
          <motion.div
            key={index}
            className="video-home-menu"
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

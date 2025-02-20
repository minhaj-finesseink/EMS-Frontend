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

  const [isRecording, setIsRecording] = useState(false);

  const [participantsInfo, setParticipantsInfo] = useState({});

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("join-meeting", { meetingId, name });
        // ✅ Instantly disable video/audio based on URL params
        if (!videoOn) toggleVideo();
        if (!audioOn) toggleAudio();

        socket.on("user-joined", async (userId) => {
          if (peerConnectionsRef.current[userId]) return;

          const peerConnection = new RTCPeerConnection(iceServers);
          peerConnectionsRef.current[userId] = peerConnection;

          // Add only audio and video tracks once
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
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
          if (!peerConnectionsRef.current[from]) {
            peerConnectionsRef.current[from] = new RTCPeerConnection(
              iceServers
            );
          }

          const peerConnection = peerConnectionsRef.current[from];

          stream.getTracks().forEach((track) => {
            if (!peerConnection.getSenders().some((s) => s.track === track)) {
              peerConnection.addTrack(track, stream);
            }
          });

          peerConnection.ontrack = (event) => {
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
          if (!peerConnectionsRef.current[from]) return;
          await peerConnectionsRef.current[from].setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        });

        socket.on("ice-candidate", async ({ candidate, from }) => {
          if (!peerConnectionsRef.current[from]) return;
          await peerConnectionsRef.current[from].addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        });

        socket.on("user-left", (userId) => {
          if (peerConnectionsRef.current[userId]) {
            peerConnectionsRef.current[userId].close();
            delete peerConnectionsRef.current[userId];
          }

          setRemoteStreams((prevStreams) => {
            const updatedStreams = { ...prevStreams };
            delete updatedStreams[userId];
            return updatedStreams;
          });
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    startMedia();

    return () => {
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      socket.emit("end-meeting", { meetingId, name });
    };
  }, [meetingId]);

  const toggleVideo = () => {
    const newVideoState = !isVideoEnabled;
    localStreamRef.current
      .getVideoTracks()
      .forEach((track) => (track.enabled = newVideoState));
    setIsVideoEnabled(newVideoState);
    socket.emit("toggle-video", { meetingId, isVideoEnabled: newVideoState });
  };

  const toggleAudio = () => {
    const newAudioState = !isAudioEnabled;
    localStreamRef.current
      .getAudioTracks()
      .forEach((track) => (track.enabled = newAudioState));
    setIsAudioEnabled(newAudioState);
    socket.emit("toggle-audio", { meetingId, isAudioEnabled: newAudioState });
  };

  useEffect(() => {
    socket.on("update-participants", (updatedParticipants) => {
      console.log("Updated Participants Info:", updatedParticipants);
      setParticipantsInfo(updatedParticipants);
    });

    return () => {
      socket.off("update-participants");
    };
  }, []);

  // 🖥️ Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // 🔴 Stop screen sharing properly
      let tracks = localStreamRef.current?.getTracks();
      if (tracks) {
        tracks.forEach((track) => track.stop()); // Stop all tracks
      }

      // 🟢 Switch back to camera stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      localStreamRef.current = newStream;

      // 🔄 Update local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }

      // 🔄 Replace the screen track with the camera video track for remote participants
      Object.values(peerConnectionsRef.current).forEach((peerConnection) => {
        const sender = peerConnection
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(newStream.getVideoTracks()[0]);
        }
      });

      setIsScreenSharing(false);
      socket.emit("toggle-screen", { meetingId, isScreenSharing: false });
      setIsVideoEnabled(false);
      socket.emit("toggle-video", {
        meetingId,
        isVideoEnabled: false,
      });
    } else {
      try {
        // 🟢 Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // 🔄 Replace the local stream with screen sharing stream
        localStreamRef.current = screenStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        // 🔄 Replace video track for remote participants
        Object.values(peerConnectionsRef.current).forEach((peerConnection) => {
          const sender = peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });

        setIsScreenSharing(true);
        socket.emit("toggle-screen", { meetingId, isScreenSharing: true });
        setIsVideoEnabled(true);
        socket.emit("toggle-video", {
          meetingId,
          isVideoEnabled: true,
        });

        // 🔴 Stop sharing when user clicks browser's stop button
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      } catch (error) {
        console.error("Error starting screen share:", error);
      }
    }
  };

  const endMeeting = () => {
    socket.emit("end-meeting", { meetingId });
    navigate("/video-dashboard");
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    } else {
      // console.warn("⚠️ localVideoRef.current is NULL");
    }
  }, [isVideoEnabled]);

  const handleRecordClick = () => {
    setIsRecording(!isRecording);
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
      onClick: endMeeting,
    },
  ];

  const screenSharingUser = Object.entries(participantsInfo).find(
    ([, participant]) => participant.isScreenSharing
  );

  return (
    <div className="meeting-room">
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
        className="video-container"
        style={{
          gridTemplateColumns:
            Object.keys(participantsInfo).length <= 2
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
        }}
      >
        <div className="video-wrapper">
          {isVideoEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              // className="video-preview"
              className={`video-preview ${
                isScreenSharing ? "screen-share-mode" : ""
              }`}
            />
          ) : (
            <div className="room-video-placeholder">
              <div className="room-video-initials">
                {name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {Object.entries(remoteStreams).map(([userId, stream]) => {
          const isVideoEnabled = participantsInfo[userId]?.isVideoEnabled;
          const isScreenSharing = participantsInfo[userId]?.isScreenSharing;
          console.log("isScreenSharing", isScreenSharing);

          return (
            <div key={userId} className="video-wrapper">
              <video
                autoPlay
                playsInline
                ref={(video) => {
                  if (video && stream && video.srcObject !== stream) {
                    video.srcObject = stream;
                  }
                }}
                // className="video-preview"
                // className={`video-preview ${
                //   !isVideoEnabled ? "hidden-video" : ""
                // }`}
                className={`video-preview ${
                  isScreenSharing ? "screen-share-mode" : ""
                } ${!isVideoEnabled ? "hidden-video" : ""}`}
              />
              {!isVideoEnabled && (
                <div className="room-video-placeholder">
                  <div className="room-video-initials">
                    {participantsInfo[userId]?.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              )}
              <div className="participants-name-icon">
                <p>{participantsInfo[userId]?.name}</p>
                <div>
                  <img
                    src={
                      participantsInfo[userId]?.isAudioEnabled
                        ? micIcon
                        : micMuteIcon
                    }
                    alt="mic icon"
                  />
                </div>
              </div>
            </div>
          );
        })}
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

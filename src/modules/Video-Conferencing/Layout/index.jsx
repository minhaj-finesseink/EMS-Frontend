/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MathfieldElement } from "mathlive";
import RoomSideBar from "./RoomSidebar";
import RoomHeader from "./RoomHeader";
import RoomFooter from "./RoomFooter";
import micIcon from "../../../assets/Icons/mic-icon.svg";
import micMuteIcon from "../../../assets/Icons/mic-mute.svg";
import socket from "../socket";
import { useNavigate, useParams } from "react-router-dom";
import { CloseOutlined, ExpandAltOutlined } from "@ant-design/icons";
import ParticipantsDrawer from "./ParticipantsDrawer";
import InviteDrawer from "./InviteDrawer";
import Breakout from "./BreakoutModal";
import PluginDrawer from "./PluginDrawer";
import SettingsModal from "./SettingsModal";
import handIcon from "../../../assets/NewIcons/hand-3.svg";
import HostControl from "./HostControlDrawer";
import ChatDrawer from "./ChatDrawer";
import NoteTakerIcon from "../../../assets/NewIcons/note-taker.svg";
import ArrowIcon from "../../../assets/NewIcons/arrow-icon.svg";
import ExpandIcon from "../../../assets/NewIcons/expand.svg";
import MeetingAgenda from "./MeetingAgenda";
import useRecordFunctions from "./Recording";
import "./style.css";
import CodeEditor from "./CodeEditor";

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

function Layout(props) {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name") || "Guest";
  const videoOn = urlParams.get("video") === "true";
  const audioOn = urlParams.get("audio") === "true";

  const [movedItem, setMovedItem] = useState(null); // ✅ Only store one item
  const [currentPage, setCurrentPage] = useState(1);

  // Room buttons control
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [caption, setCaption] = useState(false);
  const [activeReactions, setActiveReactions] = useState({});
  const [chat, setChat] = useState(false);
  const [isAIEnable, setIsAIEnabled] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState([]);
  const [participantsInfo, setParticipantsInfo] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const remoteUserCount = Object.keys(remoteUsers).length;
  const count = 1 + remoteUserCount;

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isBreakoutOpen, setIsbreakoutOpen] = useState(false);
  const [isPluginOpen, setIsPluginOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHostControlOpen, setIsHostControlOpen] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [isOpenAgenda, setIsOpenAgenda] = useState(false);

  const [isManuallyUnpinned, setIsManuallyUnpinned] = useState(false);
  const [hostData, setHostData] = useState(null);
  const [showFooter, setShowFooter] = useState(true);
  const [isInvitePopover, setIsInvitePopover] = useState(true);

  // Plugins
  const [openMathEditor, setOpenMathEditor] = useState(false);
  const [openCodeEditor, setOpenCodeEditor] = useState(false);

  // math live
  const mathFieldRef = useRef();

  useEffect(() => {
    if (!customElements.get("math-field")) {
      customElements.define("math-field", MathfieldElement);
    }
  }, []);

  // Screen recording
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const { startRecording, stopRecording, startTimer, stopTimer } =
    useRecordFunctions();

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
            // console.log(`Received remote stream from ${userId}`);
            setRemoteUsers((prevStreams) => ({
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
            setRemoteUsers((prevStreams) => ({
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

          setRemoteUsers((prevStreams) => {
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

  // Toggle hand raise
  const toggleHandRaise = () => {
    const newHandRaiseState = !isHandRaised;
    setIsHandRaised(newHandRaiseState);

    // Emit event to notify other participants
    socket.emit("hand-raised", { meetingId, isHandRaised: newHandRaiseState });
  };

  // 🟢 Listen for incoming reactions
  useEffect(() => {
    socket.on("reaction", ({ name, reaction }) => {
      setActiveReactions((prev) => {
        const userReactions = prev[name] || [];
        return {
          ...prev,
          [name]: [...userReactions, { reaction, id: Date.now() }], // Keep track of multiple reactions
        };
      });

      // ⏳ Auto-hide the reaction after 5 seconds
      setTimeout(() => {
        setActiveReactions((prev) => {
          const userReactions = prev[name] || [];
          return {
            ...prev,
            [name]: userReactions.slice(1), // Remove the oldest reaction first
          };
        });
      }, 5000);
    });

    return () => {
      socket.off("reaction");
    };
  }, []);

  useEffect(() => {
    socket.on("update-participants", (updatedParticipants) => {
      // console.log("Updated Participants Info:", updatedParticipants);
      setParticipantsInfo(updatedParticipants);
    });

    return () => {
      socket.off("update-participants");
    };
  }, []);

  const itemsPerPage = 15;
  const totalPages = Math.ceil((count - 1) / itemsPerPage);

  const remoteUsersArray = Object.entries(remoteUsers).map(
    ([userId, stream]) => {
      const participant = participantsInfo?.[userId] || {}; // Get participant info safely

      return {
        id: userId,
        name: participant.name || `User ${userId.substring(0, 5)}`, // Use actual name if available
        stream: stream,
        isVideoEnabled: participant.isVideoEnabled,
        isAudioEnabled: participant.isAudioEnabled,
        isScreenSharing: participant.isScreenSharing
          ? participant.isScreenSharing
          : false,
        isHandRaised: participant.isHandRaised,
        isNoteTakerEnabled: participant.isNoteTakerEnabled,
      };
    }
  );

  const allUsers = [
    {
      id: "self",
      name: name, // Use name from URL params
      isVideoEnabled,
      isAudioEnabled,
      isScreenSharing,
      isNoteTakerEnabled: isAIEnable,
      stream: localStreamRef.current,
    },
    ...remoteUsersArray,
  ];

  const getGridTemplate = () => {
    if (count === 1)
      return { gridTemplateColumns: "1fr", width: "55%", margin: "0 auto" };
    if (count === 2) return { gridTemplateColumns: "1fr 1fr" };
    if (count === 3)
      return { gridTemplateColumns: "1fr 1fr 1fr", margin: "100px 0" };
    if (count === 4)
      return {
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        margin: "0 150px",
      };
    if (count === 5)
      return {
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      };
    if (count === 6)
      return {
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      };
    if (count === 7)
      return {
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      };
    if (count === 8)
      return {
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      };
    if (count === 9)
      return {
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      };
    if (count === 10)
      return {
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      };
    return {
      // gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      gridTemplateRows: "1fr 1fr 1fr",
    };
  };

  // ✅ Move item to sidebar (replace previous)
  const moveToSidebar = (index) => {
    setMovedItem(index); // ✅ Only store one item
  };

  // ✅ Move item back to the grid
  const moveBackToGrid = () => {
    setMovedItem(null); // ✅ Clear sidebar
    setIsManuallyUnpinned(true); // ✅ Stop auto-pinning again
  };

  useEffect(() => {
    if (isManuallyUnpinned) return; // ✅ Stop auto-pinning if manually unpinned

    // Find the first user who is screen sharing
    const screenSharingIndex = allUsers.findIndex(
      (user) => user.isScreenSharing
    );

    if (screenSharingIndex !== -1) {
      setMovedItem(screenSharingIndex); // ✅ Auto-pin screen-sharing user initially
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsers]); // Runs when users update

  // Caption socket code
  useEffect(() => {
    socket.on("transcription", ({ speaker, transcription, isFinal }) => {
      console.log(`[${speaker}]: ${transcription}`);

      setCaptions((prevCaptions) => [
        ...prevCaptions,
        { speaker, text: transcription, isFinal },
      ]);
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off("transcription");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCaptions((prevCaptions) => {
        // Keep only the last 5 captions to avoid clutter
        if (prevCaptions.length > 5) {
          return prevCaptions.slice(prevCaptions.length - 5);
        }
        return prevCaptions;
      });
    }, 5000); // Run every 5 seconds to clean up old captions

    return () => clearInterval(interval);
  }, []);

  // Recording
  const handleStartStop = () => {
    if (isRecording) {
      stopRecording();
      stopTimer();
    } else {
      startRecording();
      startTimer(setTimer);
    }
    setIsRecording((prev) => !prev);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  // Host data
  useEffect(() => {
    if (props.videoConferenceData.joinMeetingResponse) {
      let data = props.videoConferenceData.joinMeetingResponse;
      if (data.success) {
        setHostData({
          hostName: data.meeting.hostName,
          hostControl: data.meeting.hostControl,
        });
      }
    }
  }, [props.videoConferenceData.joinMeetingResponse]);

  const handleEndMeeting = () => {
    // 1. Stop camera & mic
    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    // 2. Remove yourself so others instantly stop seeing your tile
    socket.emit("manual-leave", {
      meetingId,
      socketId: socket.id,
    });

    // 3. Notify everyone: meeting ended
    socket.emit("end-meeting", {
      meetingId,
    });

    // 4. Clean up local state (optional)
    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};
    localStreamRef.current = null;

    // 5. Navigate out
    navigate("/video-dashboard");
  };

  return (
    <div id="recordableDiv" className="layout-container">
      <div className="sidebar">
        <RoomSideBar
          openParticipants={() => setIsParticipantsOpen(true)}
          openInvite={() => setIsInviteOpen(true)}
          openBreakout={() => setIsbreakoutOpen(true)}
          openPlugin={() => setIsPluginOpen(true)}
          openSettings={() => setIsSettingsOpen(true)}
          openHostControl={() => setIsHostControlOpen(true)}
          participant={isParticipantsOpen}
          invite={isInviteOpen}
          breakout={isBreakoutOpen}
          plugin={isPluginOpen}
          settings={isSettingsOpen}
          hostControl={isHostControlOpen}
          hostData={hostData}
        />
      </div>

      <div className="main-wrapper">
        <div>
          <RoomHeader
            openMeetingAgenda={() => setIsOpenAgenda(true)}
            isRecording={isRecording}
            timer={timer}
            onStartStop={handleStartStop}
          />
        </div>

        {movedItem !== null ? (
          <div className="pinned-screen-container">
            {/* 🔹 First Div: Show Only the Pinned User */}
            <div>
              {allUsers
                .filter((_, index) => index === movedItem) // ✅ Only show the pinned user
                .map((user) => {
                  if (!user) return null;
                  const {
                    id,
                    name,
                    stream,
                    isVideoEnabled,
                    isAudioEnabled,
                    isScreenSharing,
                    isHandRaised,
                  } = user;

                  return (
                    <div
                      key={id}
                      className="content-box1"
                      style={{ height: "100%" }}
                    >
                      {stream ? (
                        <video
                          ref={(video) => {
                            if (video && video.srcObject !== stream) {
                              video.srcObject = stream; // ✅ Ensure video keeps playing
                            }
                          }}
                          autoPlay
                          playsInline
                          muted={id === "self"} // ✅ Mute only self-video
                          className="video-preview"
                          style={{
                            visibility: isVideoEnabled ? "visible" : "hidden",
                            opacity: isVideoEnabled ? 1 : 0,
                            transition: "opacity 0.3s ease-in-out",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: isScreenSharing ? "contain" : "cover",
                          }}
                        />
                      ) : id === "self" ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="video-preview"
                          style={{
                            visibility: isVideoEnabled ? "visible" : "hidden",
                            opacity: isVideoEnabled ? 1 : 0,
                            transition: "opacity 0.3s ease-in-out",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: isScreenSharing ? "contain" : "cover",
                          }}
                        />
                      ) : null}

                      {/* Placeholder when video is OFF */}
                      {!isVideoEnabled && (
                        <div className="room-video-placeholder1">
                          <div>{name.slice(0, 2).toUpperCase()}</div>
                        </div>
                      )}

                      <div className="participants-name-icon1">
                        <p>{name}</p>
                        <div>
                          <img
                            src={isAudioEnabled ? micIcon : micMuteIcon}
                            alt="mic icon"
                          />
                        </div>
                      </div>

                      {/* ✅ Close Button to Unpin */}
                      <button
                        onClick={moveBackToGrid}
                        style={{ position: "absolute", bottom: "20px" }}
                      >
                        ✖
                      </button>
                      {/* Hand raise */}
                      {isHandRaised && (
                        <div className="hand-raised-container">
                          {name} raised hand <img src={handIcon} alt="hand" />
                        </div>
                      )}
                      {/* Reaction */}
                      {id !== "self"
                        ? activeReactions[name] &&
                          activeReactions[name].map(
                            ({ reaction, id }, index) => (
                              <motion.div
                                key={id}
                                style={{
                                  bottom: `${70 + index * 30}px`,
                                  fontSize: "40px",
                                  position: "absolute",
                                  right: "10px",
                                }} // Stack each reaction higher
                                initial={{ opacity: 0, y: 0, scale: 1 }}
                                animate={{ opacity: 1, y: -80, scale: 1 }} // 🔹 Move up less & keep size normal
                                exit={{ opacity: 0, y: -100, scale: 0.5 }} // 🔹 Shrink as it disappears
                                transition={{ duration: 1.2, ease: "easeOut" }} // 🔹 Slightly reduced duration
                              >
                                {reaction}
                              </motion.div>
                            )
                          )
                        : ""}
                    </div>
                  );
                })}
            </div>

            {/* 🔹 Second Div: Show All Remaining Users */}
            <div>
              {allUsers
                .filter((_, index) => index !== movedItem) // ✅ Exclude the pinned user
                .map((user, index) => {
                  if (!user) return null;
                  const {
                    id,
                    name,
                    stream,
                    isVideoEnabled,
                    isAudioEnabled,
                    isHandRaised,
                  } = user;

                  return (
                    <div key={id} className="content-box1">
                      {stream ? (
                        <video
                          ref={(video) => {
                            if (video && video.srcObject !== stream) {
                              video.srcObject = stream; // ✅ Ensure video keeps playing
                            }
                          }}
                          autoPlay
                          playsInline
                          muted={id === "self"} // ✅ Mute only self-video
                          className="video-preview"
                          style={{
                            visibility: isVideoEnabled ? "visible" : "hidden",
                            opacity: isVideoEnabled ? 1 : 0,
                            transition: "opacity 0.3s ease-in-out",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: isScreenSharing ? "contain" : "cover",
                          }}
                        />
                      ) : id === "self" ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="video-preview"
                          style={{
                            visibility: isVideoEnabled ? "visible" : "hidden",
                            opacity: isVideoEnabled ? 1 : 0,
                            transition: "opacity 0.3s ease-in-out",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: isScreenSharing ? "contain" : "cover",
                          }}
                        />
                      ) : null}

                      {/* Placeholder when video is OFF */}
                      {!isVideoEnabled && (
                        <div
                          className="room-video-placeholder1"
                          style={{ width: "55px", height: "55px" }}
                        >
                          <div>{name.slice(0, 2).toUpperCase()}</div>
                        </div>
                      )}

                      <div
                        className="participants-name-icon1"
                        style={{
                          bottom: "5px",
                          padding: "0 10px",
                          width: "calc(100% - 30px)",
                        }}
                      >
                        <p style={{ margin: "10px 0" }}>{name}</p>
                        <div>
                          <img
                            src={isAudioEnabled ? micIcon : micMuteIcon}
                            alt="mic icon"
                          />
                        </div>
                      </div>

                      {/* ✅ Pin Button */}
                      {count > 1 &&
                        isVideoEnabled &&
                        hoveredIndex === index && (
                          <div
                            className="participants-pin-button"
                            onClick={() => moveToSidebar(index)}
                            style={{
                              bottom: "50px",
                              width: "30px",
                              height: "30px",
                            }}
                          >
                            <img src={ExpandIcon} alt="icon" />
                          </div>
                        )}
                      {/* Hand raise */}
                      {isHandRaised && (
                        <div
                          className="hand-raised-container"
                          style={{
                            padding: "5px",
                            bottom: "50px",
                            left: "10px",
                          }}
                        >
                          <img src={handIcon} alt="hand" />
                        </div>
                      )}
                      {/* Reaction */}
                      {id !== "self"
                        ? activeReactions[name] &&
                          activeReactions[name].map(
                            ({ reaction, id }, index) => (
                              <motion.div
                                key={id}
                                style={{
                                  bottom: `${50 + index * 25}px`, // 🔹 Lower starting position
                                  fontSize: "25px",
                                  position: "absolute",
                                  right: "10px",
                                }}
                                initial={{ opacity: 0, y: 0, scale: 1 }}
                                animate={{ opacity: 1, y: -10, scale: 1 }} // 🔹 Moves up less (-50 instead of -80)
                                exit={{ opacity: 0, y: -60, scale: 0.7 }} // 🔹 Shrinks slightly, moves up less
                                transition={{ duration: 1.5, ease: "easeOut" }} // 🔹 Slower animation (1.5s instead of 1.2s)
                              >
                                {reaction}
                              </motion.div>
                            )
                          )
                        : ""}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : openMathEditor || openCodeEditor ? (
          <div className="pinned-screen-container">
            {openMathEditor && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  margin: "10px",
                  position: "relative",
                }}
              >
                <math-field
                  ref={mathFieldRef}
                  virtualKeyboardMode="manual"
                  style={{ width: "100%", minHeight: "50px" }}
                ></math-field>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "calc(100% - 20px)",
                    textAlign: "center",
                  }}
                >
                  <CloseOutlined
                    onClick={() => setOpenMathEditor(false)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            )}
            {openCodeEditor && (
              <div style={{ position: "relative" }}>
                <CodeEditor />
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <CloseOutlined
                    onClick={() => setOpenCodeEditor(false)}
                    style={{ cursor: "pointer", color: "white" }}
                  />
                </div>
              </div>
            )}
            <div>
              {allUsers
                .filter((_, index) => index !== movedItem) // ✅ Exclude the pinned user
                .map((user, index) => {
                  if (!user) return null;
                  const {
                    id,
                    name,
                    stream,
                    isVideoEnabled,
                    isAudioEnabled,
                    isHandRaised,
                  } = user;

                  return (
                    <div key={id} className="content-box1">
                      {stream ? (
                        <video
                          ref={(video) => {
                            if (video && video.srcObject !== stream) {
                              video.srcObject = stream; // ✅ Ensure video keeps playing
                            }
                          }}
                          autoPlay
                          playsInline
                          muted={id === "self"} // ✅ Mute only self-video
                          className="video-preview"
                          style={{
                            visibility: isVideoEnabled ? "visible" : "hidden",
                            opacity: isVideoEnabled ? 1 : 0,
                            transition: "opacity 0.3s ease-in-out",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: isScreenSharing ? "contain" : "cover",
                          }}
                        />
                      ) : id === "self" ? (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="video-preview"
                          style={{
                            visibility: isVideoEnabled ? "visible" : "hidden",
                            opacity: isVideoEnabled ? 1 : 0,
                            transition: "opacity 0.3s ease-in-out",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: isScreenSharing ? "contain" : "cover",
                          }}
                        />
                      ) : null}

                      {/* Placeholder when video is OFF */}
                      {!isVideoEnabled && (
                        <div
                          className="room-video-placeholder1"
                          style={{ width: "55px", height: "55px" }}
                        >
                          <div>{name.slice(0, 2).toUpperCase()}</div>
                        </div>
                      )}

                      <div
                        className="participants-name-icon1"
                        style={{
                          bottom: "5px",
                          padding: "0 10px",
                          width: "calc(100% - 30px)",
                        }}
                      >
                        <p style={{ margin: "10px 0" }}>{name}</p>
                        <div>
                          <img
                            src={isAudioEnabled ? micIcon : micMuteIcon}
                            alt="mic icon"
                          />
                        </div>
                      </div>

                      {/* ✅ Pin Button */}
                      {count > 1 &&
                        isVideoEnabled &&
                        hoveredIndex === index && (
                          <div
                            className="participants-pin-button"
                            onClick={() => moveToSidebar(index)}
                          >
                            <img src={ExpandIcon} alt="icon" />
                          </div>
                        )}
                      {/* Hand raise */}
                      {isHandRaised && (
                        <div
                          className="hand-raised-container"
                          style={{
                            padding: "5px",
                            bottom: "50px",
                            left: "10px",
                          }}
                        >
                          <img src={handIcon} alt="hand" />
                        </div>
                      )}
                      {/* Reaction */}
                      {id !== "self"
                        ? activeReactions[name] &&
                          activeReactions[name].map(
                            ({ reaction, id }, index) => (
                              <motion.div
                                key={id}
                                style={{
                                  bottom: `${50 + index * 25}px`, // 🔹 Lower starting position
                                  fontSize: "25px",
                                  position: "absolute",
                                  right: "10px",
                                }}
                                initial={{ opacity: 0, y: 0, scale: 1 }}
                                animate={{ opacity: 1, y: -10, scale: 1 }} // 🔹 Moves up less (-50 instead of -80)
                                exit={{ opacity: 0, y: -60, scale: 0.7 }} // 🔹 Shrinks slightly, moves up less
                                transition={{ duration: 1.5, ease: "easeOut" }} // 🔹 Slower animation (1.5s instead of 1.2s)
                              >
                                {reaction}
                              </motion.div>
                            )
                          )
                        : ""}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="primary-content" style={getGridTemplate()}>
            {allUsers.map((user, index) => {
              if (!user) return null;
              const {
                id,
                name,
                stream,
                isVideoEnabled,
                isAudioEnabled,
                isScreenSharing,
                isHandRaised,
                isNoteTakerEnabled,
              } = user;
              return (
                <div
                  key={id}
                  className="content-box1"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {stream ? (
                    <video
                      ref={(video) => {
                        if (video && video.srcObject !== stream) {
                          video.srcObject = stream; // ✅ Ensure video keeps playing
                        }
                      }}
                      autoPlay
                      playsInline
                      muted={id === "self"} // ✅ Mute only self-video
                      className="video-preview"
                      style={{
                        visibility: isVideoEnabled ? "visible" : "hidden",
                        opacity: isVideoEnabled ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: isScreenSharing ? "contain" : "cover",
                      }}
                    />
                  ) : id === "self" ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="video-preview"
                      style={{
                        visibility: isVideoEnabled ? "visible" : "hidden",
                        opacity: isVideoEnabled ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: isScreenSharing ? "contain" : "cover",
                      }}
                    />
                  ) : null}

                  {/* Placeholder when video is OFF */}
                  {!isVideoEnabled && (
                    <div className="room-video-placeholder1">
                      <div>{name.slice(0, 2).toUpperCase()}</div>
                    </div>
                  )}

                  {id !== "self" && (
                    <div
                      className="participants-name-icon1"
                      style={{ position: "absolute" }}
                    >
                      <p>{name}</p>
                      <div>
                        <img
                          src={isAudioEnabled ? micIcon : micMuteIcon}
                          alt="mic icon"
                        />
                      </div>
                    </div>
                  )}
                  {/* ✅ Pin Button */}
                  {count > 1 && isVideoEnabled && hoveredIndex === index && (
                    <div
                      className="participants-pin-button"
                      onClick={() => moveToSidebar(index)}
                    >
                      <img src={ExpandIcon} alt="icon" />
                    </div>
                  )}

                  {/* Hand raise */}
                  {isHandRaised && (
                    <div className="hand-raised-container">
                      {name} raised hand <img src={handIcon} alt="hand" />
                    </div>
                  )}

                  {/* Reaction */}
                  {id !== "self"
                    ? activeReactions[name] &&
                      activeReactions[name].map(({ reaction, id }, index) => (
                        <motion.div
                          key={id}
                          style={{
                            bottom: `${70 + index * 30}px`,
                            fontSize: "40px",
                            position: "absolute",
                            right: "10px",
                          }} // Stack each reaction higher
                          initial={{ opacity: 0, y: 0, scale: 1 }}
                          animate={{ opacity: 1, y: -80, scale: 1 }} // 🔹 Move up less & keep size normal
                          exit={{ opacity: 0, y: -100, scale: 0.5 }} // 🔹 Shrink as it disappears
                          transition={{ duration: 1.2, ease: "easeOut" }} // 🔹 Slightly reduced duration
                        >
                          {reaction}
                        </motion.div>
                      ))
                    : ""}

                  {/* AI Tile */}
                  {isNoteTakerEnabled && (
                    <div className="ai-tile-container">
                      <div>
                        <div className="pulsating-glow">
                          <img src={NoteTakerIcon} alt="note" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {caption && (
          <div className="caption-box">
            {captions.map((caption, index) => (
              <div
                key={index}
                className={`caption ${caption.isFinal ? "final" : "interim"}`}
                style={{
                  animationDelay: `${index * 0.5}s`,
                }} /* Staggered fade-in */
              >
                <strong>{caption.speaker}:</strong> {caption.text}
              </div>
            ))}
          </div>
        )}

        <div>
          <div
            style={{ textAlign: "center" }}
            onClick={() => setShowFooter(!showFooter)}
          >
            <img
              className="footer-control-button"
              src={ArrowIcon}
              alt="icon"
              style={{ transform: showFooter ? "rotate(180deg)" : "" }}
            />
          </div>
          {showFooter && (
            <RoomFooter
              meetingId={meetingId}
              caption={caption}
              setCaption={setCaption}
              pagination={{ currentPage, totalPages, setCurrentPage }}
              toggleVideo={toggleVideo} // ✅ Pass toggleVideo function
              toggleAudio={toggleAudio} // ✅ Pass toggleAudio function
              isVideoEnabled={isVideoEnabled} // ✅ Send current video status
              isAudioEnabled={isAudioEnabled} // ✅ Send current audio status
              toggleScreenShare={toggleScreenShare}
              isScreenSharing={isScreenSharing}
              toggleHandRaise={toggleHandRaise}
              isHandRaised={isHandRaised}
              chat={chat} // Pass currect status
              openChat={() => setChat(true)} // Pass open function
              AIEnable={setIsAIEnabled}
              AI={isAIEnable}
              onEndMeeting={handleEndMeeting}
            />
          )}
        </div>
        {/* <div style={{ color: "white", position: "absolute", bottom: 0 }}>
          <Popover
            content={
              <p>
                Invite Link:{" "}
                <a
                  href="https://meet.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Meeting
                </a>
              </p>
            }
            title="Invite People"
            trigger="click"
            open={isInvitePopover} // Controlled visibility
            onOpenChange={(visible) => setIsInvitePopover(visible)} // Sync state with popover
            destroyTooltipOnHide={true} // Remove empty popovers
          >
            <Button
              type="primary"
              onClick={() => setIsInvitePopover(!isInvitePopover)}
            >
              {isInvitePopover ? "Close Invite" : "Open Invite"}
            </Button>
          </Popover>
        </div> */}
        {/* Participants Side Panel */}
        <ParticipantsDrawer
          isOpen={isParticipantsOpen}
          onClose={() => setIsParticipantsOpen(false)}
        />

        {/* Invite Side Panel */}
        <InviteDrawer
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
        />

        {/* Breakout modal */}
        <Breakout
          isOpen={isBreakoutOpen}
          onClose={() => setIsbreakoutOpen(false)}
        />

        {/* Plugin Side Panel */}
        <PluginDrawer
          isOpen={isPluginOpen}
          onClose={() => setIsPluginOpen(false)}
          openMathEditor={setOpenMathEditor}
          openCodeEditor={setOpenCodeEditor}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {/* Host control side panel */}
        <HostControl
          isOpen={isHostControlOpen}
          onClose={() => setIsHostControlOpen(false)}
          hostData={hostData}
          meetingId={meetingId}
        />

        {/* Chat side panel */}
        <ChatDrawer
          isOpen={chat}
          onClose={() => setChat(false)}
          meetingId={meetingId}
          name={name}
        />

        {/* Meetign agenda side panel */}
        <MeetingAgenda
          isOpen={isOpenAgenda}
          onClose={() => setIsOpenAgenda(false)}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({});

Layout.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

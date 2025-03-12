import React, { useEffect, useRef, useState } from "react";
import RoomSideBar from "./RoomSidebar";
import RoomHeader from "./RoomHeader";
import RoomFooter from "./RoomFooter";
import micIcon from "../../../assets/Icons/mic-icon.svg";
import micMuteIcon from "../../../assets/Icons/mic-mute.svg";
import socket from "../socket";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowsAltOutlined } from "@ant-design/icons";
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

function Layout() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name") || "Guest";
  const videoOn = urlParams.get("video") === "true";
  const audioOn = urlParams.get("audio") === "true";

  const [caption, setCaption] = useState(false);
  const [movedItem, setMovedItem] = useState(null); // ✅ Only store one item
  const [currentPage, setCurrentPage] = useState(1);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [participantsInfo, setParticipantsInfo] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const remoteUserCount = Object.keys(remoteUsers).length;
  const count = 1 + remoteUserCount;

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});

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

  console.log("participantsInfo", participantsInfo);

  const remoteUsersArray = Object.entries(remoteUsers).map(
    ([userId, stream]) => {
      const participant = participantsInfo?.[userId] || {}; // Get participant info safely
      console.log("participant", participant);

      return {
        id: userId,
        name: participant.name || `User ${userId.substring(0, 5)}`, // Use actual name if available
        stream: stream,
        isVideoEnabled: participant.isVideoEnabled,
        isAudioEnabled: participant.isAudioEnabled,
        isScreenSharing: participant.isScreenSharing,
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
      stream: localStreamRef.current,
    },
    ...remoteUsersArray,
  ];

  const getGridTemplate = () => {
    if (count === 1)
      return { gridTemplateColumns: "1fr", width: "50%", margin: "0 auto" };
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
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <RoomSideBar />
      </div>

      <div className="main-wrapper">
        <div>
          <RoomHeader />
        </div>

        {movedItem !== null ? (
          <div className="pinned-screen-container">
            {/* 🔹 First Div: Show Only the Pinned User */}
            <div>
              {allUsers
                .filter((_, index) => index === movedItem) // ✅ Only show the pinned user
                .map((user) => {
                  if (!user) return null;
                  const { id, name, stream, isVideoEnabled, isAudioEnabled } =
                    user;

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
                  const { id, name, stream, isVideoEnabled, isAudioEnabled } =
                    user;

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
                          <button
                            className="participants-pin-button"
                            onClick={() => moveToSidebar(index)}
                          >
                            <ArrowsAltOutlined />
                          </button>
                        )}
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="primary-content" style={getGridTemplate()}>
            {allUsers.map((user, index) => {
              if (!user) return null;
              const { id, name, stream, isVideoEnabled, isAudioEnabled, isScreenSharing } = user;
              // console.log("id", id);
              // console.log("name", name);
              // console.log("isVideoEnabled", isVideoEnabled);
              console.log("isScreenSharing", isScreenSharing);

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
                    <button
                      className="participants-pin-button"
                      onClick={() => moveToSidebar(index)}
                    >
                      <ArrowsAltOutlined />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {caption && <div className="caption-box">Caption is enabled</div>}

        <div>
          <RoomFooter
            caption={setCaption}
            pagination={{ currentPage, totalPages, setCurrentPage }}
            toggleVideo={toggleVideo} // ✅ Pass toggleVideo function
            toggleAudio={toggleAudio} // ✅ Pass toggleAudio function
            isVideoEnabled={isVideoEnabled} // ✅ Send current video status
            isAudioEnabled={isAudioEnabled} // ✅ Send current audio status
            toggleScreenShare={toggleScreenShare}
            isScreenSharing={isScreenSharing}
          />
        </div>
      </div>
    </div>
  );
}

export default Layout;

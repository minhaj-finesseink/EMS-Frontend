/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Form, Input } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import UsitiveLogo from "../../../assets/usitive-logo.svg";
import micIcon from "../../../assets/Icons/mic-icon.svg";
import micMuteIcon from "../../../assets/Icons/mic-mute.svg";
import videoIcon from "../../../assets/Icons/camera video.svg";
import videoOffIcon from "../../../assets/Icons/camera video-silent.svg";
import effectsIcon from "../../../assets/Icons/effects.svg";
import settingsIcon from "../../../assets/Icons/settings-icon.svg";
import CustomButton from "../../../components/CustomButton";
import { startInstantMeeting } from "../../../redux/VideoConference/video.action";
import "./style.css";

// const socket = io("http://localhost:5000");

const MeetingLobby = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const meetingType = queryParams.get("type"); // Extract 'id' from URL

  const [meetingId, setMeetingId] = useState("");
  const [userName, setuserName] = useState("");

  // const localVideoRef = useRef(null);
  // const remoteVideoRef = useRef(null);
  // const peerConnection = useRef(null);

  // const [isMuted, setIsMuted] = useState(false);
  // const [isVideoOn, setIsVideoOn] = useState(true);

  // useEffect(() => {
  //   setupMedia();
  //   // socket.emit("join-meeting", meetingId);

  //   socket.on("user-joined", async (userId) => {
  //     console.log(`User joined: ${userId}`);
  //     createOffer(userId);
  //   });

  //   socket.on("receive-offer", async (data) => {
  //     await peerConnection.current.setRemoteDescription(
  //       new RTCSessionDescription(data.offer)
  //     );
  //     const answer = await peerConnection.current.createAnswer();
  //     await peerConnection.current.setLocalDescription(answer);
  //     socket.emit("send-answer", { answer, to: data.from });
  //   });

  //   socket.on("receive-answer", async (data) => {
  //     await peerConnection.current.setRemoteDescription(
  //       new RTCSessionDescription(data.answer)
  //     );
  //   });

  //   socket.on("receive-ice-candidate", async (data) => {
  //     await peerConnection.current.addIceCandidate(
  //       new RTCIceCandidate(data.candidate)
  //     );
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const setupMedia = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });
  //   if (localVideoRef.current) {
  //     localVideoRef.current.srcObject = stream;
  //   }

  //   peerConnection.current = new RTCPeerConnection({
  //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  //   });

  //   stream
  //     .getTracks()
  //     .forEach((track) => peerConnection.current.addTrack(track, stream));

  //   peerConnection.current.ontrack = (event) => {
  //     remoteVideoRef.current.srcObject = event.streams[0];
  //   };

  //   peerConnection.current.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       socket.emit("send-ice-candidate", {
  //         candidate: event.candidate,
  //         // to: meetingId,
  //       });
  //     }
  //   };
  // };

  // const createOffer = async (userId) => {
  //   const offer = await peerConnection.current.createOffer();
  //   await peerConnection.current.setLocalDescription(offer);
  //   socket.emit("send-offer", { offer, to: userId, from: socket.id });
  // };

  // const toggleMute = () => {
  //   const stream = localVideoRef.current.srcObject;
  //   stream
  //     .getAudioTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  //   setIsMuted(!isMuted);
  // };

  // const toggleVideo = () => {
  //   const stream = localVideoRef.current.srcObject;
  //   stream
  //     .getVideoTracks()
  //     .forEach((track) => (track.enabled = !track.enabled));
  //   setIsVideoOn(!isVideoOn);
  // };

  const handleSubmit = (values) => {
    const { meetingIdInput, userName } = values;
    props.startInstantMeeting({
      username: userName,
    });
  };

  useEffect(() => {
    if (props.videoConferenceData.startInstantMeetingResponse) {
      let data = props.videoConferenceData.startInstantMeetingResponse;
      if (data.success) {
        navigate(
          `/room?roomId=${
            meetingId ? meetingId : data.meeting.meetingId
          }&username=${userName}`
        ); // Navigate with roomId
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.videoConferenceData.startInstantMeetingResponse]);

  return (
    <div className="instant-meeting-lobby-page">
      {/* Logo Section */}
<div className="meeting-logo-container">
  <img src={UsitiveLogo} alt="logo" />
  <div>Usitive Meet</div>
</div>

      {/* Video Section */}
      {/* <div className="video-container">
        <div className="video-wrapper">
          {!isVideoOn && <div className="camera-off-text">Camera is off</div>}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="video-preview"
            style={{ backgroundColor: isVideoOn ? "" : "#272A32" }}
          /> */}

      {/* Video Controls */}
      {/* <div className="video-controls">
            <div style={{ display: "flex", gap: "20px" }}>
              <div className="control-btn" onClick={toggleVideo}>
                <img src={isVideoOn ? videoIcon : videoOffIcon} alt="icon" />
              </div>
              <div className="control-btn" onClick={toggleMute}>
                <img src={isMuted ? micMuteIcon : micIcon} alt="icon" />
              </div>
            </div>
            <div>
              <div className="control-btn">
                <img src={effectsIcon} alt="icon" />
              </div>
            </div>
          </div> */}

      {/* settings icon */}
      {/* <div
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              cursor: "pointer",
            }}
          >
            <img src={settingsIcon} alt="icon" />
          </div>
        </div> */}

      {/* Join Meeting Section */}
      <div className="join-section">
        <div style={{ color: "#464454", fontSize: "22px", fontWeight: 700 }}>
          Joining as
        </div>
        <div
          style={{
            width: "350px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Form onFinish={handleSubmit}>
            {/* Meeting ID Input */}
            {meetingType !== "instant" && (
              <Form.Item
                name="meetingIdInput"
                rules={[{ required: true, message: "Meeting ID is required!" }]}
              >
                <Input
                  style={{
                    height: "45px",
                    border: "1px solid #007DC5",
                    borderRadius: "4px",
                  }}
                  placeholder="Meeting ID"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                />
              </Form.Item>
            )}
            {/* Name Input */}
            <Form.Item
              name="userName"
              rules={[{ required: true, message: "Name is required!" }]}
            >
              <Input
                style={{
                  height: "45px",
                  border: "1px solid #007DC5",
                  borderRadius: "4px",
                }}
                placeholder="Enter name"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
              />
            </Form.Item>
            {/* Submit Button */}
            <Form.Item>
              <CustomButton
                color={"blue"}
                block
                style={{ borderRadius: "4px" }}
                htmlType="submit"
              >
                Start
              </CustomButton>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
    // </div>
  );
};

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({
  startInstantMeeting: (values) => dispatch(startInstantMeeting(values)),
});

MeetingLobby.propTypes = {
  startInstantMeeting: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingLobby);

// import React, { useEffect, useRef, useState } from "react";
// import UsitiveLogo from "../../../assets/usitive-logo.svg";
// import "./style.css";

// function Lobby() {
//   const [videoOn, setVideoOn] = useState(true);
//   const [audioOn, setAudioOn] = useState(true);
//   const videoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const [loading, setLoading] = useState(true); // ✅ Track video loading state

//   useEffect(() => {
//     const startPreview = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });

//         localStreamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }

//         setLoading(false);
//         // Set initial mute state
//         stream.getVideoTracks().forEach((track) => (track.enabled = videoOn));
//         stream.getAudioTracks().forEach((track) => (track.enabled = audioOn));
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//         setLoading(false);
//       }
//     };

//     startPreview();

//     return () => {
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // 🎤 Toggle Audio (Mute/Unmute)
//   const toggleAudio = () => {
//     setAudioOn(!audioOn);
//     localStreamRef.current
//       .getAudioTracks()
//       .forEach((track) => (track.enabled = !audioOn));
//   };

//   // 📹 Toggle Video (On/Off)
//   const toggleVideo = () => {
//     setVideoOn(!videoOn);
//     localStreamRef.current
//       .getVideoTracks()
//       .forEach((track) => (track.enabled = !videoOn));
//   };

//   return (
//     <div className="lobby-container">
//       <div className="lobby-logo">
//         <div className="meeting-logo-container">
//           <img src={UsitiveLogo} alt="logo" />
//           <div>Usitive Meet</div>
//         </div>
//       </div>
//       <div className="lobby-video-and-form">
//         <div className="lobby-video-container">
//           {/* 📹 Video Preview with Fixed Size */}
//           <div
//             style={{
//               width: "300px",
//               height: "200px",
//               // border: "2px solid black",
//               margin: "10px auto",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: "black",
//             }}
//           >
//             {loading ? (
//               <p style={{ color: "white" }}>Loading...</p> // ✅ Show loading state
//             ) : videoOn ? (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             ) : (
//               <p style={{ color: "white" }}>Video Off</p> // ✅ Show placeholder if video is off
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Lobby;

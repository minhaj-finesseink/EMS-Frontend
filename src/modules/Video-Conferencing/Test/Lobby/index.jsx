// import { useRef, useState, useEffect } from "react";
// import { Form, Input } from "antd";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import micIcon from "../../../../assets/Icons/mic-icon.svg";
// import micMuteIcon from "../../../../assets/Icons/mic-mute.svg";
// import videoIcon from "../../../../assets/Icons/camera video.svg";
// import videoOffIcon from "../../../../assets/Icons/camera video-silent.svg";
// import effectsIcon from "../../../../assets/Icons/effects.svg";
// import settingsIcon from "../../../../assets/Icons/settings-icon.svg";
// import logo from "../../../../assets/usitive-logo.svg";
// import CustomButton from "../../../../components/CustomButton";
// import "./SelfVideo.css";

// const SelfVideo = () => {
//   const [searchParams] = useSearchParams();
//   const type = searchParams.get("type");
//   const meetingID = searchParams.get("id");

//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [isMuted, setIsMuted] = useState(true);

//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isPlaying) {
//       startVideo();
//     } else {
//       stopVideo();
//     }

//     return () => stopVideo(); // Cleanup on unmount
//   }, [isPlaying]); // Dependency on isPlaying

//   const startVideo = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       streamRef.current = stream;
//     } catch (error) {
//       console.error("Error accessing webcam:", error);
//     }
//   };

//   const stopVideo = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//   };

//   const toggleVideo = () => {
//     setIsPlaying((prev) => !prev);
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//   };

//   const handleJoin = (values) => {
//     // ✅ Store settings in local storage before navigating
//     localStorage.setItem(
//       "meetingSettings",
//       JSON.stringify({
//         name: values.name,
//         videoOn: isPlaying,
//         audioOn: isMuted,
//       })
//     );
//     if (type === "instant") {
//       const newMeetingId = uuidv4();
//       navigate(
//         `/test/${newMeetingId}?name=${encodeURIComponent(
//           values.name
//         )}&video=${isPlaying}&audio=${isMuted}`
//       );
//       // navigate(`/meeting-room/${newMeetingId}`);
//     } else {
//       navigate(
//         `/test/${
//           meetingID ? meetingID : values.meetingID
//         }?name=${encodeURIComponent(
//           values.name
//         )}&video=${isPlaying}&audio=${isMuted}`
//       );
//       // navigate(`/meeting-room/${meetingID ? meetingID : values.meetingID}`);
//     }
//   };

//   return (
//     <div className="video-lobby-container">
//       <div className="video-lobby-logo-container">
//         <img src={logo} alt="logo" /> <div>usitive meet</div>
//       </div>
//       <div className="lobby-video-and-form-container">
//         <div className="lobby-video-container">
//           <div className="lobby-video-wrapper">
//             {isPlaying ? (
//               <video
//                 ref={videoRef}
//                 className="lobby-video-self-video"
//                 autoPlay
//                 playsInline
//                 // muted={isMuted}
//               ></video>
//             ) : (
//               <div className="lobby-video-placeholder">
//                 <div className="lobby-video-initials">MM</div>
//               </div>
//             )}
//             <img
//               src={settingsIcon}
//               alt="settings icon"
//               className="lobby-video-settings-icon"
//             />
//           </div>

//           <div className="lobby-video-controls">
//             <div>
//               <div onClick={toggleMute} className="lobby-video-control-button">
//                 <div>
//                   <img src={isMuted ? micIcon : micMuteIcon} alt="mute icon" />
//                 </div>
//                 <span>Mute</span>
//               </div>

//               <div onClick={toggleVideo} className="lobby-video-control-button">
//                 <div>
//                   <img
//                     src={isPlaying ? videoIcon : videoOffIcon}
//                     alt="video icon"
//                   />
//                 </div>
//                 <span>Start</span>
//               </div>
//             </div>

//             <div className="lobby-video-control-button">
//               <div>
//                 <img src={effectsIcon} alt="effects icon" />{" "}
//               </div>
//               <span>Effects</span>
//             </div>
//           </div>
//         </div>
//         <div className="lobby-form-container">
//           <div>Joining as</div>
//           <Form
//             style={{ width: "100%" }}
//             form={form}
//             layout="vertical"
//             onFinish={handleJoin}
//           >
//             {type === "join" && (
//               <Form.Item
//                 name="meetingID"
//                 rules={[{ required: true, message: "Meeting ID is required" }]}
//               >
//                 <Input placeholder="Meeting ID" />
//               </Form.Item>
//             )}
//             {type === "invite" && (
//               <div
//                 style={{
//                   padding: "10px",
//                   fontSize: "16px",
//                   fontFamily: "Inter",
//                 }}
//               >
//                 <span>{meetingID}</span>
//               </div>
//             )}
//             <Form.Item
//               name="name"
//               rules={[{ required: true, message: "Name is required" }]}
//             >
//               <Input placeholder="Enter name" />
//             </Form.Item>
//             <Form.Item>
//               <CustomButton color={"blue"} block>
//                 Join
//               </CustomButton>
//             </Form.Item>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SelfVideo;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { Form, Input } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import micIcon from "../../../../assets/Icons/mic-icon.svg";
import micMuteIcon from "../../../../assets/Icons/mic-mute.svg";
import videoIcon from "../../../../assets/Icons/camera video.svg";
import videoOffIcon from "../../../../assets/Icons/camera video-silent.svg";
import effectsIcon from "../../../../assets/Icons/effects.svg";
import settingsIcon from "../../../../assets/Icons/settings-icon.svg";
import logo from "../../../../assets/usitive-logo.svg";
import CustomButton from "../../../../components/CustomButton";
import {
  joinMeeting,
  startInstantMeeting,
} from "../../../../redux/VideoConference/video.action";
import "./SelfVideo.css";
import toast from "react-hot-toast";

const MeetingLobby = (props) => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const meetingID = searchParams.get("id");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [userName, setuserName] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPlaying) {
      startVideo();
    } else {
      stopVideo();
    }

    return () => stopVideo(); // Cleanup on unmount
  }, [isPlaying]); // Dependency on isPlaying

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleVideo = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // const handleJoin = (values) => {
  //   // ✅ Store settings in local storage before navigating
  //   localStorage.setItem(
  //     "meetingSettings",
  //     JSON.stringify({
  //       name: values.name,
  //       videoOn: isPlaying,
  //       audioOn: isMuted,
  //     })
  //   );
  //   if (type === "instant") {
  //     const newMeetingId = uuidv4();
  // navigate(
  //   `/meeting-room/${newMeetingId}?name=${encodeURIComponent(
  //     values.name
  //   )}&video=${isPlaying}&audio=${isMuted}`
  // );
  //     // navigate(`/meeting-room/${newMeetingId}`);
  //   } else {
  //     navigate(
  //       `/meeting-room/${
  //         meetingID ? meetingID : values.meetingID
  //       }?name=${encodeURIComponent(
  //         values.name
  //       )}&video=${isPlaying}&audio=${isMuted}`
  //     );
  //     // navigate(`/meeting-room/${meetingID ? meetingID : values.meetingID}`);
  //   }
  // };

  const handleJoin = (values) => {
    // values.name
    // values.meetingID
    // props.startInstantMeeting({
    //   username: values.name,
    // });
    if (type === "instant") {
      props.startInstantMeeting({
        username: values.name,
      });
    } else {
      props.joinMeeting({
        meetingId: meetingID,
        // userId: userInfo._id,
        ...(userInfo._id && { userId: userInfo._id }),
      });
    }
  };

  useEffect(() => {
    if (props.videoConferenceData.startInstantMeetingResponse) {
      let data = props.videoConferenceData.startInstantMeetingResponse;
      if (data.success) {
        navigate(
          `/test/${data.meeting.meetingId}?name=${encodeURIComponent(
            userName
          )}&video=${isPlaying}&audio=${isMuted}`
        );
      }
    }
    props.videoConferenceData.startInstantMeetingResponse = null;
  }, [props.videoConferenceData.startInstantMeetingResponse]);

  useEffect(() => {
    if (props.videoConferenceData.joinMeetingResponse) {
      let data = props.videoConferenceData.joinMeetingResponse;
      if (data.success) {
        navigate(
          `/test/${meetingID}?name=${encodeURIComponent(
            userName
          )}&video=${isPlaying}&audio=${isMuted}`
        );
      }
    }
    props.videoConferenceData.joinMeetingResponse = null;
  }, [props.videoConferenceData.joinMeetingResponse]);

  return (
    <div className="video-lobby-container">
      <div className="video-lobby-logo-container">
        <img src={logo} alt="logo" /> <div>usitive meet</div>
      </div>
      <div className="lobby-video-and-form-container">
        <div className="lobby-video-container">
          <div className="lobby-video-wrapper">
            {isPlaying ? (
              <video
                ref={videoRef}
                className="lobby-video-self-video"
                autoPlay
                playsInline
                // muted={isMuted}
              ></video>
            ) : (
              // <div className="lobby-video-placeholder">
              //   <div className="lobby-video-initials">MM</div>
              // </div>
              <div style={{ fontSize: "18px", color: "white" }}>
                Camera is off
              </div>
            )}
            <img
              src={settingsIcon}
              alt="settings icon"
              className="lobby-video-settings-icon"
            />
          </div>

          <div className="lobby-video-controls">
            <div>
              <div onClick={toggleMute} className="lobby-video-control-button">
                <div>
                  <img src={isMuted ? micIcon : micMuteIcon} alt="mute icon" />
                </div>
                <span>Mute</span>
              </div>

              <div onClick={toggleVideo} className="lobby-video-control-button">
                <div>
                  <img
                    src={isPlaying ? videoIcon : videoOffIcon}
                    alt="video icon"
                  />
                </div>
                <span>Start</span>
              </div>
            </div>

            <div className="lobby-video-control-button">
              <div>
                <img src={effectsIcon} alt="effects icon" />{" "}
              </div>
              <span>Effects</span>
            </div>
          </div>
        </div>
        <div className="lobby-form-container">
          <div>Joining as</div>
          <Form
            style={{ width: "100%" }}
            form={form}
            layout="vertical"
            onFinish={handleJoin}
          >
            {type === "join" && (
              <Form.Item
                name="meetingID"
                rules={[{ required: true, message: "Meeting ID is required" }]}
              >
                <Input placeholder="Meeting ID" />
              </Form.Item>
            )}
            {type === "invite" && (
              <div
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  fontFamily: "Inter",
                }}
              >
                <span>{meetingID}</span>
              </div>
            )}
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input
                placeholder="Enter name"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <CustomButton color={"blue"} block>
                Join
              </CustomButton>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({
  startInstantMeeting: (values) => dispatch(startInstantMeeting(values)),
  joinMeeting: (values) => dispatch(joinMeeting(values)),
});

MeetingLobby.propTypes = {
  startInstantMeeting: PropTypes.func,
  joinMeeting: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingLobby);

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Input, Button } from "antd";
import { VideoCameraOutlined, AudioMutedOutlined, SettingOutlined } from "@ant-design/icons";
import UsitiveLogo from "../../../../assets/usitive-logo.svg";
import "./style.css";

const Lobby = () => {
  const [name, setName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  const [videoOn, setVideoOn] = useState(true); // ✅ Default video ON
  const [audioOn, setAudioOn] = useState(true);
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      stream.getVideoTracks().forEach((track) => (track.enabled = videoOn));
      stream.getAudioTracks().forEach((track) => (track.enabled = audioOn));
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    startPreview();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleAudio = () => {
    setAudioOn(!audioOn);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !audioOn));
    }
  };

  const toggleVideo = async () => {
    if (videoOn) {
      // ✅ Stop the video stream properly
      localStreamRef.current.getVideoTracks().forEach((track) => track.stop());
    } else {
      // ✅ Restart the camera when turning video ON
      await startPreview();
    }
    setVideoOn(!videoOn);
  };

  const createMeeting = () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }

    const newMeetingId = uuidv4();
    navigate(
      `/meeting/${newMeetingId}?name=${encodeURIComponent(name)}&video=${videoOn}&audio=${audioOn}`
    );
  };

  const joinMeeting = () => {
    if (!meetingId.trim() || !name.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    navigate(
      `/meeting/${meetingId}?name=${encodeURIComponent(name)}&video=${videoOn}&audio=${audioOn}`
    );
  };

  return (
    <div className="lobby-container">
      {/* Logo */}
      <div className="lobby-logo">
        <img src={UsitiveLogo} alt="Usitive Meet" />
        <h2>usitive meet</h2>
      </div>

      <div className="lobby-content">
        {/* Video Preview Section */}
        <div className="video-preview">
          {videoOn && localStreamRef.current ? (
            <video ref={videoRef} autoPlay playsInline muted className="video-element" />
          ) : (
            <div className="initials-container">AB</div>
          )}

          {/* Controls */}
          <div className="video-controls">
            <Button shape="circle" icon={<VideoCameraOutlined />} onClick={toggleVideo} />
            <Button shape="circle" icon={<AudioMutedOutlined />} onClick={toggleAudio} />
            <Button shape="circle" icon={<SettingOutlined />} />
          </div>
        </div>

        {/* Meeting Join Form */}
        <div className="join-form">
          <h3>Joining as</h3>
          <p>Quarterly planning meeting</p>
          <Input placeholder="Meeting ID" value={meetingId} onChange={(e) => setMeetingId(e.target.value)} required />
          <Input placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Button type="primary" className="join-btn" onClick={joinMeeting}>
            Join
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;

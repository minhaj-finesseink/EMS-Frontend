/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Select, Button, Slider, Switch } from "antd";
import {
  AudioOutlined,
  AudioMutedOutlined,
  SoundOutlined,
  SoundFilled,
} from "@ant-design/icons";
import SettingsDropdown from "../../SettingsComponents/SettingsDrodown";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

const { Option } = Select;

const AudioSettings = ({ isActive, updatedValue }) => {
  const [microphone, setMicrophone] = useState("Microphone Array (Audio)");
  const [speaker, setSpeaker] = useState("Speaker Array (Audio)");
  const [micVolume, setMicVolume] = useState(100);
  const [speakerVolume, setSpeakerVolume] = useState(100);
  const [micLevel, setMicLevel] = useState(isActive.micInputLevel);
  const [speakerLevel, setSpeakerLevel] = useState(isActive.speakerOutputLevel);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [isSpeakerTesting, setIsSpeakerTesting] = useState(false);

  let micStream = null;
  let micAnimation = null;
  let speakerAnimation = null;

  const microphoneOptions = [
    { label: "Microphone Array (Audio)", value: "microphone1" },
    { label: "USB Microphone", value: "microphone2" },
  ];

  const speakerOptions = [
    { label: "Speaker Array (Audio)", value: "speaker1" },
    { label: "External Speaker", value: "speaker2" },
  ];

  // 🎤 Function to Start/Stop Microphone Test
  const toggleMicTest = async () => {
    if (isMicTesting) {
      setIsMicTesting(false);
      setMicLevel(0);
      if (micStream) micStream.getTracks().forEach((track) => track.stop());
      cancelAnimationFrame(micAnimation);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream = stream;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphoneSource = audioContext.createMediaStreamSource(stream);
      microphoneSource.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function updateMicLevel() {
        analyser.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setMicLevel(Math.min(average, 100));
        micAnimation = requestAnimationFrame(updateMicLevel);
      }

      updateMicLevel();
      setIsMicTesting(true);
    } catch (error) {
      console.error("Microphone test failed:", error);
    }
  };

  // 🔊 Function to Start/Stop Speaker Test
  const toggleSpeakerTest = () => {
    if (isSpeakerTesting) {
      setIsSpeakerTesting(false);
      setSpeakerLevel(0);
      cancelAnimationFrame(speakerAnimation);
      return;
    }

    const testAudio = new Audio("https://www.soundjay.com/button/beep-07.wav");
    testAudio.loop = true;
    testAudio.play();

    function updateSpeakerLevel() {
      setSpeakerLevel(Math.floor(Math.random() * 50) + 10);
      speakerAnimation = setTimeout(updateSpeakerLevel, 500);
    }

    updateSpeakerLevel();
    setIsSpeakerTesting(true);

    // Stop sound after 3 seconds
    setTimeout(() => {
      testAudio.pause();
      testAudio.currentTime = 0;
      setIsSpeakerTesting(false);
      setSpeakerLevel(0);
    }, 3000);
  };

  return (
    <div style={{ width: "90%" }}>
      <h3>Microphone</h3>
      <div
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
        // className="input-container"
      >
        <SettingsDropdown
          options={microphoneOptions}
          defaultValue={microphone}
          onChange={setMicrophone}
          style={{ width: "70%" }}
        />
        <Button
          className={`test-button ${isMicTesting ? "active" : ""}`}
          onClick={toggleMicTest}
          style={{
            height: "40px",
            backgroundColor: "#F5F5F5",
            color: "#5D5669",
            padding: "10px",
            border: 0,
          }}
        >
          <AudioOutlined /> Test
        </Button>
      </div>

      {/* Input Level (Controlled by Test Button) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
          Input level
        </div>
        <div className="level-bar" style={{ backgroundColor: "#F5F5F5" }}>
          <div className="level-fill" style={{ width: `${micLevel}%` }}></div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="volume-control">
        <span style={{ fontSize: "12px" }}>Volume</span>
        <div style={{ margin: "0 10px 0 20px" }}>
          <AudioMutedOutlined />
        </div>
        <span style={{ fontSize: "12px" }}>{micVolume}</span>
        <Slider
          value={micVolume}
          onChange={setMicVolume}
          className="volume-slider"
        />
      </div>
      {/* </div> */}

      {/* Speaker Section */}
      <div>
        <h3>Speaker</h3>
        <div
          style={{
            margin: "20px 0",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <SettingsDropdown
            options={speakerOptions}
            defaultValue={speaker}
            onChange={setSpeaker}
            style={{ width: "70%" }}
          />
          <Button
            className={`test-button ${isSpeakerTesting ? "active" : ""}`}
            onClick={toggleSpeakerTest}
            style={{
              height: "40px",
              backgroundColor: "#F5F5F5",
              color: "#5D5669",
              padding: "10px",
              border: 0,
            }}
          >
            <SoundOutlined /> Test
          </Button>
        </div>

        {/* Output Level (Controlled by Test Button) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ whiteSpace: "nowrap" }}>Output level</div>
          <div className="level-bar" style={{ backgroundColor: "#F5F5F5" }}>
            <div
              className="level-fill"
              style={{ width: `${speakerLevel}%` }}
            ></div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="volume-control">
          <span style={{ fontSize: "12px" }}>Volume</span>
          <div style={{ margin: "0 10px 0 20px" }}>
            <SoundFilled />
          </div>
          <span style={{ fontSize: "12px" }}>{speakerVolume}</span>
          <Slider
            value={speakerVolume}
            onChange={setSpeakerVolume}
            className="volume-slider"
          />
        </div>
      </div>

      <ToggleComponent
        toggleKey="noiseReduction"
        title="Noise reduction"
        description="Reduce your background noise"
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
};

export default AudioSettings;

import React, { useEffect, useRef, useState } from "react";
import SettingsDropdown from "../../SettingsComponents/SettingsDrodown";
import ToggleComponent from "../../SettingsComponents/ToggleComponents";

function VideoSettings({ isActive, updatedValue }) {
  const videoRef = useRef(null);
  const [camera, setCamera] = useState("USB2.O.FHD UVU.Webcam");

  useEffect(() => {
    // Request access to the user's camera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });

    return () => {
      // Cleanup: Stop the camera when the component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const cameraOptions = [
    { label: "Microphone Array (Audio)", value: "microphone1" },
    { label: "USB Microphone", value: "microphone2" },
  ];

  return (
    <div style={{ width: "90%" }}>
      <div
        style={{
          width: "100%",
          height: "330px",
          background: "black",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          autoPlay
          playsInline
        />
      </div>
      <div>
        <h3>Camera</h3>
        <SettingsDropdown
          options={cameraOptions}
          defaultValue={camera}
          onChange={setCamera}
          style={{ width: "100%" }}
        />
      </div>
      <ToggleComponent
        toggleKey="mirrorVideo"
        title="Mirror my video"
        description="Adjust your video to appear as a mirrored reflection for a more natural view."
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleComponent
        toggleKey="displayParticipantsName"
        title="Always display participants names"
        description="The participant's name will always be visible on their video feed."
        isActive={isActive}
        updatedValue={updatedValue}
      />
      <ToggleComponent
        toggleKey="selfView"
        title="Turn Off Self View"
        description="Your self-view is hidden."
        isActive={isActive}
        updatedValue={updatedValue}
      />
    </div>
  );
}

export default VideoSettings;

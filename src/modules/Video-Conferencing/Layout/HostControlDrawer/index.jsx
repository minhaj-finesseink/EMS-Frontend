/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Checkbox, Drawer, Switch } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import toast from "react-hot-toast";
import { updateHostControl } from "../../../../redux/VideoConference/video.action";
import "./style.css";

const CheckboxItem = ({ label, description, checked, onChange }) => (
  <div
    className="host-control-items-container"
    style={{ justifyContent: "flex-start", cursor: "pointer" }}
    onClick={() => onChange({ target: { checked: !checked } })}
  >
    <Checkbox
      checked={checked}
      onChange={onChange}
      className="host-control-custom-checkbox"
      style={{ marginBottom: "20px", pointerEvents: "none" }}
    />
    <div>
      <div className="host-control-title">{label}</div>
      <div className="host-control-desc">{description}</div>
    </div>
  </div>
);

function HostControl({
  isOpen,
  onClose,
  hostData,
  meetingId,
  updateHostControl,
  videoConferenceData,
}) {
  const [controls, setControls] = useState({
    entryEnabled: false,
    hostMustJoinFirst: hostData ? hostData.hostMustJoinFirst : false,
    autoLockMeeting: hostData ? hostData.autoLockMeeting : false,
    inMeetingControlsEnabled: false,
    assignCoHost: hostData ? hostData.assignCoHost : false,
    screenSharingControl: hostData ? hostData.screenSharingControl : false,
    whiteboardControl: hostData ? hostData.whiteboardControl : false,
    recordingControl: hostData ? hostData.recordingControl : false,
    chatControl: hostData ? hostData.chatControl : false,
    audioControl: hostData ? hostData.audioControl : false,
  });

  const handleToggle = (key) => (valueOrEvent) => {
    const checked = valueOrEvent?.target
      ? valueOrEvent.target.checked
      : valueOrEvent;
    setControls((prev) => ({ ...prev, [key]: checked }));
    // console.log(`${key} Enabled:`, checked);
    // console.log("Meeting ID:", meetingId); // Debugging log
    // console.log("Payload Sent:", {
    //   meetingId: meetingId,
    //   hostControl: { [key]: checked }, // Fix object assignment
    // });
    if (key !== "entryEnabled" && key !== "inMeetingControlsEnabled") {
      // console.log("test");
      updateHostControl({
        meetingId: meetingId,
        hostControl: { [key]: checked },
      });
    }
  };

  useEffect(() => {
    if (videoConferenceData.updateHostControlResponse) {
      let data = videoConferenceData.updateHostControlResponse;
      // console.log("data", data);
      if (data.success) {
        toast.success(data.message);
      }
    }
    // videoConferenceData.updateHostControlResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoConferenceData.updateHostControlResponse]);

  return (
    <div>
      <Drawer
        className="host-drawer"
        title={<span style={{ color: "white" }}>Host Control</span>}
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={400}
        closeIcon={
          <CloseOutlined style={{ color: "white", fontSize: "16px" }} />
        }
        styles={{
          body: { backgroundColor: "#1A1A1A", color: "white", padding: "20px" },
          header: { backgroundColor: "#1A1A1A" },
          close: { right: "20px" },
        }}
      >
        <div className="host-control-content">
          <div className="host-control-items-container">
            <div>
              <div className="host-control-title">Entry Controls</div>
              <div className="host-control-desc">
                Manage who can join and how they enter the meeting.
              </div>
            </div>
            <Switch
              checked={controls.entryEnabled}
              onChange={handleToggle("entryEnabled")}
            />
          </div>

          {controls.entryEnabled && (
            <>
              <CheckboxItem
                label="Host Must Join First"
                description="Participants cannot start without the host."
                checked={controls.hostMustJoinFirst}
                onChange={handleToggle("hostMustJoinFirst")}
              />

              <CheckboxItem
                label="Auto-Lock Meeting"
                description="Option to lock the meeting after a set time or a specific number of participants."
                checked={controls.autoLockMeeting}
                onChange={handleToggle("autoLockMeeting")}
              />
            </>
          )}

          <div className="host-control-items-container">
            <div>
              <div className="host-control-title">In-Meeting Controls</div>
              <div className="host-control-desc">
                Manage participant interactions and permissions during the
                meeting.
              </div>
            </div>
            <Switch
              checked={controls.inMeetingControlsEnabled}
              onChange={handleToggle("inMeetingControlsEnabled")}
            />
          </div>

          {controls.inMeetingControlsEnabled && (
            <>
              <CheckboxItem
                label="Assign Co-Host"
                description="When enabled, the host can assign co-hosts to help manage the meeting."
                checked={controls.assignCoHost}
                onChange={handleToggle("assignCoHost")}
              />

              <CheckboxItem
                label="Screen Sharing Control"
                description="When disabled, only the host can share their screen."
                checked={controls.screenSharingControl}
                onChange={handleToggle("screenSharingControl")}
              />

              <CheckboxItem
                label="Whiteboard Control"
                description="When enabled, participants can collaborate using a shared whiteboard."
                checked={controls.whiteboardControl}
                onChange={handleToggle("whiteboardControl")}
              />

              <CheckboxItem
                label="Recording Control"
                description="When enabled, participants can record the meeting."
                checked={controls.recordingControl}
                onChange={handleToggle("recordingControl")}
              />

              <CheckboxItem
                label="Chat Control"
                description="When disabled, only the host can send messages."
                checked={controls.chatControl}
                onChange={handleToggle("chatControl")}
              />

              <CheckboxItem
                label="Audio Control"
                description="When disabled, only the host can unmute themselves."
                checked={controls.audioControl}
                onChange={handleToggle("audioControl")}
              />
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({
  updateHostControl: (values) => dispatch(updateHostControl(values)),
});

HostControl.propTypes = {
  updateHostControl: PropTypes.func,
  // joinMeeting: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(HostControl);

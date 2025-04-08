/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Drawer, message, Popover, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import mailIcon from "../../../../assets/Icons/mail.svg";
import linkIcon from "../../../../assets/Icons/link.svg";
import QR from "../../../../assets/video-call-test-images/QR.png";
import { sendMeetingInvite } from "../../../../redux/VideoConference/video.action";
import "./style.css";

// const FRONTEND_URL = "https://ems-frontend-8eqf.onrender.com";
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

function InviteDrawer({
  sendMeetingInvite,
  isOpen,
  onClose,
  videoConferenceData,
}) {
  const { meetingId } = useParams();
  const [copied, setCopied] = useState(false);
  const [mailSend, setMailSend] = useState(false);
  const [mailId, setMailId] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Function to copy text to clipboard
  const copyToClipboard = async () => {
    setCopied(!copied);
    if (!copied) {
      await navigator.clipboard.writeText(
        `${FRONTEND_URL}/lobby?type=invite&id=${meetingId}`
      );
      message.success("Copied!"); // ✅ Show success message
    }
  };

  const handleSend = () => {
    if (!mailId.trim()) {
      setPopoverContent("Please enter an email");
      setPopoverVisible(true);
      setTimeout(() => setPopoverVisible(false), 2000); // Hide popover after 2 sec
      return;
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mailId)) {
      setPopoverContent("Please enter a valid email");
      setPopoverVisible(true);
      setTimeout(() => setPopoverVisible(false), 2000);
      return;
    }

    // API call"
    setLoading(true);
    sendMeetingInvite({
      email: mailId,
      meetingId: meetingId,
    });
    setPopoverVisible(false);
  };

  useEffect(() => {
    if (videoConferenceData.sendMeetingInviteResponse) {
      let data = videoConferenceData.sendMeetingInviteResponse;
      if (data.success) {
        message.success(data.message);
        setLoading(false);
      }
      // setLoading(false);
      setMailSend(false);
      setMailId("");
    }
    videoConferenceData.sendMeetingInviteResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoConferenceData.sendMeetingInviteResponse]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMailSend(false);
    }, 1000);
  };

  return (
    <Drawer
      className="invite-drawer"
      title={<span style={{ color: "white" }}>Invite</span>}
      placement="right"
      onClose={handleClose}
      open={isOpen}
      width={400} // Adjust width as needed
      closeIcon={<CloseOutlined style={{ color: "white", fontSize: "16px" }} />}
      styles={{
        body: { backgroundColor: "#1A1A1A", color: "white", padding: "20px" },
        header: {
          backgroundColor: "#1A1A1A",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        close: { right: "20px" }, // Moves close icon to rightmost end
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ fontWeight: 600 }}>Details</div>
          <div style={{ cursor: "pointer" }}>
            {FRONTEND_URL}/lobby?type=invite&id={meetingId}
          </div>
          <div style={{ cursor: "pointer" }}>Dial-in nfnefiubfebfbjbvv</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            backgroundColor: copied ? "white" : "#272A32",
            padding: "15px",
            borderRadius: "10px",
            cursor: "pointer",
            color: copied ? "#007DC5" : "",
            justifyContent: copied ? "center" : "",
            height: "25px",
          }}
          onClick={copyToClipboard}
        >
          {!copied && (
            <div style={{ width: "30px" }}>
              <img src={linkIcon} alt="copy icon" />
            </div>
          )}
          <div style={{ fontWeight: 700, marginTop: "3px" }}>
            {copied ? "Copied!" : "Copy invite link"}{" "}
          </div>
        </div>
        <Spin spinning={loading}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              backgroundColor: "#272A32",
              padding: "15px",
              borderRadius: "10px",
              cursor: "pointer",
              height: "25px",
            }}
            onClick={() => setMailSend(true)}
          >
            <div style={{ width: "30px" }}>
              <img src={mailIcon} alt="mail icon" />
            </div>
            {mailSend ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Popover
                  content={
                    <span style={{ color: "red" }}>{popoverContent}</span>
                  }
                  visible={popoverVisible}
                  placement="bottom"
                >
                  <input
                    type="text"
                    placeholder="Enter mail address here"
                    style={{
                      border: "none",
                      outline: "none",
                      background: "none",
                      color: "white",
                      fontWeight: 700,
                      width: "100%",
                    }}
                    value={mailId}
                    onChange={(e) => setMailId(e.target.value)}
                  />
                </Popover>
                {mailId.length > 0 && (
                  <button
                    style={{
                      color: "#007DC5",
                      background: "none",
                      border: "none",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                    onClick={handleSend}
                  >
                    Send
                  </button>
                )}
              </div>
            ) : (
              <div style={{ fontWeight: 700, marginTop: "3px" }}>
                Email invite
              </div>
            )}
          </div>
        </Spin>
        <div style={{ padding: "20px" }}>
          <div
            style={{
              backgroundColor: "#FFF",
              borderRadius: "10px",
              color: "#000000",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#2C2E33",
                marginBottom: "20px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Scan this QR code on your device to join this meeting
            </div>
            <img style={{ cursor: "pointer" }} src={QR} alt="QR Code" />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({
  sendMeetingInvite: (values) => dispatch(sendMeetingInvite(values)),
});

InviteDrawer.propTypes = {
  sendMeetingInvite: PropTypes.func,
  videoConferenceData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteDrawer);

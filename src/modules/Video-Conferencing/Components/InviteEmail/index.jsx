/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Popover, Spin, message } from "antd";
import { connect } from "react-redux";
import linkIcon from "../../../../assets/Icons/link.svg";
import mailIcon from "../../../../assets/Icons/mail.svg";
import { sendMeetingInvite } from "../../../../redux/VideoConference/video.action";
import "./style.css";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const InviteActions = ({ sendMeetingInvite, videoConferenceData }) => {
  const { meetingId } = useParams();
  // const meetingId = "206-e84-3bd";
  const [copied, setCopied] = useState(false);
  const [mailSend, setMailSend] = useState(false);
  const [mailId, setMailId] = useState("");
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverContent, setPopoverContent] = useState("");
  const [loading, setLoading] = useState(false);

  const copyToClipboard = async () => {
    setCopied(!copied);
    if (!copied) {
      await navigator.clipboard.writeText(
        `${FRONTEND_URL}/lobby?type=invite&id=${meetingId}`
      );
      message.success("Copied!");
    }
  };

  const handleSend = () => {
    if (!mailId.trim()) {
      setPopoverContent("Please enter an email");
      setPopoverVisible(true);
      setTimeout(() => setPopoverVisible(false), 2000);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(mailId)) {
      setPopoverContent("Please enter a valid email");
      setPopoverVisible(true);
      setTimeout(() => setPopoverVisible(false), 2000);
      return;
    }

    setLoading(true);
    sendMeetingInvite({ email: mailId, meetingId });
    setPopoverVisible(false);
  };

  useEffect(() => {
    if (videoConferenceData.sendMeetingInviteResponse) {
      const data = videoConferenceData.sendMeetingInviteResponse;
      if (data.success) {
        message.success(data.message);
        setLoading(false);
      }
      setMailSend(false);
      setMailId("");
      videoConferenceData.sendMeetingInviteResponse = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoConferenceData.sendMeetingInviteResponse]);

  return (
    <>
      <div
        className={`copy-box ${copied ? "copied" : ""}`}
        onClick={copyToClipboard}
      >
        {!copied && (
          <div className="icon-wrapper">
            <img src={linkIcon} alt="copy icon" />
          </div>
        )}
        <div className="copy-text">
          {copied ? "Copied!" : "Copy invite link"}
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="email-box" onClick={() => setMailSend(true)}>
          <div className="icon-wrapper">
            <img src={mailIcon} alt="mail icon" />
          </div>

          {mailSend ? (
            <div className="email-input-wrapper">
              <Popover
                content={<span className="popover-text">{popoverContent}</span>}
                visible={popoverVisible}
                placement="bottom"
              >
                <input
                  type="text"
                  placeholder="Enter mail address here"
                  className="email-input"
                  value={mailId}
                  onChange={(e) => setMailId(e.target.value)}
                />
              </Popover>

              {mailId.length > 0 && (
                <button className="send-btn" onClick={handleSend}>
                  Send
                </button>
              )}
            </div>
          ) : (
            <div className="email-text">Email invite</div>
          )}
        </div>
      </Spin>
    </>
  );
};

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({
  sendMeetingInvite: (values) => dispatch(sendMeetingInvite(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteActions);

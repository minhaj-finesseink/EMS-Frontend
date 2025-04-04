/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import VideoIcon from "../../../../../assets/Video-Home-Icons/video.svg";
import UsersIcon from "../../../../../assets/Video-Home-Icons/users.svg";
import CalenderIcon from "../../../../../assets/Video-Home-Icons/schedule.svg";
import CalenderBlackIcon from "../../../../../assets/Video-Home-Icons/calendar-black.svg";
import UserIcon from "../../../../../assets/NewIcons/user-2.svg";
// import TickMarkIcon from "../../../../../assets/NewIcons/tick-mark.svg";
import DummyUserIcon from "../../../../../assets/NewIcons/dummy-user-image.png";
import CopyGreyIcon from "../../../../../assets/NewIcons/copy-grey.svg";
import CopyWhiteIcon from "../../../../../assets/NewIcons/copy-white.svg";
import CopyBlackIcon from "../../../../../assets/NewIcons/copy-black.svg";
import WatchBlackIcon from "../../../../../assets/NewIcons/watch-black.svg";
import WatchWhiteIcon from "../../../../../assets/NewIcons/watch-white.svg";
import Image1 from "../../../../../assets/NewIcons/home-image-1.png";
import Image2 from "../../../../../assets/NewIcons/home-image-2.png";
import CustomButton from "../../../../../components/CustomButton";
import HubDiagram from "../HubDiagram";
import VideoFooter from "../../Footer";
import "./style.css";

function HomePage({ setActivePage }) {
  const navigate = useNavigate();

  const startInstantMeeting = () => {
    navigate("/lobby?type=instant");
  };

  const joinMeeting = () => {
    navigate("/lobby?type=join");
  };

  const meetingOptions = [
    { name: "Instant meeting", icon: VideoIcon, onClick: startInstantMeeting },
    { name: "Join a meeting", icon: UsersIcon, onClick: joinMeeting },
    {
      name: "Schedule a meeting",
      icon: CalenderIcon,
      onClick: () => setActivePage("Calendar"),
    },
  ];

  const buttonNames = [
    "Smart insights",
    "Productivity",
    "Automated summaries",
    "Effortless documentation",
    "Meeting notes",
  ];

  const MeetingCard = ({
    title,
    date,
    time,
    cardStyle,
    showPrimaryButton,
    showTransparentButton,
    showIcon,
    calenderIcon,
    watchIcon,
    copyIcon,
    buttonText,
  }) => {
    return (
      <div className="meetings-card-container" style={cardStyle}>
        <div>
          <div className="meeting-card-title">{title}</div>
          <div className="meeting-card-desc">
            <img width={"15px"} src={calenderIcon} alt="icon" /> {date}
          </div>
          <div className="meeting-card-desc">
            <img src={watchIcon} alt="icon" /> {time}
          </div>
          <div className="meeting-card-desc">
            Meeting ID : HBCUYBCYC <img src={copyIcon} alt="icon" />
          </div>
        </div>
        <div>
          <div className="meeting-card-icon-container">
            {showIcon && (
              <>
                <img
                  className="meeting-card-icon"
                  src={DummyUserIcon}
                  alt="icon"
                />
                <img
                  className="meeting-card-icon"
                  src={DummyUserIcon}
                  alt="icon"
                />
                <img
                  className="meeting-card-icon"
                  src={DummyUserIcon}
                  alt="icon"
                />
                <div className="meeting-card-icon">+50</div>
              </>
            )}
            {showPrimaryButton && (
              <CustomButton
                style={{ width: "90px", height: "34px" }}
                color={"blue"}
              >
                {buttonText}
              </CustomButton>
            )}
            {showTransparentButton && (
              <CustomButton
                style={{ width: "130px", height: "34px" }}
                transparent
              >
                {buttonText}
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="video-home-page-container">
        <div className="video-main-container">
          <div className="meeting-action-container">
            {meetingOptions.map((x, index) => (
              <div className="meeting-card" key={index} onClick={x.onClick}>
                <div>
                  <div className="meeting-icon">
                    <img src={x.icon} alt={x.name} />
                  </div>
                </div>
                <p className="meeting-text">{x.name}</p>
              </div>
            ))}
          </div>
          <div className="user-details-container">
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "grey",
                    borderRadius: "8px",
                  }}
                >
                  <img src={DummyUserIcon} alt="user" width={"100%"} />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "20px",
                    fontWeight: 700,
                    gap: "5px",
                  }}
                >
                  Username{" "}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#5D5669",
                    }}
                  >
                    Job Title: UI/UX Designer
                  </span>
                </div>
              </div>
              <div>
                <button className="home-upgrade-button">Upgrade Plan</button>
              </div>
            </div>
            <div className="home-meeting-id-container">
              <div>
                Personal Meeting ID: 123456799{" "}
                <img src={CopyGreyIcon} alt="icon" />
              </div>
              <div>
                {" "}
                <div className="user-icon-container">
                  <img src={UserIcon} alt="user" />
                </div>{" "}
                Manage Users
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: "10px" }}>
            <div className="video-grid-container">
              <div className="upcoming-meeting-header">
                <div className="upcoming-meeting-title">Upcoming meetings</div>
                <div className="upcoming-meeting-button">View all</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <MeetingCard
                  cardStyle={{ backgroundColor: "#007DC5", color: "white" }}
                  title="Maclaren's Meeting"
                  date="January 29, 2025"
                  time="04:30 PM - 05:30 PM"
                  showIcon={true}
                  calenderIcon={CalenderIcon}
                  watchIcon={WatchWhiteIcon}
                  copyIcon={CopyWhiteIcon}
                />
                <MeetingCard
                  cardStyle={{ backgroundColor: "#007DC5", color: "white" }}
                  title="Config - Designer's Meet"
                  date="January 29, 2025"
                  time="04:30 PM - 05:30 PM"
                  showIcon={true}
                  calenderIcon={CalenderIcon}
                  watchIcon={WatchWhiteIcon}
                  copyIcon={CopyWhiteIcon}
                />
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: "10px" }}>
            <div className="video-grid-container">
              <div className="upcoming-meeting-header">
                <div className="upcoming-meeting-title">Recent meetings</div>
                <div className="upcoming-meeting-button">View all</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                <MeetingCard
                  cardStyle={{ border: "1px solid #A2A2A2" }}
                  title="Future of UX - Webinar"
                  date="January 29, 2025"
                  time="04:30 PM - 05:30 PM"
                  showPrimaryButton={true}
                  buttonText={"Re-join"}
                  calenderIcon={CalenderBlackIcon}
                  watchIcon={WatchBlackIcon}
                  copyIcon={CopyBlackIcon}
                />
                <MeetingCard
                  cardStyle={{ border: "1px solid #A2A2A2" }}
                  title="Project Review"
                  date="January 29, 2025"
                  time="04:30 PM - 05:30 PM"
                  showTransparentButton={true}
                  buttonText={"View Summary"}
                  calenderIcon={CalenderBlackIcon}
                  watchIcon={WatchBlackIcon}
                  copyIcon={CopyBlackIcon}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, padding: "10px" }}>
            <div className="video-grid-container" style={{ padding: 0 }}>
              <div style={{ display: "flex", padding: 0 }}>
                <div
                  style={{
                    flex: 1,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: 700 }}>
                    AI-driven summaries and notes for seamless meetings
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#5D5669",
                    }}
                  >
                    Keep track of decisions, tasks, and insights with AI-powered
                    summaries. Focus on conversations while we handle the notes.
                  </div>
                  <div className="video-grid-content-buttons-container">
                    {buttonNames.map((name, index) => (
                      <div key={index} className="video-grid-content-buttons">
                        {name}
                      </div>
                    ))}
                  </div>
                  <button className="upgrade-button">Upgrade Now</button>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="home-image-container">
                    <img src={Image1} alt="img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: "10px" }}>
            <div
              className="video-grid-container"
              style={{ padding: 0, height: "100%" }}
            >
              <div style={{ display: "flex", height: "100%" }}>
                <div
                  style={{
                    flex: 1,
                    padding: "20px 0 0 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div style={{ fontSize: "20px", fontWeight: 700 }}>
                    Seamless Video Calls, Anytime, Anywhere
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#5D5669",
                    }}
                  >
                    Get the Usitive Meet app and stay connected with
                    high-quality video meetings on my device.
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#5D5669",
                    }}
                  >
                    Hello
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#5D5669",
                    }}
                  >
                    Hello
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#5D5669",
                    }}
                  >
                    Hello
                  </div>
                  <button className="upgrade-button">Download Now</button>
                </div>
                {/* Right section with image and colored background */}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  {/* Background color stripes */}
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      height: "100%",
                      display: "flex",
                      zIndex: 0,
                      transform: "rotate(50deg)",
                      top: "10%",
                    }}
                  >
                    <div
                      style={{ width: "35px", backgroundColor: "#007DC5" }}
                    ></div>
                    <div
                      style={{ width: "35px", backgroundColor: "#008000" }}
                    ></div>
                    <div
                      style={{ width: "35px", backgroundColor: "#FF0000" }}
                    ></div>
                    <div
                      style={{ width: "35px", backgroundColor: "#FFD700" }}
                    ></div>
                  </div>

                  {/* Image */}
                  <img
                    src={Image2}
                    alt="Image"
                    style={{
                      marginTop: "50px",
                      width: "calc(100% - 64px)",
                      position: "relative",
                      zIndex: 1, // Keep the image above the colored background
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "10px" }}>
          <div
            className="video-grid-container"
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "20px",
                // maxWidth: "500px",
              }}
            >
              <div style={{ fontSize: "38px", fontWeight: 700 }}>
                Enhance Your Meetings <br />
                with Integrations
              </div>
              <div
                style={{ fontSize: "14px", fontWeight: 500, color: "#5D5669" }}
              >
                Seamlessly integrate Ustive Meet with Slack,
                <br /> Google Calendar, and more. Stay connected <br /> and
                organized effortlessly
              </div>
            </div>
            <HubDiagram />
          </div>
        </div>
      </div>
      <div>
        <VideoFooter />
      </div>
    </>
  );
}

export default HomePage;

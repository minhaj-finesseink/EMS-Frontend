import React from "react";
import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import videoIcon from "../../../../../assets/Icons/new-video.svg";
import calendarIcon from "../../../../../assets/Icons/calendar.svg";
import calendarBlackIcon from "../../../../../assets/Icons/calendar-black.svg";
import usersIcon from "../../../../../assets/Icons/three-users-icon.svg";
import copyIcon from "../../../../../assets/Icons/copy-grey.svg";
import greenTickIcon from "../../../../../assets/Icons/green-tick.svg";
import CustomButton from "../../../../../components/CustomButton";
import testImg1 from "../../../../../assets/video-call-test-images/test-image1.svg";
import testImg2 from "../../../../../assets/video-call-test-images/test-image2.svg";
import testImg3 from "../../../../../assets/video-call-test-images/test-image3.svg";
import Image1 from "../../../../../assets/Usitive-meet/home-page-image-1.png";
import Image2 from "../../../../../assets/Usitive-meet/home-page-image-2.png";
import slackIcon from "../../../../../assets/Usitive-meet/slack.png";
import trelloIcon from "../../../../../assets/Usitive-meet/trello.png";
import googleCalendarIcon from "../../../../../assets/Usitive-meet/google-calendar.png";
import outlookIcon from "../../../../../assets/Usitive-meet/outlook.png";
import "./style.css";

function Home() {
  const navigate = useNavigate();

  const startInstantMeeting = () => {
    navigate("/lobby?type=instant");
  };

  const joinMeeting = () => {
    navigate("/lobby?type=join");
  };

  const meetingActions = [
    {
      icon: videoIcon,
      name: "Instant meeting",
      onClick: startInstantMeeting,
    },
    {
      icon: usersIcon,
      name: "Join a meeting",
      onClick: joinMeeting,
    },
    {
      icon: calendarIcon,
      name: "Schedule a meeting",
    },
  ];

  const UpcomingMeetings = [
    {
      title: `Grant Maclaren's Usitive Meeting`,
      dateTime: "29 Jan , 04:30pm - 05:30pm",
      id: "HBCUYBCYC",
      users: "53",
    },
    {
      title: `Config - Designers meet`,
      dateTime: "03 Feb , 09:30am - 04:00pm",
      id: "LKCUEFRYC",
      users: "28",
    },
  ];

  return (
    <div>
      <div className="video-dashboard-card-container">
        <div className="video-dashboard-grid">
          <div>
            <div className="meeting-action-grid">
              {meetingActions.map((x, i) => (
                <div key={i} className="video-dashboard-card">
                  <div>
                    <div className="meeting-action-container">
                      <div
                        className="meeting-actions"
                        // onClick={() => navigate("/video-home-screen")}
                        onClick={x.onClick}
                      >
                        <img src={x.icon} alt={`${x.name} icon`} />
                      </div>
                    </div>
                  </div>
                  <div className="meeting-action-name">{x.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 0 }} className="video-dashboard-card">
            <div className="meeting-user-details">
              <div style={{ display: "flex", gap: "10px" }}>
                <img
                  style={{
                    width: "86px",
                    height: "86px",
                    backgroundColor: "#ccc",
                    borderRadius: "8px",
                  }}
                  src=""
                  alt="image"
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#464454",
                    }}
                  >
                    User name
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#464454",
                    }}
                  >
                    Job Title: UI/UX Designer
                  </div>
                </div>
              </div>
              <div>
                <CustomButton color={"blue"}>Upgrade Plan</CustomButton>
              </div>
            </div>
            <div className="meeting-user-id">
              Personal Meeting ID : 123 456 7890
            </div>
          </div>
        </div>
        <div className="video-dashboard-grid">
          <div className="video-dashboard-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#464454",
                }}
              >
                Upcoming meetings
              </div>
              <div>
                <CustomButton
                  style={{
                    width: "75px",
                    height: "30px",
                    color: "grey",
                    border: "none",
                  }}
                  transparent
                >
                  View all
                </CustomButton>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <Row gutter={20}>
                {UpcomingMeetings.map((x, i) => (
                  <Col key={i} span={12}>
                    <div
                      style={{
                        border: "1px solid #CCC",
                        borderRadius: "10px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        height: "calc(100% - 40px)",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#464454",
                          }}
                        >
                          {x.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <img src={calendarBlackIcon} alt="calendar" />
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#464454",
                            }}
                          >
                            {x.dateTime}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#464454",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          ID: {x.id} <img src={copyIcon} alt="copy" />
                        </div>
                      </div>
                      <div>
                        <div style={{ position: "relative", display: "flex" }}>
                          <img
                            style={{ position: "relative" }}
                            src={testImg1}
                            alt="image"
                          />
                          <img
                            style={{ position: "relative", left: "-8px" }}
                            src={testImg2}
                            alt="image"
                          />
                          <img
                            style={{ position: "relative", left: "-16px" }}
                            src={testImg3}
                            alt="image"
                          />
                          <div
                            style={{
                              position: "relative",
                              left: "-24px",
                              backgroundColor: "#007DC5",
                              borderRadius: "50%",
                              height: "25px",
                              width: "25px",
                              color: "#ffffff",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "12px",
                            }}
                          >
                            +{x.users.toString().charAt(0)}0
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#464454",
                          }}
                        >
                          {x.users} users are waiting.
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
          <div className="video-dashboard-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#464454",
                }}
              >
                Recent meetings{" "}
              </div>
              <div>
                <CustomButton
                  style={{
                    width: "75px",
                    height: "30px",
                    color: "grey",
                    border: "none",
                  }}
                  transparent
                >
                  View all
                </CustomButton>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <Row gutter={20}>
                {UpcomingMeetings.map((x, i) => (
                  <Col key={i} span={12}>
                    <div
                      style={{
                        border: "1px solid #CCC",
                        borderRadius: "10px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        height: "calc(100% - 40px)",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            color: "#464454",
                          }}
                        >
                          {x.title}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <img src={calendarBlackIcon} alt="calendar" />
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#464454",
                            }}
                          >
                            {x.dateTime}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#464454",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          ID: {x.id} <img src={copyIcon} alt="copy" />
                        </div>
                      </div>
                      <div>
                        <div style={{ position: "relative", display: "flex" }}>
                          <img
                            style={{ position: "relative" }}
                            src={testImg1}
                            alt="image"
                          />
                          <img
                            style={{ position: "relative", left: "-8px" }}
                            src={testImg2}
                            alt="image"
                          />
                          <img
                            style={{ position: "relative", left: "-16px" }}
                            src={testImg3}
                            alt="image"
                          />
                          <div
                            style={{
                              position: "relative",
                              left: "-24px",
                              backgroundColor: "#007DC5",
                              borderRadius: "50%",
                              height: "25px",
                              width: "25px",
                              color: "#ffffff",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "12px",
                            }}
                          >
                            +{x.users.toString().charAt(0)}0
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#464454",
                          }}
                        >
                          {x.users} users are waiting.
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
        <div className="video-dashboard-grid last-grid">
          <div style={{ padding: 0 }} className="video-dashboard-card">
            <div style={{ width: "100%", display: "flex" }}>
              <div
                style={{
                  width: "54%",
                  padding: "20px 20px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    AI-driven summaries and notes for seamless meetings.
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#464454",
                    }}
                  >
                    Keep track of decisions, tasks, and insights with AI-powered
                    summaries. Focus on conversations while we handle the notes.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      margin: "10px 0",
                    }}
                  >
                    <div
                      style={{
                        border: " 2px solid #D0C2E8",
                        width: "fit-content",
                        padding: "10px",
                        borderRadius: "8px",
                        color: "#47464D",
                        fontSize: "12px",
                      }}
                    >
                      Smart insights
                    </div>
                    <div
                      style={{
                        border: " 2px solid #D0C2E8",
                        width: "fit-content",
                        padding: "10px",
                        borderRadius: "8px",
                        color: "#47464D",
                        fontSize: "12px",
                      }}
                    >
                      Automated summaries
                    </div>
                    <div
                      style={{
                        border: " 2px solid #D0C2E8",
                        width: "fit-content",
                        padding: "10px",
                        borderRadius: "8px",
                        color: "#47464D",
                        fontSize: "12px",
                      }}
                    >
                      Productivity
                    </div>
                    <div
                      style={{
                        border: " 2px solid #D0C2E8",
                        width: "fit-content",
                        padding: "10px",
                        borderRadius: "8px",
                        color: "#47464D",
                        fontSize: "12px",
                      }}
                    >
                      Effortless documentation
                    </div>
                    <div
                      style={{
                        border: " 2px solid #D0C2E8",
                        width: "fit-content",
                        padding: "10px",
                        borderRadius: "8px",
                        color: "#47464D",
                        fontSize: "12px",
                      }}
                    >
                      Meeting notes
                    </div>
                  </div>
                </div>
                <div>
                  <CustomButton color={"blue"}>Upgrade Now</CustomButton>
                </div>
              </div>
              <div
                style={{
                  width: "calc(46% - 40px)",
                  padding: "20px",
                  backgroundColor: "#007DC5",
                  borderRadius: "0 10px 10px 0",
                }}
              >
                <img height={"100%"} width={"100%"} src={Image1} alt="image" />
              </div>
            </div>
          </div>
          <div className="video-dashboard-card">
            <div style={{ width: "100%", display: "flex" }}>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      marginTop: "10px",
                    }}
                  >
                    Seamless Video Calls, Anytime, Anywhere.
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#464454",
                    }}
                  >
                    Get the Usitive Meet app and stay connected with
                    high-quality video meetings on any device.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "14px",
                      fontWeight: 500,
                      alignItems: "center",
                    }}
                  >
                    <img src={greenTickIcon} alt="" />
                    Fast & secure video calls
                  </div>{" "}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "14px",
                      fontWeight: 500,
                      alignItems: "center",
                    }}
                  >
                    <img src={greenTickIcon} alt="" />
                    Easy meeting scheduling
                  </div>{" "}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "14px",
                      fontWeight: 500,
                      alignItems: "center",
                    }}
                  >
                    <img src={greenTickIcon} alt="" />
                    AI summary & notes
                  </div>
                </div>
                <div>
                  <CustomButton color={"blue"}>Download Now</CustomButton>
                </div>
              </div>
              <div style={{ width: "50%" }}>
                <img height={"100%"} width={"100%"} src={Image2} alt="image" />
              </div>
            </div>
          </div>
          <div>
            <div>
              <img src={slackIcon} alt="slack icon" />
            </div>
            <div>
              <img src={trelloIcon} alt="trello icon" />
            </div>
            <div>
              <img src={googleCalendarIcon} alt="google calendar icon" />
            </div>
            <div>
              <img src={outlookIcon} alt="outlook icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

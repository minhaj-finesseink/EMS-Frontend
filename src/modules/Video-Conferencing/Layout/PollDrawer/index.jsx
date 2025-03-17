/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Drawer, Input, message, Space, Progress } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import CustomButton from "../../../../components/CustomButton";
import socket from "../../socket";
import QAIcon from "../../../../assets/Icons/Q&A.svg";
import pollIcon from "../../../../assets/Icons/polls.svg";
import "./style.css";

function PollDrawer({ isOpen, onClose }) {
  const { meetingId } = useParams();
  const [options, setOptions] = useState(["", ""]);
  const [question, setQuestion] = useState("");
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [voteResults, setVoteResults] = useState({});
  const [hasVoted, setHasVoted] = useState({}); // Track users who voted
  const [selectedItem, setSelectedItem] = useState("poll");
  const [progressBar, setProgressBar] = useState(false);

  useEffect(() => {
    socket.on("new-poll", (pollData) => {
      // setPolls((prevPolls) => [...prevPolls, { ...pollData, results: {} }]);
      setPolls((prevPolls) => {
        // Prevent duplicate poll entries
        if (prevPolls.some((poll) => poll.pollId === pollData.pollId)) {
          return prevPolls;
        }
        return [...prevPolls, { ...pollData, results: {} }];
      });
    });

    socket.on("vote", ({ pollId, option }) => {
      setVoteResults((prevResults) => {
        const updatedResults = { ...prevResults };

        if (!updatedResults[pollId]) {
          updatedResults[pollId] = {};
        }

        if (!updatedResults[pollId][option]) {
          updatedResults[pollId][option] = 0;
        }

        updatedResults[pollId][option] += 1;

        return updatedResults;
      });
    });

    return () => {
      socket.off("new-poll");
      socket.off("vote");
    };
  }, []);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const createPoll = () => {
    if (!question.trim()) {
      message.error("Please enter a question for the poll.");
      return;
    }

    const pollId = `${Date.now()}`;
    const pollData = {
      pollId,
      question,
      options,
      meetingId,
    };

    socket.emit("new-poll", pollData);

    setPolls((prevPolls) => [...prevPolls, { ...pollData, results: {} }]);
    setQuestion("");
    setOptions(["", ""]);
  };

  const handleCheckboxChange = (pollId, option) => {
    setSelectedOptions({ [pollId]: option }); // Allow only one selection
  };

  const handleDoneClick = (pollId) => {
    if (!selectedOptions[pollId]) {
      message.error("Please select an option.");
      return;
    }

    const selectedOption = selectedOptions[pollId];
    socket.emit("vote", { pollId, option: selectedOption, meetingId });

    setVoteResults((prevResults) => {
      const updatedResults = { ...prevResults };

      if (!updatedResults[pollId]) {
        updatedResults[pollId] = {};
      }

      if (!updatedResults[pollId][selectedOption]) {
        updatedResults[pollId][selectedOption] = 0;
      }

      updatedResults[pollId][selectedOption] += 1;

      return updatedResults;
    });

    setHasVoted((prev) => ({
      ...prev,
      [pollId]: true, // Mark poll as voted
    }));

    setProgressBar(true);
  };

  return (
    <Drawer
      className="poll-drawer"
      title={
        <span style={{ color: "white" }}>
          {polls.length === 0 ? "Polling and Q&A" : "Live Poll"}
        </span>
      }
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={400}
      closeIcon={<CloseOutlined style={{ color: "white", fontSize: "16px" }} />}
      styles={{
        body: { backgroundColor: "#1A1A1A", color: "white", padding: "20px" },
        header: {
          backgroundColor: "#1A1A1A",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      }}
    >
      <div>
        {polls.length === 0 ? (
          <>
            <div
              style={{
                backgroundColor: "#272A32",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "10px",
                  border: selectedItem === "poll" ? "1px solid #fff" : 0,
                  borderRadius: "6px",
                  width: "100%",
                  justifyContent: "center",
                }}
                onClick={() => setSelectedItem("poll")}
              >
                <div
                  style={{
                    backgroundColor: "#007DC5",
                    padding: "10px",
                    borderRadius: "6px",
                    width: "30px",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={pollIcon} alt="polls" />
                </div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>Polls</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "10px",
                  border: selectedItem !== "poll" ? "1px solid #fff" : 0,
                  borderRadius: "6px",
                  width: "100%",
                  justifyContent: "center",
                }}
                onClick={() => setSelectedItem("qa")}
              >
                <div
                  style={{
                    backgroundColor: "#007DC5",
                    padding: "10px",
                    borderRadius: "6px",
                    width: "30px",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={QAIcon} alt="Q&A" />
                </div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>Q&A</div>
              </div>
            </div>
            <div style={{ color: "white", margin: "20px 0 10px" }}>
              QUESTION
            </div>
            <Input
              className="poll-drawer-input"
              placeholder="What is your poll question?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div style={{ color: "white", margin: "20px 0 10px" }}>OPTIONS</div>
            <Space direction="vertical" style={{ width: "100%" }}>
              {options.map((option, index) => (
                <Input
                  className="poll-drawer-input"
                  key={index}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => {
                    const updatedOptions = [...options];
                    updatedOptions[index] = e.target.value;
                    setOptions(updatedOptions);
                  }}
                />
              ))}
            </Space>
            <div>
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={addOption}
                style={{ color: "#CCCCCC82", marginTop: "10px" }}
              >
                Add option
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <CustomButton
                type="primary"
                block
                color={"blue"}
                onClick={createPoll}
                disabledCondition={options.some(
                  (option) => option.trim() === ""
                )}
              >
                Create Poll
              </CustomButton>
            </div>
          </>
        ) : (
          <>
            <div>
              <div
                style={{
                  color: "#D9D9D991",
                  fontSize: "12px",
                  fontWeight: 500,
                  marginBottom: "20px",
                }}
              >
                QUESTION 1 OF 1: MULTIPLE-CHOICE
              </div>
              {polls.map((poll) => (
                <div key={poll.pollId} className="poll-container">
                  <div
                    style={{
                      fontFamily: "Inter",
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "10px",
                    }}
                  >
                    {poll.question}
                  </div>

                  {poll.options.map((option, index) => {
                    const totalVotes = Object.values(
                      voteResults[poll.pollId] || {}
                    ).reduce((sum, val) => sum + val, 0);
                    const voteCount = voteResults[poll.pollId]?.[option] || 0;
                    const votePercentage =
                      totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

                    return (
                      <div
                        key={index}
                        style={{ marginBottom: "10px", width: "100%" }}
                      >
                        {!hasVoted[poll.pollId] ? (
                          <label className="poll-option">
                            <input
                              type="checkbox"
                              checked={selectedOptions[poll.pollId] === option}
                              onChange={() =>
                                handleCheckboxChange(poll.pollId, option)
                              }
                            />
                            <span className="custom-checkbox"></span>
                            {option}
                          </label>
                        ) : (
                          <div
                            style={{
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "500",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {option} <span>{voteCount} votes</span>
                          </div>
                        )}
                        {progressBar && (
                          <Progress
                            percent={votePercentage}
                            showInfo={false}
                            strokeColor={{
                              "0%": "#007DC5",
                              "100%": "#007DC5",
                            }}
                            trailColor="#007DC54D"
                            style={{ width: "100%" }}
                          />
                        )}
                      </div>
                    );
                  })}

                  {!hasVoted[poll.pollId] && (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="done-button"
                        onClick={() => handleDoneClick(poll.pollId)}
                        disabled={!selectedOptions[poll.pollId]}
                      >
                        Vote
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {progressBar && (
                <CustomButton style={{ marginTop: "50px" }} color={"red"} block>
                  End Poll
                </CustomButton>
              )}
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}

export default PollDrawer;

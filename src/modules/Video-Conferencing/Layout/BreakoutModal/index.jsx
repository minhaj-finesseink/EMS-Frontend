/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Checkbox, Collapse, Input, Modal, Radio } from "antd";
import { CloseOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import socket from "../../socket";
import plus from "../../../../assets/Icons/plus.svg";
import more from "../../../../assets/Icons/more - vertical.svg";
import CustomButton from "../../../../components/CustomButton";
import "./style.css";

const { Panel } = Collapse;

function Breakout({ isOpen, onClose }) {
  const [roomCount, setRoomCount] = useState(1);
  const [duration, setDuration] = useState(5);
  const [selectedOption, setSelectedOption] = useState(null);
  const [breakoutContent, setBreakoutContent] = useState("create");
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [rooms, setRooms] = useState([{ name: "Room 1", participants: [] }]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [renaming, setRenaming] = useState(false);

  // Function to handle increment and decrement of room count
  const handleRoomCountChange = (action) => {
    setRoomCount((prev) => {
      if (action === "increment") {
        return prev + 1;
      } else if (action === "decrement" && prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  // Function to handle increment and decrement of duration
  const handleDurationChange = (action) => {
    setDuration((prev) => {
      if (action === "increment") {
        return prev + 5;
      } else if (action === "decrement" && prev > 5) {
        return prev - 5;
      }
      return prev;
    });
  };

  // Handler for radio button change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Fetch participants list from socket
  useEffect(() => {
    socket.on("update-participants", (updatedParticipants) => {
      const participantsArray = Object.values(updatedParticipants);
      setParticipants(participantsArray);
    });

    return () => {
      socket.off("update-participants");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // Add new room
  const handleAddRoom = () => {
    const newRoomName = `Room ${rooms.length + 1}`;
    setRooms((prevRooms) => [
      ...prevRooms,
      { name: newRoomName, participants: [] },
    ]);
  };

  // Assign selected participants to a room
  const handleAssignToRoom = (roomName) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.name === roomName
          ? {
              ...room,
              participants: [...room.participants, ...selectedParticipants],
            }
          : room
      )
    );
    setParticipants((prev) =>
      prev.filter(
        (participant) => !selectedParticipants.includes(participant.name)
      )
    );
    setSelectedParticipants([]);
  };

  // Delete room
  const handleDeleteRoom = (roomName) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.name !== roomName));
  };

  // Rename room
  const handleRenameRoom = (roomName) => {
    setEditingRoom(roomName);
    setRenaming(true);
  };

  const handleSaveRename = (newName) => {
    if (newName.trim() !== "") {
      // Check if new name is not empty
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.name === editingRoom ? { ...room, name: newName } : room
        )
      );
    }
    setEditingRoom(null); // Exit rename mode
    setRenaming(false); // Disable renaming state
  };

  const roomMenu = (roomName) => (
    <Menu
      style={{ backgroundColor: "#191B23" }}
      items={[
        {
          key: "rename",
          label: (
            <div
              style={{
                backgroundColor: "#191B23",
                color: "#fff",
                padding: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleRenameRoom(roomName)}
            >
              Rename
            </div>
          ),
        },
        {
          key: "delete",
          label: (
            <div
              style={{
                backgroundColor: "#191B23",
                color: "#fff",
                padding: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleDeleteRoom(roomName)}
            >
              Delete
            </div>
          ),
        },
      ]}
    />
  );

  // Assign to rooms menu
  const menu = (
    <Menu
      style={{ backgroundColor: "#191B23" }}
      items={
        rooms.length > 0
          ? rooms.map((room) => ({
              key: room.name,
              label: (
                <div
                  style={{
                    backgroundColor: "#191B23",
                    color: "#fff",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAssignToRoom(room.name)}
                >
                  {room.name}
                </div>
              ),
            }))
          : [
              {
                key: "no-rooms",
                label: (
                  <div
                    style={{
                      backgroundColor: "#191B23",
                      color: "#fff",
                      padding: "5px",
                      cursor: "not-allowed",
                    }}
                  >
                    No rooms available
                  </div>
                ),
              },
            ]
      }
    />
  );

  const handleCheckboxChange = (participant) => {
    setSelectedParticipants((prevSelected) => {
      if (prevSelected.includes(participant)) {
        return prevSelected.filter((p) => p !== participant);
      } else {
        return [...prevSelected, participant];
      }
    });
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
        className="breakout-modal"
        width={breakoutContent === "start" ? "60%" : "40%"}
        closeIcon={null}
      >
        {breakoutContent === "create" ? (
          <div className="breakout-container">
            <div className="breakout-header">
              <div></div>
              <div>Breakout rooms</div>
              <div style={{ cursor: "pointer" }} onClick={onClose}>
                <CloseOutlined />
              </div>{" "}
            </div>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <div>How many rooms?</div>
                <div className="breakout-time-controller-container">
                  <div
                    className="breakout-time-controller"
                    onClick={() => handleRoomCountChange("decrement")}
                    style={{ cursor: "pointer" }}
                  >
                    -
                  </div>
                  <div className="breakout-time-controller">{roomCount}</div>
                  <div
                    className="breakout-time-controller"
                    onClick={() => handleRoomCountChange("increment")}
                    style={{ cursor: "pointer" }}
                  >
                    +
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <div>Duration (minutes)</div>
                <div className="breakout-time-controller-container">
                  <div
                    className="breakout-time-controller"
                    onClick={() => handleDurationChange("decrement")}
                    style={{ cursor: "pointer" }}
                  >
                    -
                  </div>
                  <div className="breakout-time-controller">{duration}</div>
                  <div
                    className="breakout-time-controller"
                    onClick={() => handleDurationChange("increment")}
                    style={{ cursor: "pointer" }}
                  >
                    +
                  </div>
                </div>
              </div>{" "}
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                textAlign: "center",
                margin: "10px 0",
              }}
            >
              How do you want to assign rooms?
            </div>
            <Radio.Group
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              onChange={handleOptionChange}
              value={selectedOption}
            >
              <Radio
                value="manual"
                style={{
                  color: "white",
                  border: "1px solid #8F9099CC",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                Assign Participants Manually
              </Radio>
              <Radio
                value="automatic"
                style={{
                  color: "white",
                  border: "1px solid #8F9099CC",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                Assign Participants Automatically
              </Radio>
            </Radio.Group>
            <div className="breakout-btn-container">
              <button className="breakout-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                className="breakout-create-btn"
                disabled={!selectedOption}
                onClick={() => setBreakoutContent("start")}
              >
                Create
              </button>
            </div>
          </div>
        ) : (
          <div className="breakout-container">
            <div className="breakout-header">
              <div onClick={() => setBreakoutContent("create")}>{"<"}</div>
              <div>Assign Participants</div>
              <div style={{ cursor: "pointer" }} onClick={onClose}>
                <CloseOutlined />
              </div>{" "}
            </div>
            <div style={{ display: "flex", gap: "25px" }}>
              <div
                style={{
                  width: "40%",
                  border: "1px solid #2C2E37",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: 600 }}>
                    Main room - {participants.length}
                  </div>
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <Button
                      type="default"
                      style={{
                        borderRadius: "8px",
                        padding: "10px",
                        background: "none",
                        height: "38px",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      Assign to rooms
                    </Button>
                  </Dropdown>
                </div>

                <div>
                  <div
                    style={{
                      padding: "10px 0",
                      color: "#fff",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                    className="custom-checkbox-container"
                  >
                    {participants.map((participant, index) => (
                      <div key={index} style={{ marginBottom: "5px" }}>
                        <Checkbox
                          onChange={() =>
                            handleCheckboxChange(participant.name)
                          }
                          checked={selectedParticipants.includes(
                            participant.name
                          )}
                          style={{ color: "#fff" }}
                        >
                          {participant.name}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: "60%",
                  border: "1px solid #2C2E37",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: 600 }}>
                    Breakout rooms - {rooms.length}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      padding: "5px",
                      border: "1px solid #D9D9D926",
                    }}
                    onClick={handleAddRoom}
                  >
                    <img src={plus} alt="plus icon" />
                  </div>
                </div>
                <Collapse
                  expandIconPosition="left"
                  expandIcon={({ isActive }) =>
                    isActive ? (
                      <DownOutlined style={{ color: "#fff" }} />
                    ) : (
                      <RightOutlined style={{ color: "#fff" }} />
                    )
                  }
                  style={{
                    backgroundColor: "#181A1D",
                    border: "none",
                    boxShadow: "none",
                  }}
                  className="custom-collapse"
                >
                  {rooms.map((room, index) => (
                    <Collapse.Panel
                      header={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          {/* <span style={{ color: "#fff", fontWeight: 600 }}>
                            {room.name} ({room.participants.length})
                          </span> */}
                          {editingRoom === room.name ? (
                            <Input
                              defaultValue={room.name}
                              onBlur={(e) => handleSaveRename(e.target.value)}
                              onPressEnter={(e) =>
                                handleSaveRename(e.target.value)
                              } // Save on Enter
                              autoFocus
                              style={{
                                backgroundColor: "#2C2E37",
                                border: "1px solid #2C2E37",
                                color: "#fff",
                                borderRadius: "5px",
                                padding: "2px 5px",
                                width: "80%",
                              }}
                              onClick={(e) => e.stopPropagation()} // Prevent collapse toggle
                            />
                          ) : (
                            <span style={{ color: "#fff", fontWeight: 600 }}>
                              {room.name} ({room.participants.length})
                            </span>
                          )}

                          <Dropdown
                            overlay={roomMenu(room.name)}
                            trigger={["click"]}
                          >
                            <span
                              style={{
                                cursor: "pointer",
                                color: "#fff",
                                padding: "0 5px",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <img src={more} alt="more icon" />
                            </span>
                          </Dropdown>
                        </div>
                      }
                      key={index}
                      style={{
                        backgroundColor: "#181A1D",
                        border: "none",
                        boxShadow: "none",
                        padding: "0",
                      }}
                    >
                      <div
                        style={{
                          padding: "0",
                          color: "#fff",
                          backgroundColor: "#181A1D",
                          border: "none",
                        }}
                      >
                        {room.participants.length > 0 ? (
                          room.participants.map((p) => (
                            <div
                              key={p}
                              style={{ color: "#FFFFFFA1", padding: "0 40px" }}
                            >
                              {p}
                            </div>
                          ))
                        ) : (
                          <div
                            style={{ color: "#FFFFFFA1", padding: "0 40px" }}
                          >
                            No participants
                          </div>
                        )}
                      </div>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <CustomButton color={"blue"}>Start rooms</CustomButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Breakout;

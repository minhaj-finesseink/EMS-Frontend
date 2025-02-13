/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button, Drawer, Input, Space, Switch } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import CustomButton from "../../../../components/CustomButton";
import "./style.css";

function PollDrawer({ isOpen, onClose }) {
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [multipleAnswer, setMultipleAnswer] = useState(false);

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  return (
    <Drawer
      className="poll-drawer"
      title={<span style={{ color: "white" }}>Poll</span>}
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={400} // Adjust width as needed
      closeIcon={<CloseOutlined style={{ color: "white", fontSize: "16px" }} />}
      styles={{
        body: { backgroundColor: "#1A1A1A", color: "white", padding: "20px" },
        header: {
          backgroundColor: "#1A1A1A",
          //   borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        close: { right: "20px" }, // Moves close icon to rightmost end
      }}
    >
      <div style={{}}>
        {/* Question Input */}
        <div style={{ color: "white", margin: "50px 0 10px" }}>QUESTIONS</div>
        <Input
          className="poll-drawer-input"
          placeholder="What is your poll question?"
        />

        {/* Options Section */}
        <div style={{ color: "white", margin: "50px 0 10px" }}>OPTIONS</div>
        <Space direction="vertical" style={{ width: "100%" }}>
          {options.map((option, index) => (
            <Input className="poll-drawer-input" key={index} value={option} />
          ))}
        </Space>

        {/* Add Option Button */}
        <div style={{ borderBottom: "1px solid #CCCCCC80" }}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={addOption}
            style={{ color: "#CCCCCC82 ", marginTop: "10px" }}
          >
            Add option
          </Button>
        </div>

        {/* Allow Multiple Answers Switch */}
        {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <span>Allow multiple answers</span>
          <Switch onChange={(checked) => setMultipleAnswer(checked)} />
        </div> */}

        {/* Create Poll Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CustomButton
            type="primary"
            block
            color={"blue"}
            style={{ marginTop: "50px", width: "110px", height: "38px" }}
          >
            Create Poll
          </CustomButton>
        </div>
      </div>
    </Drawer>
  );
}

export default PollDrawer;

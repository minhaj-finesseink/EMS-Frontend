/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Checkbox, Typography, List } from "antd";
import "./style.css";

const { Text } = Typography;

const items = [
  { label: "Team Status Updates" },
  { label: "Review Previous Meeting Action Items" },
];

function MeetingAgenda({ isOpen, onClose }) {
  return (
    <div>
      <Drawer
        className="agenda-drawer"
        title={<span style={{ color: "white" }}>Meeting Agenda</span>}
        placement="right"
        onClose={onClose}
        open={isOpen}
        width={500} // Adjust width as needed
        closeIcon={
          <CloseOutlined style={{ color: "white", fontSize: "16px" }} />
        }
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
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <div>
            <div
              style={{ fontSize: "16px", fontWeight: 500, marginBottom: "5px" }}
            >
              TOPIC
            </div>
            <div style={{ fontWeight: 500 }}>
              What deltas from the previous meeting will be focus on this
              meeting?{" "}
            </div>
          </div>
          <div className="agenda-table-container">
            <table>
              <tbody>
                <tr>
                  <th>Date</th>
                  <td>DD/MM/YYYY</td>
                </tr>
                <tr>
                  <th>Time</th>
                  <td>00:00 - 00:00</td>
                </tr>
                <tr>
                  <th>Participants</th>
                  <td>@navya @roshan @jerin</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div style={{ backgroundColor: "#272A32", padding: "20px" }}>
              AGENDA
            </div>
            <div style={{ color: "white" }}>
              <ul>
                <li>
                  <Text strong style={{ color: "white" }}>
                    Check in
                  </Text>
                </li>
              </ul>
              <List
                style={{ paddingLeft: "40px" }}
                dataSource={items}
                renderItem={(item) => (
                  <List.Item>
                    <Checkbox>
                      <span style={{ color: "white" }}>{item.label}</span>
                    </Checkbox>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default MeetingAgenda;

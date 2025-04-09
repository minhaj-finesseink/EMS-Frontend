/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { QRCodeCanvas } from "qrcode.react"; // ✅ correct import
import InviteEmail from "../../Components/InviteEmail";
import "./style.css";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

function InviteDrawer({ isOpen, onClose }) {
  const { meetingId } = useParams();
  const handleClose = () => {
    onClose();
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
          // gap: "20px",
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
        <div style={{ margin: "20px 0" }}>
          <InviteEmail />
        </div>
        <div
          style={{
            backgroundColor: "#FFF",
            borderRadius: "10px",
            color: "#000000",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#2C2E33",
              marginBottom: "10px",
              fontWeight: 600,
            }}
          >
            Scan this QR code to join the meeting
          </div>
          <QRCodeCanvas
            value={`${FRONTEND_URL}/lobby?type=invite&id=${meetingId}`}
            size={180}
            includeMargin={true}
          />
        </div>
      </div>
    </Drawer>
  );
}

export default InviteDrawer;

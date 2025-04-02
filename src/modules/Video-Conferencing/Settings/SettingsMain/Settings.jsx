import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SettingsMenu from "../SettingsPages/SettingsMenu/SettingsMenu";
import GeneralSettings from "../SettingsPages/GeneralSettings/GeneralSettings";
import AudioSettings from "../SettingsPages/AudioSettings/AudioSettings";
import Settings1Icon from "../../../../assets/GeneralSettings/settings.svg";
import Settings2Icon from "../../../../assets/NewIcons/setting-2.svg";
import Mic1Icon from "../../../../assets/GeneralSettings/mic.svg";
import Mic2Icon from "../../../../assets/NewIcons/mic-2.svg";
import Video1Icon from "../../../../assets/GeneralSettings/video.svg";
import Video2Icon from "../../../../assets/NewIcons/video-2.svg";
import Recording1Icon from "../../../../assets/GeneralSettings/recording.svg";
import Recording2Icon from "../../../../assets/NewIcons/recording-2.svg";
import Board1Icon from "../../../../assets/GeneralSettings/board.svg";
import Board2Icon from "../../../../assets/NewIcons/board-2.svg";
import Share1Icon from "../../../../assets/GeneralSettings/share.svg";
import Share2Icon from "../../../../assets/NewIcons/share-2.svg";
import AI1Icon from "../../../../assets/GeneralSettings/ai.svg";
import AI2Icon from "../../../../assets/NewIcons/Ai-2.svg";
import Scheduling1Icon from "../../../../assets/GeneralSettings/mail-notification.svg";
import Scheduling2Icon from "../../../../assets/NewIcons/mail-notification-2.svg";
import Notification1Icon from "../../../../assets/GeneralSettings/notification.svg";
import Notification2Icon from "../../../../assets/NewIcons/notification-2.svg";
import apps1Icon from "../../../../assets/NewIcons/apps-1.svg";
import apps2Icon from "../../../../assets/NewIcons/apps-2.svg";
import upgrade1Icon from "../../../../assets/NewIcons/upgrade-1.svg";
import upgrade2Icon from "../../../../assets/NewIcons/upgrade-2.svg";
import RecordingSettings from "../SettingsPages/RecordingSettings/RecordingSettings";
import WhiteboardSettings from "../SettingsPages/WhiteboardSettings/WhiteboardSettings";
import AiAssistanceSettings from "../SettingsPages/AiAssistanceSettings/AiAssistanceSettings";
import VideoSettings from "../SettingsPages/VideoSettings/VideoSettings";
import SchedulingAndEmail from "../SettingsPages/SchedulingAndEmail/SchedulingAndEmail";
import NotificationSettings from "../SettingsPages/NotificationSettings/NotificationSettings";
import AppsSettings from "../SettingsPages/AppsSettings/AppsSettings";
import UpgradeSettings from "../SettingsPages/UpgradeSettings/UpgradeSettings";
import ScreenShareSettings from "../SettingsPages/ScreenShareSettings/ScreenShareSettings";
import "./style.css";
import { updateMeetSettings } from "../../../../redux/VideoConference/video.action";

const Settings = ({updateMeetSettings}) => {
  const [selectedMenu, setSelectedMenu] = useState("general");
  const [updatedValue, setUpdatedValue] = useState({
    noParticipantDetection: true,
    appearence: "dark",
    maxParticipantsInScreen: 15,
    micInputLevel: 25,
    speakerOutputLevel: 25,
  });
  console.log("updatedValue", updatedValue);

  useEffect(() => {
    updateMeetSettings(updatedValue);
  }, [updatedValue]);

  return (
    <div className="general-settings-container">
      <div className="general-settings-menu-container">
        <SettingsMenu
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          menuItems={[
            {
              key: "general",
              icon:
                selectedMenu === "general" ? (
                  <img src={Settings2Icon} alt="settings" />
                ) : (
                  <img src={Settings1Icon} alt="settings" />
                ),
              label: "General",
            },
            {
              key: "audio",
              icon:
                selectedMenu === "audio" ? (
                  <img src={Mic2Icon} alt="mic" />
                ) : (
                  <img src={Mic1Icon} alt="mic" />
                ),
              label: "Audio",
            },
            {
              key: "video",
              icon:
                selectedMenu === "video" ? (
                  <img src={Video2Icon} alt="video" />
                ) : (
                  <img src={Video1Icon} alt="video" />
                ),
              label: "Video",
            },
            {
              key: "recording",
              icon:
                selectedMenu === "recording" ? (
                  <img src={Recording2Icon} alt="rec" />
                ) : (
                  <img src={Recording1Icon} alt="rec" />
                ),
              label: "Recording",
            },
            {
              key: "whiteboard",
              icon:
                selectedMenu === "whiteboard" ? (
                  <img src={Board2Icon} alt="whiteboard" />
                ) : (
                  <img src={Board1Icon} alt="whiteboard" />
                ),
              label: "Whiteboard",
            },
            {
              key: "aiAssistant",
              icon:
                selectedMenu === "aiAssistant" ? (
                  <img src={AI2Icon} alt="aiAssistant" />
                ) : (
                  <img src={AI1Icon} alt="aiAssistant" />
                ),
              label: "AI Assistant",
            },
            {
              key: "scheduling",
              icon:
                selectedMenu === "scheduling" ? (
                  <img src={Scheduling2Icon} alt="scheduling" />
                ) : (
                  <img src={Scheduling1Icon} alt="scheduling" />
                ),
              label: "Scheduling & Email",
            },
            {
              key: "screenShare",
              icon:
                selectedMenu === "screenShare" ? (
                  <img src={Share2Icon} alt="screenShare" />
                ) : (
                  <img src={Share1Icon} alt="screenShare" />
                ),
              label: "Screen Share",
            },
            {
              key: "notification",
              icon:
                selectedMenu === "notification" ? (
                  <img src={Notification2Icon} alt="notification" />
                ) : (
                  <img src={Notification1Icon} alt="notification" />
                ),
              label: "Notification",
            },
            {
              key: "apps",
              icon:
                selectedMenu === "apps" ? (
                  <img src={apps2Icon} alt="apps" />
                ) : (
                  <img src={apps1Icon} alt="apps" />
                ),
              label: "Apps",
            },
            {
              key: "upgrade",
              icon:
                selectedMenu === "upgrade" ? (
                  <img src={upgrade2Icon} alt="upgrade" />
                ) : (
                  <img src={upgrade1Icon} alt="upgrade" />
                ),
              label: "Upgrades",
            },
          ]}
        />
      </div>
      <div className="general-settings-content-container">
        {selectedMenu === "general" && (
          <GeneralSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "audio" && (
          <AudioSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "video" && (
          <VideoSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "recording" && (
          <RecordingSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "whiteboard" && (
          <WhiteboardSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "aiAssistant" && (
          <AiAssistanceSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "scheduling" && (
          <SchedulingAndEmail
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "screenShare" && (
          <ScreenShareSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "notification" && (
          <NotificationSettings
            isActive={updatedValue}
            updatedValue={setUpdatedValue}
          />
        )}
        {selectedMenu === "apps" && <AppsSettings />}
        {selectedMenu === "upgrade" && <UpgradeSettings />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({
  updateMeetSettings: (values) => dispatch(updateMeetSettings(values)),
});

Settings.propTypes = {
  updateMeetSettings: PropTypes.func,
  videoConferenceData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

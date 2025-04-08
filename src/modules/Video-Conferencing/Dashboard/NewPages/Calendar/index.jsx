/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import CalendarComponent from "../CalendarComponent";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";
import ScheduleMeetingIcon from "../../../../../assets/NewIcons/scheduleMeeting.svg";
import CustomButton from "../../../../../components/CustomButton";
import {
  getCalendarMeeting,
  scheduleMeeting,
} from "../../../../../redux/VideoConference/video.action";
import "./style.css";

const { TextArea } = Input;

function Calendar({
  scheduleMeeting,
  getCalendarMeeting,
  videoConferenceData,
}) {
  const [form] = Form.useForm();
  const [openScheduleMeetingModal, setOpenScheduleMeetingModal] =
    useState(false);
  const [rangeDates, setRangeDates] = useState({
    start: "",
    end: "",
  });
  const [events, setEvents] = useState({
    title: "",
    start: "",
    end: "",
  });
  const [settings, setSettings] = useState({
    enableRecording: true,
    muteParticipantsOnEntry: true,
    waitingRoom: true,
    breakoutRoom: true,
  });
  const [loading, setLoading] = useState(false);

  const ToggleOption = ({ label, description, checked, onChange }) => {
    return (
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              fontSize: "16px",
              fontFamily: "Inter",
              color: "#464454",
            }}
          >
            {label}
          </div>
          <Switch checked={checked} onChange={onChange} />
        </div>
        <div
          style={{
            fontSize: "14px",
            fontFamily: "Inter",
            color: "#9B9B9B",
          }}
        >
          {description}
        </div>
      </div>
    );
  };

  const handleScheduleSubmit = (values) => {
    setLoading(true);
    const startDateTime = dayjs(values.startDate)
      .set("hour", values.startTime.hour())
      .set("minute", values.startTime.minute())
      .toISOString();

    const endDateTime = dayjs(values.endDate)
      .set("hour", values.endTime.hour())
      .set("minute", values.endTime.minute())
      .toISOString();

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const payload = {
      // ...values,
      title: values.title,
      statDate: startDateTime,
      startTime: startDateTime,
      endDate: endDateTime,
      endTime: endDateTime,
      recurrence: values.recurrence || false, // fallback to false
      timeZone,
      participants: values.participants,
      meetingAgenda: values.meetingAgenda,
      ...settings,
    };

    // console.log("Form Submitted:", payload);
    scheduleMeeting(payload);
  };

  useEffect(() => {
    const response = videoConferenceData.scheduleMeetingResponse;
    if (response && response.success) {
      message.success("Meeting scheduled successfully!");
      setOpenScheduleMeetingModal(false);
      if (rangeDates.start && rangeDates.end) {
        getCalendarMeeting({
          startDate: rangeDates.start,
          endDate: rangeDates.end,
        });
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoConferenceData.scheduleMeetingResponse]);

  useEffect(() => {
    if (rangeDates.start && rangeDates.end) {
      getCalendarMeeting({
        startDate: rangeDates.start,
        endDate: rangeDates.end,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDates.start, rangeDates.end]);

  useEffect(() => {
    const response = videoConferenceData.getCalendarMeetingResponse;

    if (response && response.success && Array.isArray(response.meetings)) {
      const allEvents = response.meetings.map((meeting) => ({
        title: meeting.title,
        start: meeting.startTime,
        end: meeting.endTime,
        meetingId: meeting.meetingId,
      }));

      setEvents(allEvents); // 👈 store array of all meetings
    }
  }, [videoConferenceData.getCalendarMeetingResponse]);

  return (
    <div>
      <CalendarComponent
        openScheduleMeetingModal={setOpenScheduleMeetingModal}
        eventsDate={events}
        setRangeDates={setRangeDates}
      />
      <Modal
        className="schedule-meeting-modal"
        title={
          <div className="schedule-meeting-modal-title">
            <div>
              <img src={ScheduleMeetingIcon} alt="icon" width={"28px"} />
              <span
                style={{ fontSize: "18px", fontWeight: 700, color: "#464454" }}
              >
                Schedule Meeting
              </span>
            </div>{" "}
            <CloseOutlined
              onClick={() => setOpenScheduleMeetingModal(false)}
              style={{ fontSize: "16px", cursor: "pointer" }}
            />
          </div>
        }
        open={openScheduleMeetingModal}
        onCancel={() => setOpenScheduleMeetingModal(false)}
        width={600}
        closable={false}
        footer={null}
      >
        <div className="schedule-meeting-modal-content">
          <Form layout="vertical" form={form} onFinish={handleScheduleSubmit}>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter a meeting title" },
              ]}
            >
              <Input placeholder="Enter meeting title" />
            </Form.Item>
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontFamily: "Inter",
                  color: "#464454",
                  width: "75px",
                }}
              >
                Start time
              </div>
              <div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <Form.Item
                    name="startDate"
                    rules={[
                      { required: true, message: "Please select a start date" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <DatePicker
                      style={{
                        backgroundColor: "#F6F6F7",
                        border: "none",
                        height: "48px",
                        borderRadius: "6px",
                        padding: "0 12px",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        width: "140px",
                      }}
                      format="DD / MM / YYYY"
                    />
                  </Form.Item>

                  <Form.Item
                    name="startTime"
                    rules={[
                      { required: true, message: "Please select a start time" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <TimePicker
                      use12Hours
                      format="h:mm A"
                      style={{
                        backgroundColor: "#F6F6F7",
                        border: "none",
                        height: "48px",
                        borderRadius: "6px",
                        padding: "0 12px",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        width: "130px",
                      }}
                    />
                  </Form.Item>
                  <div
                    style={{
                      fontSize: "16px",
                      fontFamily: "Inter",
                      color: "#464454",
                    }}
                  >
                    Duration
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontFamily: "Inter",
                  color: "#464454",
                  width: "75px",
                }}
              >
                End time
              </div>
              <div>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <Form.Item
                    name="endDate"
                    rules={[
                      { required: true, message: "Please select a end date" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <DatePicker
                      style={{
                        backgroundColor: "#F6F6F7",
                        border: "none",
                        height: "48px",
                        borderRadius: "6px",
                        padding: "0 12px",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        width: "140px",
                      }}
                      format="DD / MM / YYYY"
                    />
                  </Form.Item>

                  <Form.Item
                    name="endTime"
                    rules={[
                      { required: true, message: "Please select a end time" },
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <TimePicker
                      use12Hours
                      format="h:mm A"
                      style={{
                        backgroundColor: "#F6F6F7",
                        border: "none",
                        height: "48px",
                        borderRadius: "6px",
                        padding: "0 12px",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        width: "130px",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="recurrence"
                    valuePropName="checked"
                    style={{ marginBottom: 0 }}
                  >
                    <Checkbox>Recurrence</Checkbox>
                  </Form.Item>
                </div>
              </div>
            </div>

            <Form.Item label="Time zone">
              <Input
                disabled
                value={Intl.DateTimeFormat().resolvedOptions().timeZone}
              />
            </Form.Item>

            <Form.Item
              name="participants"
              label="Participants"
              rules={[
                {
                  required: true,
                  message: "Please add at least one participant",
                },
                {
                  validator: (_, value) => {
                    // if (!value || value.length === 0) {
                    //   return Promise.reject(
                    //     "Please add at least one participant"
                    //   );
                    // }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const invalidEmails = value.filter(
                      (email) => !emailRegex.test(email)
                    );
                    if (invalidEmails.length) {
                      return Promise.reject(
                        `Invalid email(s): ${invalidEmails.join(", ")}`
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Select
                mode="tags"
                open={false}
                style={{ width: "100%" }}
                placeholder="Enter email addresses"
                tokenSeparators={[",", " "]} // allow comma/space separation
                className="custom-email-select"
              />
            </Form.Item>

            <Form.Item label="Meeting agenda" name="meetingAgenda">
              <TextArea
                rows={2}
                placeholder="Enter meeting agenda about your meeting"
              />
            </Form.Item>

            <div
              style={{
                fontSize: "16px",
                fontFamily: "Inter",
                color: "#464454",
                marginBottom: "24px",
              }}
            >
              Meeting ID
            </div>

            <div
              style={{
                fontSize: "16px",
                fontFamily: "Inter",
                color: "#464454",
                marginBottom: "24px",
              }}
            >
              Additional Meeting Options
            </div>

            <ToggleOption
              label="Enable Recording"
              description="This option allows the host to record the meeting automatically or manually"
              checked={settings.enableRecording}
              onChange={(val) =>
                setSettings({ ...settings, enableRecording: val })
              }
            />

            <ToggleOption
              label="Mute participants on entry"
              description="Enabling this option automatically mute all participants when they join the meeting"
              checked={settings.muteParticipantsOnEntry}
              onChange={(val) =>
                setSettings({ ...settings, muteParticipantsOnEntry: val })
              }
            />

            <ToggleOption
              label="Waiting Room"
              description="The host can review and admit participants individually or all at once"
              checked={settings.waitingRoom}
              onChange={(val) => setSettings({ ...settings, waitingRoom: val })}
            />

            <ToggleOption
              label="Breakout Rooms"
              description="Allows meeting hosts to automatically assign participats to breakout rooms as soon as they join the meeting"
              checked={settings.breakoutRoom}
              onChange={(val) =>
                setSettings({ ...settings, breakoutRoom: val })
              }
            />
          </Form>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            borderTop: "1px solid #CCCCCCCC",
            padding: "24px",
          }}
        >
          <CustomButton
            style={{ width: "100px" }}
            transparent
            onClick={() => setOpenScheduleMeetingModal(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton
            style={{ width: "100px" }}
            color={"blue"}
            onClick={() => form.submit()}
            loading={loading}
          >
            Save
          </CustomButton>
        </div>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  videoConferenceData: state.videoConference,
});

const mapDispatchToProps = (dispatch) => ({
  scheduleMeeting: (values) => dispatch(scheduleMeeting(values)),
  getCalendarMeeting: (values) => dispatch(getCalendarMeeting(values)),
});

Calendar.propTypes = {
  scheduleMeeting: PropTypes.func,
  getCalendarMeeting: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);

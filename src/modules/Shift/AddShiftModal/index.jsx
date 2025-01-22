/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  TimePicker,
  InputNumber,
  Checkbox,
  Button,
  Row,
  Col,
  Select,
} from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.css";
import {
  addShift,
  deleteShiftById,
  updateShiftById,
} from "../../../redux/ShiftAPIs/Shift/shift.action";
import DeleteIcon from "../../../assets/delete-icon.svg";
import toast from "react-hot-toast";

const { Option } = Select;

const dayLabels = [
  { full: "Sunday", short: "Sun" },
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
];

const AddShiftModal = (props) => {
  // const [form] = Form.useForm();
  const [selectedDays, setSelectedDays] = useState([]);
  // const [usersList, setUsersList] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { employeeDetails = {}, form, onCancel } = props; // Destructure employeeDetails from props

  const handleDayToggle = (day) => {
    setSelectedDays(
      (prevSelectedDays) =>
        prevSelectedDays.includes(day)
          ? prevSelectedDays.filter((d) => d !== day) // Remove day if already selected
          : [...prevSelectedDays, day] // Add day if not selected
    );
  };

  const handleSubmit = (values) => {
    // Format time values for better readability
    const formattedData = {
      ...values,
      startTime: moment(values.startTime).toISOString(),
      endTime: moment(values.endTime).toISOString(),
      repeatDays: selectedDays,
      userId: employeeId,
    };

    // console.log("Form data:", formattedData);
    if (employeeDetails.shiftName) {
      props.updateShiftById({ ...formattedData, id: employeeDetails.shiftId });
    } else {
      props.addShift(formattedData);
    }
  };

  useEffect(() => {
    if (props.shiftData.addShiftResponse) {
      let data = props.shiftData.addShiftResponse;
      // console.log("add shift data", data);
      if (data.success) {
        // setUsersList(data.users);
        // console.log("add shift data 2", data);
        toast.success(data.message);
        setTimeout(() => {
          onCancel();
        }, 1000);
      }
    } else if (props.shiftData.deleteShiftByIdResponse) {
      let data = props.shiftData.deleteShiftByIdResponse;
      if (data.success) {
        toast.success(data.message);
        setIsDeleteModalVisible(false);
        setTimeout(() => {
          onCancel();
        }, 1000);
      }
    } else if (props.shiftData.updateShiftByIdResponse) {
      let data = props.shiftData.updateShiftByIdResponse;
      if (data.success) {
        toast.success(data.message);
        setIsDeleteModalVisible(false);
        setTimeout(() => {
          onCancel();
        }, 1000);
      }
    }
    props.shiftData.addShiftResponse = null;
    props.shiftData.deleteShiftByIdResponse = null;
    props.shiftData.updateShiftByIdResponse = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.shiftData.addShiftResponse,
    props.shiftData.deleteShiftByIdResponse,
    props.shiftData.updateShiftByIdResponse,
  ]);

  useEffect(() => {
    if (employeeDetails.employeeId) {
      // console.log("employeeDetails", employeeDetails.repeatDays);

      form.setFieldsValue({
        userId: employeeDetails.employeeName, // Prefill with employeeId
        shiftName: employeeDetails.shiftName,
        startTime: employeeDetails.startTime
          ? moment(employeeDetails.startTime)
          : moment("09:00", "HH:mm"),
        endTime: employeeDetails.endTime
          ? moment(employeeDetails.endTime)
          : moment("17:00", "HH:mm"),
        paidBreak: employeeDetails.paidBreak || 0,
        unpaidBreak: employeeDetails.unpaidBreak || 0,
        shiftNotes: employeeDetails.shiftNotes,
        repeat: employeeDetails.repeat,
        repeatPeriod: employeeDetails.repeatPeriod,
        repeatExpire: employeeDetails.repeatExpire,
      });
      setEmployeeId(employeeDetails.employeeId);
      setSelectedDays(
        employeeDetails.repeatDays ? employeeDetails.repeatDays : []
      );
    }
  }, [employeeDetails, form]);

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    // Handle the deletion logic here
    // console.log("Shift deleted", employeeDetails.shiftId);
    props.deleteShiftById(employeeDetails.shiftId);
    // setIsDeleteModalVisible(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  // console.log('employeeDetails', employeeDetails);

  return (
    // <Modal
    //   visible={props.visible}
    //   onCancel={props.onClose}
    //   footer={null}
    //   // centered
    // >
    <div>
      <div
        style={{
          fontFamily: "Inter",
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "20px",
        }}
      >
        {employeeDetails.shiftName ? "Edit Shift" : "Add Shift"}
      </div>
      <Form
        name="addShiftForm"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          paidBreak: 0,
          unpaidBreak: 0,
          startTime: moment("09:00", "HH:mm"),
          endTime: moment("17:00", "HH:mm"),
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontFamily: "Inter" }}>Assign to</span>}
              name="userId"
              rules={[{ required: true, message: "Please assign the shift!" }]}
            >
              <Input
                placeholder="Enter shift name"
                className="add-shift-modal-input"
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontFamily: "Inter" }}>Shift Name</span>}
              name="shiftName"
              rules={[
                { required: true, message: "Please enter the shift name!" },
              ]}
            >
              <Input
                placeholder="Enter shift name"
                className="add-shift-modal-input"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row for Start and End */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontFamily: "Inter" }}>Start</span>}
              name="startTime"
              rules={[{ required: true, message: "Please select start time!" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                className="add-shift-modal-input"
                format="HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontFamily: "Inter" }}>End</span>}
              name="endTime"
              rules={[{ required: true, message: "Please select end time!" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                className="add-shift-modal-input"
                format="HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row for Paid and Unpaid Break */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontFamily: "Inter" }}>Paid Break</span>}
              name="paidBreak"
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                className="add-shift-modal-input"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontFamily: "Inter" }}>Unpaid Break</span>}
              name="unpaidBreak"
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                className="add-shift-modal-input"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={18}>
            <Form.Item
              label={<span style={{ fontFamily: "Inter" }}>Shift Notes</span>}
              name="shiftNotes"
            >
              <Input.TextArea
                rows={3}
                placeholder="Add any notes about the shift"
                className="add-shift-modal-input"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="repeat" valuePropName="checked">
          <Checkbox style={{ color: "#65686A", fontFamily: "Inter" }}>
            Repeat the shift
          </Checkbox>
        </Form.Item>

        <div className="add-shift-reporting-period">
          <div style={{ flex: 1 }}>
            <Form.Item
              name="repeatPeriod"
              label={
                <span style={{ fontFamily: "Inter" }}>
                  Select Repeating period
                </span>
              }
            >
              <Select
                placeholder="Select Repeating period"
                className="add-shift-modal-input"
              >
                <Option value="everyWeek">Every week</Option>
                <Option value="every2weeks">Every 2 weeks</Option>
                <Option value="every3weeks">Every 3 weeks</Option>
                <Option value="every4weeks">Every 4 weeks</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="repeatExpire"
              label={
                <span style={{ fontFamily: "Inter" }}>
                  Select expiry period
                </span>
              }
            >
              <Select
                placeholder="Select expiry period"
                className="add-shift-modal-input"
              >
                <Option value="1Year">In 1 Year</Option>
                <Option value="6Months">In 6 Months</Option>
                <Option value="permanent">Permanent</Option>
              </Select>
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            {/* Day Selector */}
            <div className="day-selector" style={{ marginBottom: "20px" }}>
              {dayLabels.map(({ full, short }) => (
                <Button
                  key={full}
                  type={selectedDays.includes(full) ? "primary" : "default"}
                  shape="circle"
                  className="day-button"
                  onClick={() => handleDayToggle(full)}
                >
                  {short}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
          >
            <Button className="add-shift-button" onClick={() => onCancel()}>
              Cancel
            </Button>
            {employeeDetails.shiftName && (
              <Button
                className="add-shift-button"
                style={{ backgroundColor: "#ED1C24", color: "#FFFFFF" }}
                onClick={showDeleteModal}
              >
                Delete
              </Button>
            )}
            <Button
              className="add-shift-button"
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#007DC5" }}
            >
              {employeeDetails.shiftName ? "Save" : "Add Shift"}
            </Button>
          </div>
        </Form.Item>
      </Form>
      {/* Confirmation Modal for Delete */}
      <Modal
        title="Delete Shift"
        visible={isDeleteModalVisible}
        onCancel={handleCancelDelete}
        footer={null}
        width={450}
      >
        <div className="delete-shift-modal-content">
          <div>
            <img src={DeleteIcon} alt="delete icon" />
          </div>
          <div className="delete-shift-modal-text">
            Are you want to delete this shift? <br />
            You can't undo this action.
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button className="add-shift-button" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              className="add-shift-button"
              style={{ backgroundColor: "#ED1C24", color: "#FFFFFF" }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// export default AddShiftModal;
const mapStateToProps = (state) => ({
  userData: state.user,
  shiftData: state.shift,
});

const mapDispatchToProps = (dispatch) => ({
  addShift: (values) => dispatch(addShift(values)),
  deleteShiftById: (values) => dispatch(deleteShiftById(values)),
  updateShiftById: (values) => dispatch(updateShiftById(values)),
});

AddShiftModal.propTypes = {
  userData: PropTypes.object,
  shiftData: PropTypes.object,
  addShift: PropTypes.func,
  deleteShiftById: PropTypes.func,
  updateShiftById: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddShiftModal);

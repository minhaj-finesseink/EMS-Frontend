/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Table } from "antd";
import CustomButton from "../../../components/CustomButton";
import { FilterOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addShiftUserFromHr,
  getUserByUsitiveHr,
} from "../../../redux/ShiftAPIs/Shift/shift.action";
import "./style.css";
import toast from "react-hot-toast";

function AddUsersUsitiveHr(props) {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // console.log("selectedRowKeys", selectedRowKeys);

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  const menu = (
    <Menu
      items={[
        { key: "1", label: "Option 1" },
        { key: "2", label: "Option 2" },
        { key: "3", label: "Option 3" },
      ]}
    />
  );

  useEffect(() => {
    props.getUserByUsitiveHr();
  }, []);

  useEffect(() => {
    if (props.shiftData.getUserByUsitiveHrResponse) {
      let data = props.shiftData.getUserByUsitiveHrResponse;
      if (data.success) {
        setData(data.users);
      }
    }
  }, [props.shiftData.getUserByUsitiveHrResponse]);

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleSubmit = () => {
    props.addShiftUserFromHr({ ids: selectedRowKeys });
  };

  useEffect(() => {
    if (props.shiftData.addShiftUserFromHrResponse) {
      let data = props.shiftData.addShiftUserFromHrResponse;
      // console.log('data', data);
      if (data.success) {
        toast.success(data.message);
        props.getUserByUsitiveHr();
        setSelectedRowKeys([]);
      }
    }
  }, [props.shiftData.addShiftUserFromHrResponse]);

  return (
    <div className="add-users-usitive-container">
      <div className="add-users-usitive-header">
        <div className="add-users-usitive-header-left">
          <div className="add-users-usitive-header-title">
            Add users from Usitive
          </div>
          <div className="add-users-usitive-header-desc">
            Add users from Usitive HR
          </div>
        </div>
        <div className="add-users-usitive-header-right">
          {/* Add advanced filter here */}
          {/* <div></div> */}
          <div>
            {/* Status Filter */}
            <Dropdown overlay={menu} trigger={["click"]}>
              <CustomButton color={"grey"}>
                <FilterOutlined style={{ opacity: "0.7" }} /> Status{" "}
                <span style={{ fontWeight: "bold" }}>All</span>
              </CustomButton>
            </Dropdown>
          </div>
          <div>
            {/* Team Filter */}
            <Dropdown overlay={menu} trigger={["click"]}>
              <CustomButton color={"grey"}>
                <FilterOutlined style={{ opacity: "0.7" }} /> Team{" "}
                <span style={{ fontWeight: "bold" }}>All</span>
              </CustomButton>
            </Dropdown>
          </div>
        </div>
      </div>
      <div className="add-users-usitive-table">
        <Table
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection} // Add this line for checkboxes
          rowKey={(record) => record._id} // Unique key for rows
        />
      </div>
      <div className="add-users-usitive-buttons">
        <CustomButton color={"grey"} transparent>
          Cancel
        </CustomButton>
        <CustomButton
          color={"blue"}
          disabledCondition={selectedRowKeys.length === 0}
          onClick={handleSubmit}
        >
          Add Users
        </CustomButton>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  shiftData: state.shift,
});

const mapDispatchToProps = (dispatch) => ({
  getUserByUsitiveHr: (values) => dispatch(getUserByUsitiveHr(values)),
  addShiftUserFromHr: (values) => dispatch(addShiftUserFromHr(values)),
});

AddUsersUsitiveHr.propTypes = {
  getUserByUsitiveHr: PropTypes.func,
  addShiftUserFromHr: PropTypes.func,
  shiftData: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUsersUsitiveHr);

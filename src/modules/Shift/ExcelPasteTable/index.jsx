/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Table, Upload, Input, Spin, DatePicker } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import CustomButton from "../../../components/CustomButton";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addShiftBulkUser } from "../../../redux/ShiftAPIs/Shift/shift.action";
import toast from "react-hot-toast";

const { Dragger } = Upload;

const EXPECTED_HEADINGS = ["First Name", "Last Name", "Email"]; // Expected table headings

const PasteTableWithUpload = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [fileHeadings, setFileHeadings] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State for selected rows
  const [highlightedRows, setHighlightedRows] = useState([]); // State to track rows with errors

  const columns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "DOB", dataIndex: "dob", key: "dob" },
    { title: "Date of Hiring", dataIndex: "dateOfHiring", key: "dateOfHiring" },
  ].filter((col) => props.selectedFields.includes(col.title));

  const handlePaste = (event) => {
    const pastedData = event.clipboardData.getData("Text");
    parseExcelData(pastedData);
  };

  const parseExcelData = (pastedData) => {
    const rows = pastedData.split("\n").map((row) => row.split("\t"));

    // Filter out empty rows
    const filteredRows = rows.filter((row) =>
      row.some((cell) => cell.trim() !== "")
    );

    if (filteredRows.length === 0) {
      setError("File is empty or invalid.");
      setIsLoading(false); // Reset loading state on error
      return;
    }

    // Clean up data from unwanted characters like quotes
    const sanitizedRows = filteredRows.map(
      (row) => row.map((cell) => cell.replace(/"/g, "").trim()) // Remove double quotes and trim extra spaces
    );

    validateAndSetData(sanitizedRows);
  };

  const handleFileUpload = (file) => {
    setIsLoading(true); // Set loading state to true when file is being uploaded
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n").map((row) => row.split(","));

      // Filter out empty rows
      const filteredRows = rows.filter((row) =>
        row.some((cell) => cell.trim() !== "")
      );

      if (filteredRows.length === 0) {
        setError("File is empty or invalid.");
        setIsLoading(false);
        return;
      }

      // Clean up data from unwanted characters like quotes
      const sanitizedRows = filteredRows.map(
        (row) => row.map((cell) => cell.replace(/"/g, "").trim()) // Remove double quotes and trim extra spaces
      );

      validateAndSetData(sanitizedRows);
    };
    reader.readAsText(file);
    return false;
  };

  const validateAndSetData = (rows) => {
    // Try to use the first row as headers
    const fileHeadings = rows[0].map((heading) => heading.trim());

    // Check if there's at least one matching header
    const hasMatchingHeader = EXPECTED_HEADINGS.some((expectedHeading) =>
      fileHeadings.some(
        (fileHeading) =>
          fileHeading.toLowerCase() === expectedHeading.toLowerCase()
      )
    );

    if (!hasMatchingHeader) {
      setError(
        "Error: At least one header must match (First Name, Last Name, Email)."
      );
      setIsLoading(false); // Reset loading state on error
      return;
    }

    // Set fileHeadings state if at least one header matches
    setFileHeadings(fileHeadings);

    // Clear error and parse data
    setError("");
    const tableData = rows.slice(1).map((row, index) => {
      const rowData = {};

      // Fill matched columns
      columns.forEach((col, i) => {
        const matchedCol = fileHeadings.find(
          (heading) => heading.toLowerCase() === col.title.toLowerCase()
        );
        const colIndex = fileHeadings.indexOf(matchedCol);

        if (colIndex !== -1 && row[colIndex]) {
          rowData[col.dataIndex] = row[colIndex]; // Fill data for matched columns
        } else {
          rowData[col.dataIndex] = ""; // Leave unmatched columns empty
        }
      });

      return { key: index, ...rowData };
    });
    setData(tableData);
    // console.log("tableData", tableData);
    setIsLoading(false); // Reset loading state when data is ready
  };

  const clearData = () => {
    setData([]);
    setError("");
    setFileHeadings([]);
    setSelectedRowKeys([]); // Clear selected rows
    setHighlightedRows([]); // Clear highlighted rows
    setIsLoading(false); // Reset loading state on clear
  };

  const handleSave = (key, dataIndex, value) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.key === key);
    if (index > -1) {
      newData[index][dataIndex] = value;
      setData(newData);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(data.map((row) => row.key));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleRowSelect = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleAddUsers = () => {
    const selectedData = data.filter((item) =>
      selectedRowKeys.includes(item.key)
    );

    // Check for errors before adding users
    const invalidRows = selectedData.filter((row) => {
      return (
        !row.firstName ||
        !row.lastName ||
        !row.email ||
        !validateEmail(row.email)
      );
    });

    if (invalidRows.length > 0) {
      // Highlight invalid rows (only first name, last name, and email)
      const invalidRowKeys = invalidRows.map((row) => row.key);
      setHighlightedRows(invalidRowKeys);
      setError("Please fill in required fields and provide a valid email.");
    } else {
      setError(""); // Clear error
      // console.log("selectedData", selectedData);
      // Log the new data as per your requested format
      const modifiedData = selectedData.map(
        ({ key, dateOfHiring, dob, ...rest }) => ({
          ...rest,
          employmentStartDate: dateOfHiring
            ? moment(dateOfHiring).toISOString().split("T")[0]
            : "", // Renaming 'dateOfHiring' to 'employmentStartDate'
          companyId: userInfo.companyId,
          companyName: userInfo.companyName,
          role: "user",
          dob: dob ? moment(dob).toISOString().split("T")[0] : "",
        })
      );

      // console.log("Modified User Data:", modifiedData); // Log new data with changes
      setIsLoading(true);
      // Call the API to add users to the database
      props.addShiftBulkUser({
        users: modifiedData,
      });
    }
  };

  useEffect(() => {
    if (props.shiftData.addShiftBulkUserResponse) {
      let data = props.shiftData.addShiftBulkUserResponse;
      if (data.error) {
        setIsLoading(false);
        // Handle the error response
        if (data.existingEmails && data.existingEmails.length > 0) {
          // console.log("Existing emails:", data.existingEmails);
          // You can now use the existing emails as needed
        } else {
          // console.log("Error:", data.message);
        }
      } else {
        setIsLoading(false);
        // console.log("no error");
        toast.success(data.message);
        props.onCancel();
      }
    }
  }, [props.shiftData.addShiftBulkUserResponse]);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <div>
      <Spin spinning={isLoading} tip="Loading...">
        <Table
          rowSelection={{
            type: "checkbox",
            selectedRowKeys,
            onChange: handleRowSelect,
            getCheckboxProps: (record) => ({
              disabled: !record.firstName, // Disable checkbox if no employee data
            }),
          }}
          columns={columns.map((col) => ({
            ...col,
            render: (text, record) => {
              const hasError =
                (col.title === "First Name" ||
                  col.title === "Last Name" ||
                  col.title === "Email") &&
                !text;
              const isHighlighted = highlightedRows.includes(record.key);
              if (col.title === "DOB" || col.title === "Date of Hiring") {
                return (
                  <DatePicker
                    value={text ? moment(text) : null}
                    onBlur={(date) =>
                      handleSave(record.key, col.dataIndex, date)
                    }
                    style={{
                      border:
                        (col.title === "First Name" ||
                          col.title === "Last Name" ||
                          col.title === "Email") &&
                        isHighlighted
                          ? "1px solid red" // Red border for highlighted rows
                          : "1px solid #d9d9d9", // Default border
                      padding: "5px",
                    }}
                  />
                );
              }
              return (
                <Input
                  defaultValue={text}
                  onBlur={(e) =>
                    handleSave(record.key, col.dataIndex, e.target.value)
                  }
                  style={{
                    border:
                      (col.title === "First Name" ||
                        col.title === "Last Name" ||
                        col.title === "Email") &&
                      isHighlighted
                        ? "1px solid red" // Red border for highlighted rows
                        : "1px solid #d9d9d9", // Default border
                    padding: "5px",
                  }}
                />
              );
            },
          }))}
          dataSource={data}
          pagination={false}
          bordered
          scroll={{
            y: 400, // Sets the height of the table body
          }}
          locale={{
            emptyText: !data.length ? (
              <Dragger
                accept=".csv,.txt"
                beforeUpload={handleFileUpload}
                showUploadList={false}
                style={{ padding: "20px" }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Drag and drop a file here or click to upload
                </p>
                <p className="ant-upload-hint">Supports .csv and .txt files</p>
                <p style={{ color: "#aaa", marginTop: "8px" }}>
                  Or paste data directly (Ctrl+V)
                </p>
              </Dragger>
            ) : (
              "No Data"
            ),
          }}
          onRow={() => ({
            onPaste: (e) => handlePaste(e),
          })}
          style={{
            minHeight: "200px",
          }}
          components={{
            body: {
              cell: (props) => (
                <td
                  {...props}
                  style={{ padding: "10px", textAlign: "center" }}
                />
              ),
            },
          }}
        />
      </Spin>
      {error && (
        <div style={{ color: "red", marginTop: "8px" }}>
          <strong>{error}</strong>
        </div>
      )}
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <CustomButton
          color={"grey"}
          transparent
          onClick={() => {
            clearData();
            if (props.onCancel) props.onCancel(); // Call the onCancel handler if provided
          }}
          style={{ marginRight: "10px" }}
        >
          Cancel
        </CustomButton>
        <CustomButton
          color={"blue"}
          onClick={handleAddUsers}
          disabledCondition={selectedRowKeys.length === 0}
        >
          Add users
        </CustomButton>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  shiftData: state.shift,
});
const mapDispatchToProps = (dispatch) => ({
  addShiftBulkUser: (values) => dispatch(addShiftBulkUser(values)),
});

PasteTableWithUpload.propTypes = {
  addShiftBulkUser: PropTypes.func,
  shiftData: PropTypes.object,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasteTableWithUpload);

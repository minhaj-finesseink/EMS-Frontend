import React, { useState } from "react";
import { Table, Tag, Input, Button, Space, Switch, Checkbox } from "antd";
import { SearchOutlined, FilterOutlined, AppstoreOutlined, MenuOutlined } from "@ant-design/icons";
import "./style.css";

const EmployeeTable = () => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [isGridView, setIsGridView] = useState(false); // State for toggle view (default is List View)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State for selected checkboxes

  const data = [
    {
      key: "1",
      name: "Jonas Kahnwald",
      email: "Jona@company.com",
      position: "Product Designer",
      salary: 1250.0,
      overtime: 12,
      status: "Reported",
    },
    {
      key: "2",
      name: "Maria",
      email: "maria@company.com",
      position: "Finance Manager",
      salary: 1150.0,
      overtime: 2,
      status: "Leave",
    },
    {
      key: "3",
      name: "Jonas Kahnwald",
      email: "Jon@company.com",
      position: "Graphic Designer",
      salary: 1000.0,
      overtime: 0,
      status: "Reported",
    },
    {
      key: "4",
      name: "Maria",
      email: "maria@company.com",
      position: "Lead Product Designer",
      salary: 1500.0,
      overtime: 16,
      status: "Leave",
    },
    {
      key: "5",
      name: "Alice",
      email: "alicent@company.com",
      position: "Project Manager",
      salary: 1325.0,
      overtime: 16,
      status: "Leave",
    },
  ];

  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Grey Placeholder Icon */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#d9d9d9",
            }}
          />
          <div>
            <div>{text}</div>
            <div style={{ fontSize: "12px", color: "gray" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      sorter: (a, b) => a.salary - b.salary,
      render: (salary) => `$${salary.toFixed(2)}`,
    },
    {
      title: "Overtime",
      dataIndex: "overtime",
      key: "overtime",
      sorter: (a, b) => a.overtime - b.overtime,
      render: (overtime) => (overtime > 0 ? `${overtime}hrs` : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        const color = status === "Reported" ? "green" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const onSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <div className="table-container">
      <div>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2>Employee</h2>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Input
              placeholder="Search employee"
              onChange={(e) => onSearch(e.target.value)}
              style={{ width: 200 }}
              suffix={<SearchOutlined />}
            />
            {/* View Toggle Button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                borderRadius: "8px",
                padding: "4px",
                backgroundColor: "#f0f0f0",
              }}
            >
              <Button
                icon={<AppstoreOutlined />}
                onClick={() => setIsGridView(true)}
                type={isGridView ? "primary" : "default"}
                style={{
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  padding: "4px 8px",
                }}
              />
              <Button
                icon={<MenuOutlined />}
                onClick={() => setIsGridView(false)}
                type={!isGridView ? "primary" : "default"}
                style={{
                  borderTopRightRadius: "8px",
                  borderBottomRightRadius: "8px",
                  padding: "4px 8px",
                }}
              />
            </div>
          </Space>
        </div>
        {/* Table Section */}
        {!isGridView ? (
          <Table
            rowSelection={rowSelection} // Enable checkbox for rows
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "15"],
              onShowSizeChange: (current, size) => setPageSize(size),
            }}
            scroll={{
              x: 300,
            }}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {filteredData.map((item) => (
              <div
                key={item.key}
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: "#fafafa",
                }}
              >
                <Checkbox
                  checked={selectedRowKeys.includes(item.key)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedRowKeys((prev) =>
                      checked
                        ? [...prev, item.key]
                        : prev.filter((key) => key !== item.key)
                    );
                  }}
                />
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#d9d9d9",
                    marginBottom: 8,
                  }}
                />
                <h4>{item.name}</h4>
                <p style={{ margin: 0, color: "gray", fontSize: 12 }}>
                  {item.email}
                </p>
                <p style={{ margin: "8px 0 0" }}>{item.position}</p>
                <p style={{ margin: 0 }}>Salary: ${item.salary.toFixed(2)}</p>
                <p style={{ margin: 0 }}>
                  Overtime: {item.overtime > 0 ? `${item.overtime}hrs` : "-"}
                </p>
                <Tag color={item.status === "Reported" ? "green" : "red"}>
                  {item.status}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTable;
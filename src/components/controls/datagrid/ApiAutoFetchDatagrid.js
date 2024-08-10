import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Spin, message, Pagination, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getPaginationInfo } from "../../../utils";
import Overlay from "../Overlay";

// Removing MUI styles as Ant Design provides its own styles

class ApiAutoFetchDatagrid extends Component {
  state = {
    data: {
      list: [],
      paginationInfo: {}
    },
    isLoading: false
  };

  async componentDidMount() {
    this.init();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  init = async (props = this.props) => {
    this.setState({ isLoading: true });

    try {
      const res = await props.datasourcePromise();
      const paginationInfo = getPaginationInfo(res.headers.link);
      const list = res.data;
      const data = {
        list,
        paginationInfo
      };
      this.setState({ isLoading: false, data });
    } catch (error) {
      message.error("Error loading data.");
      this.setState({ isLoading: false, data: { list: [] } });
    }
  };

  onPageChange = (page) => {
    this.fetch(page);
  };

  fetch = async (page) => {
    try {
      this.setState({ isLoading: true });
      const url = this.state.data.paginationInfo[page];
      const res = await axios.get(url);
      const paginationInfo = getPaginationInfo(res.headers.link);
      const list = res.data;
      const data = {
        list,
        paginationInfo
      };
      this.setState({ isLoading: false, data });
    } catch (error) {
      message.error("Error fetching data.");
      this.setState({ isLoading: false, data: {} });
    }
  };

  renderCellValue = (key, val) => {
    if (this.props.transformers && this.props.transformers[key]) {
      return this.props.transformers[key](val);
    }
    return val;
  };

  renderActions = (row) => {
    return (
      <div>
        {this.props.actions.includes("edit") && (
          <Button
            icon={<EditOutlined />}
            onClick={() => this.props.onEdit(row)}
            style={{ marginRight: 8 }}
          />
        )}
        {this.props.actions.includes("del") && (
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => this.props.onDelete(row)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        )}
      </div>
    );
  };

  render() {
    const { isLoading, data } = this.state;
    const { headers, rowsPerPage } = this.props;

    const columns = headers.map((header) => ({
      title: header,
      dataIndex: header.toLowerCase(),
      key: header,
      render: (text, record, index) => this.renderCellValue(header.toLowerCase(), record[header.toLowerCase()]),
    }));

    if (this.props.actions.length > 0) {
      columns.push({
        title: "Actions",
        key: "actions",
        render: (_, record) => this.renderActions(record),
      });
    }

    return (
      <div style={{ position: "relative" }}>
        {isLoading && (
          <>
            <Spin size="large" />
            <Overlay />
          </>
        )}
        <Table
          columns={columns}
          dataSource={data.list}
          pagination={false}
          rowKey={(record) => record.id}
        />
        {data.paginationInfo.count && (
          <Pagination
            current={parseInt(data.paginationInfo.current, 10)}
            total={parseInt(data.paginationInfo.count, 10)}
            pageSize={parseInt(rowsPerPage, 10)}
            onChange={this.onPageChange}
            style={{ marginTop: 16, textAlign: "right" }}
          />
        )}
        {!isLoading && data.list.length === 0 && (
          <div style={{ width: "100%", textAlign: "center", marginTop: 20 }}>
            <span>No records found</span>
          </div>
        )}
      </div>
    );
  }
}

ApiAutoFetchDatagrid.defaultProps = {
  actions: [],
  rowsPerPage: 10
};

export default ApiAutoFetchDatagrid;

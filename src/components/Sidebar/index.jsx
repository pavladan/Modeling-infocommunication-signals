import React, { useState } from "react";
import {
  Typography,
  Button,
  Row,
  Col,
  Select,
  Divider,
  Tooltip,
  List,
  Popover,
  Popconfirm
} from "antd";
import {
  PlusCircleFilled,
  EyeFilled,
  EyeInvisibleFilled,
  EditFilled,
  DownloadOutlined,
  DeleteFilled,
  SettingFilled,
  LineChartOutlined,
  MinusOutlined
} from "@ant-design/icons";
import { CirclePicker } from "react-color";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Sidebar() {
  const [signals, setSignals] = useState([
    { name: "sin", id: 0, show: false },
    { name: "cos", id: 1, show: true },
    { name: "squar", id: 2, show: false }
  ]);
  const [signal, setSignal] = useState();
  const [chains, setChains] = useState([
    { name: "T", id: 0 },
    { name: "C", id: 1 }
  ]);
  const [chain, setChain] = useState();
  const [results, setResults] = useState([
    { name: "Result signal 1", show: false, color: "#000", id: 0 },
    { name: "Result signal 2", show: true, color: "#eee", id: 1 },
  ]);
  const signalOptions = signals.map(s => (
    <Option value={s.id} key={s.id} title={s.name}>
      <Row>
        <Col flex="auto">{s.name}</Col>
        <Col>
          <span
            className="showIcon"
            style={{ cursor: "pointer" }}
            onClick={e => toggleShowSignal(e, s.id)}
          >
            {
              <Button
                shape="circle"
                size="small"
                icon={s.show ? <EyeFilled /> : <EyeInvisibleFilled />}
              />
            }
          </span>
        </Col>
      </Row>
    </Option>
  ));
  const chainOptions = chains.map(s => (
    <Option value={s.id} key={s.id} title={s.name}>
      {s.name}
    </Option>
  ));
  const toggleShowSignal = (e, id) => {
    e.stopPropagation();
    setSignals(old => {
      return old.map(s => {
        if (s.id === id) {
          return { ...s, show: !s.show };
        }
        return s;
      });
    });
  };
  const deleteSignal = _ => {
    setSignals(old => {
      const newSignals = old.filter(s => s.id !== signal);
      const lastSignal = newSignals[newSignals.length - 1];
      setSignal(lastSignal ? lastSignal.id : undefined);
      return newSignals;
    });
  };
  const deleteChain = _ => {
    setChains(old => {
      const newChains = old.filter(s => s.id !== chain);
      const lastChain = newChains[newChains.length - 1];
      setChain(lastChain ? lastChain.id : undefined);
      return newChains;
    });
  };
  const changeColorOnResult = (id, color) => {
    setResults(old => {
      return old.map(r => {
        if (r.id === id) {
          return { ...r, color: color.hex };
        }
        return r;
      });
    });
  };
  const toggleShowResult = id => {
    setResults(old => {
      return old.map(r => {
        if (r.id === id) {
          return { ...r, show: !r.show };
        }
        return r;
      });
    });
  };
  const deleteResult = id => {
    setResults(old => {
      return old.filter(r => r.id !== id);
    });
  };
  return (
    <div className="Sidebar" style={{ height: "100%", padding: 20 }}>
      <div className="Signals">
        <Row gutter={8}>
          <Col>
            <Title level={2} style={{ color: "var(--text)" }}>
              Signals
              <Tooltip placement="right" title="Add new signal">
                <Button
                  shape="circle"
                  size="default"
                  type="default"
                  style={{ padding: 0, marginLeft: 10 }}
                  icon={<PlusCircleFilled style={{ fontSize: 30 }} />}
                ></Button>
              </Tooltip>
            </Title>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="auto">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a signal"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={signal}
              onChange={e => setSignal(e)}
              notFoundContent={null}
              optionLabelProp="title"
            >
              {signalOptions}
            </Select>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Edit this signal">
              <Button
                disabled={signal === undefined}
                shape="circle"
                icon={<EditFilled />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Download this signal">
              <Button
                disabled={signal === undefined}
                shape="circle"
                icon={<DownloadOutlined />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Delete this signal">
              <Popconfirm title="Delete this signal ?" onConfirm={deleteSignal}>
                <Button
                  disabled={signal === undefined}
                  shape="circle"
                  icon={<DeleteFilled />}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </Col>
        </Row>
      </div>
      <Divider />
      <div className="Chains">
        <Row gutter={8}>
          <Col>
            <Title level={2} style={{ color: "var(--text)" }}>
              Chains
              <Tooltip placement="right" title="Add new chain">
                <Button
                  shape="circle"
                  size="default"
                  type="default"
                  style={{ padding: 0, marginLeft: 10 }}
                  icon={<PlusCircleFilled style={{ fontSize: 30 }} />}
                ></Button>
              </Tooltip>
            </Title>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col flex="auto">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a chain"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={chain}
              onChange={e => setChain(e)}
              notFoundContent={null}
              optionLabelProp="title"
            >
              {chainOptions}
            </Select>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Edit this chain">
              <Button
                disabled={chain === undefined}
                shape="circle"
                icon={<EditFilled />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Download this chain">
              <Button
                disabled={chain === undefined}
                shape="circle"
                icon={<DownloadOutlined />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Delete this chain">
              <Popconfirm title="Delete this chain ?" onConfirm={deleteChain}>
                <Button
                  disabled={chain === undefined}
                  shape="circle"
                  icon={<DeleteFilled />}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </Col>
        </Row>
      </div>
      <Divider />
      <div className="Calc">
        <Row gutter={8}>
          <Col flex="auto">
            <Button
              type="primary"
              shape="round"
              block
              icon={<LineChartOutlined />}
            >
              Calculate
            </Button>
          </Col>
          <Col>
            <Button shape="circle" icon={<SettingFilled />}></Button>
          </Col>
        </Row>
      </div>
      
			<div className="Results">
        <Row gutter={8}>
          <Col flex="auto">
            <List
              header={
                <Title level={2} style={{ margin: 0 }}>
                  Results
                </Title>
              }
              dataSource={results}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Popover
                        trigger="click"
                        placement="topLeft"
                        content={
                          <CirclePicker
                            color={item.color}
                            onChangeComplete={e =>
                              changeColorOnResult(item.id, e)
                            }
                          ></CirclePicker>
                        }
                      >
                        <div
                          className="color"
                          style={{
                            backgroundColor: item.color,
                            borderRadius: "50%",
                            border: "0.1px solid var(--text)",
                            width: 22,
                            height: 22
                          }}
                        ></div>
                      </Popover>
                    }
                    title={<Text editable>{item.name}</Text>}
                  ></List.Item.Meta>
                  <Button
                    shape="circle"
                    size="small"
                    style={{ marginLeft: 5 }}
                    icon={
                      item.show ? (
                        <EyeFilled></EyeFilled>
                      ) : (
                        <EyeInvisibleFilled></EyeInvisibleFilled>
                      )
                    }
                    onClick={_ => toggleShowResult(item.id)}
                  ></Button>
                  <Button
                    shape="circle"
                    size="small"
                    style={{ marginLeft: 5 }}
                    icon={<DownloadOutlined></DownloadOutlined>}
                  ></Button>
                  <Button
                    shape="circle"
                    size="small"
                    style={{ marginLeft: 5 }}
                    icon={<MinusOutlined />}
                    onClick={_ => deleteResult(item.id)}
                  ></Button>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

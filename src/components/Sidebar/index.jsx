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
  Popconfirm,
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
  MinusOutlined,
} from "@ant-design/icons";
import { ChromePicker } from "react-color";
import SignalEdit from "../SignalEdit";
import ChainEdit from "../ChainEdit";
import CalcSettings from "../CalcSettings";

const { Title, Text } = Typography;
const { Option } = Select;

export default function Sidebar(props) {
  const [chains, setChains] = useState([
    {
      name: "T",
      id: 'c0',
      variables: {
        Cz: -3.3,
        Nz1: 2,
        Nz2: 1,
        Nz3: 1,
        Nz4: 1,
        az1s: { 1: 3, 2: 9 },
        az2e: { 1: 2 },
        az3x: { 1: 6 },
        az4y: { 1: 6 },
        nz1s: { 1: 6, 2:null },
        nz2e: { 1: 7 },
        nz3x: { 1: 4 },
        nz4y: { 1: 6 },
        wz2e: { 1: 3 },
        wz4y: { 1: 6 },
      },
    }
  ]);
  const [chain, setChain] = useState();

  const [signalEditOpen, setSignalEditOpen] = useState(false);
  const [chainEditOpen, setChainEditOpen] = useState(false);
  const [calcSettingsOpen, setClacSettingsOpen] = useState(false);

	const editChain = newChain => {
    setChains(old => {
      if (newChain.id !== undefined) {
        return old.map(s => {
          if (s.id === newChain.id) {
            return newChain;
          }
          return s;
        });
      } else {
        const ids = old.map(s => s.id);
				const newId = props.genNewId(ids,'c');
        setChain(newId);
        return [...old, { ...newChain, id: newId }];
      }
    });
	};
	
  const signalOptions = props.signals.map((s) => (
    <Option value={s.id} key={s.id} title={s.name}>
      <Row>
        <Col>
          <div
            className="color"
            style={{
              backgroundColor: s.color,
              borderRadius: "50%",
              width: 18,
              height: 18,
              marginRight: 6,
            }}
          ></div>
        </Col>
        <Col flex="auto">{s.name}</Col>
        <Col>
          <span
            className="showIcon"
            style={{ cursor: "pointer" }}
            onClick={(e) => props.toggleShowSignal(e, s.id)}
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
  const chainOptions = chains.map((s) => (
    <Option value={s.id} key={s.id} title={s.name}>
      {s.name}
    </Option>
  ));

  const deleteChain = (_) => {
    setChains((old) => {
      const newChains = old.filter((s) => s.id !== chain);
      const lastChain = newChains[newChains.length - 1];
      setChain(lastChain ? lastChain.id : undefined);
      return newChains;
    });
  };

  return (
    <div
      className="Sidebar"
      style={{
        ...props.style,
        height: "100vh",
        padding: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
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
                  onClick={(_) => setSignalEditOpen(true)}
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
                option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={props.signal}
              onChange={props.setSignal}
              notFoundContent={null}
              optionLabelProp="title"
            >
              {signalOptions}
            </Select>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Edit this signal">
              <Button
                disabled={props.signal === undefined}
                shape="circle"
                onClick={(_) =>
                  setSignalEditOpen(
                    props.signals.find((s) => s.id == props.signal)
                  )
                }
                icon={<EditFilled />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Download this signal">
              <Button
                disabled={props.signal === undefined}
                shape="circle"
                icon={<DownloadOutlined />}
              ></Button>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement="bottom" title="Delete this signal">
              <Popconfirm
                title="Delete this signal ?"
                onConfirm={props.deleteSignal}
              >
                <Button
                  disabled={props.signal === undefined}
                  shape="circle"
                  icon={<DeleteFilled />}
                ></Button>
              </Popconfirm>
            </Tooltip>
          </Col>
        </Row>
      </div>
      <Divider style={{ flex: "0 0 auto" }} />
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
                  onClick={(_) => setChainEditOpen(true)}
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
              onChange={(e) => setChain(e)}
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
								onClick={(_) =>
                  setChainEditOpen(
                    chains.find((s) => s.id == chain)
                  )
                }
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
      <Divider style={{ flex: "0 0 auto" }} />
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
            <Button
              shape="circle"
              onClick={(_) => setClacSettingsOpen(true)}
              icon={<SettingFilled />}
            ></Button>
          </Col>
        </Row>
      </div>
      <div
        className="Results"
        style={{
          flex: 1,
          height: 200,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Title level={2} style={{ margin: "12px 0" }}>
          Results
        </Title>
        <List
          style={{ flex: 1, overflowY: "auto" }}
          dataSource={props.results}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Popover
                    trigger="click"
                    placement="topLeft"
                    style={{ padding: 0 }}
                    content={
                      <div style={{ margin: "-12px -16px" }}>
                        <ChromePicker
                          color={item.color}
                          onChange={(e) =>
                            props.changeColorOnResult(item.id, e)
                          }
                          disableAlpha
                        ></ChromePicker>
                      </div>
                    }
                  >
                    <div
                      className="color"
                      style={{
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        marginLeft: 1,
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
                onClick={(_) => props.toggleShowResult(item.id)}
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
                onClick={(_) => props.deleteResult(item.id)}
              ></Button>
            </List.Item>
          )}
        />
      </div>
      {signalEditOpen && (
        <SignalEdit
          signal={
            typeof signalEditOpen === "object" ? signalEditOpen : undefined
          }
          save={props.editSignal}
          visible
          close={(_) => setSignalEditOpen(false)}
        />
      )}
      {chainEditOpen && (
        <ChainEdit
          chain={
            typeof chainEditOpen === "object" ? chainEditOpen : undefined
					}
					save={editChain}
					visible
          close={(_) => setChainEditOpen(false)}
        />
      )}
      {calcSettingsOpen && (
        <CalcSettings visible close={(_) => setClacSettingsOpen(false)} />
      )}
    </div>
  );
}

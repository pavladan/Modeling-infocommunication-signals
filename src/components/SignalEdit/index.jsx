import React, { useState } from "react";
import { Modal, Typography, Tabs, Popover, Row, Col } from "antd";
import { ChromePicker } from "react-color";
import TableMode from "./TableMode";
import Chart from "../Chart";
import calcLeaps from "../../helpers/calcLeaps";
import fixed from "../../helpers/fixed";

const { Title } = Typography;
const { TabPane } = Tabs;
export default function SignalEdit(props) {
  const [signal, setSignal] = useState(
    props.signal || {
      name: "New signal",
      data: [],
      initial: { type: "table", leaps: [] },
      color: "#000",
      show: true
    }
  );
  const [leaps, setLeaps] = useState(signal.initial.leaps || []);
  const [activeTab, setActiveTab] = useState(signal.initial.type !=='table' ? "1" : "0");

  const getPreviewData = () => {
    if (activeTab === "0") {
      let delay = 0;
      leaps.forEach(e => {
        delay = Math.max(delay, e.delay);
      });
      const range = delay > 6 ? fixed(delay * (4 / 3)) : 10;
      const numberPoints = 1000;
      const data = calcLeaps({
        leaps,
        range,
        numberPoints
      });
      return data;
    }
    return [];
  };
  const handleSave = _ => {
    const exitSignal = signal;
    exitSignal.show = true;
    exitSignal.data = getPreviewData();
    switch (activeTab) {
      case "0":
        exitSignal.initial = {
          type: "table",
          leaps
        };
        break;
      default:
        exitSignal.initial = {
          type: "none"
        };
    }
    props.save(exitSignal);
    props.close();
  };

  return (
    <div className="SignalEdit">
      <Modal
        destroyOnClose={true}
        closable={false}
        visible={props.visible}
        onCancel={props.close}
        zIndex={1}
        okText="Save"
        onOk={handleSave}
        width={"80%"}
        title={
          <div style={{ position: "relative" }}>
            <Title
              level={3}
              editable={{
                onChange: e => setSignal(old => ({ ...old, name: e }))
              }}
              style={{ textAlign: "center", maxWidth: "60%", margin: "0 20%" }}
            >
              {signal.name}
            </Title>
            <Popover
              trigger="click"
              placement="topLeft"
              style={{ padding: 0 }}
              content={
                <div style={{ margin: "-12px -16px" }}>
                  <ChromePicker
                    color={signal.color}
                    onChange={e => setSignal(old => ({ ...old, color: e.hex }))}
                    disableAlpha
                  ></ChromePicker>
                </div>
              }
            >
              <div
                className="color"
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  transform: "translateY(-50%)",
                  backgroundColor: signal.color,
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  cursor: "pointer"
                }}
              ></div>
            </Popover>
          </div>
        }
      >
        <Row>
          <Col span={24} md={12}>
            <Tabs activeKey={activeTab} onTabClick={setActiveTab}>
              <TabPane tab="Table" key="0">
                <TableMode leaps={leaps} setLeaps={setLeaps} />
              </TabPane>
              <TabPane tab="Function" key="1"></TabPane>
              <TabPane tab="Import" key="2"></TabPane>
            </Tabs>
          </Col>
          <Col span={24} md={12}>
            <Chart
              preview={true}
              charts={[
                {
                  name: false,
                  id: 0,
                  show: true,
                  color: signal.color,
                  data: getPreviewData()
                }
              ]}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

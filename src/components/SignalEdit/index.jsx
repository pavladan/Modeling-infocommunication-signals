import React, { useState } from "react";
import { Modal, Typography, Tabs, Popover, Row, Col } from "antd";
import { ChromePicker } from "react-color";
import TableMode from "./TableMode";
import Chart from "../Chart";

const { Title } = Typography;
const { TabPane } = Tabs;
export default function SignalEdit(props) {
  const [signal, setSignal] = useState(
    props.signal || { name: "New signal", data: [], color: "#000", show: true }
  );
  const [chartData, setChartData] = useState([]);
  const handleSave = _ => {
    props.save(signal);
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
            <Tabs>
              <TabPane tab="Table" key="0">
                <TableMode setChartData={setChartData} />
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
                  data: chartData
                }
              ]}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

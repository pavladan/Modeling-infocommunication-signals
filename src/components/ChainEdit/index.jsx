import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { Modal, Typography, Tabs } from "antd";
import OperatorTransferFunction from "./OperatorTransferFunction";
const { Title } = Typography;
const { TabPane } = Tabs;
export default function ChainEdit(props) {
  const [title, setTitle] = useState(props.title || "New chain");
  const [variables, setVariables] = useState({
    Cz: 1,
    Nz1: 1,
    Nz2: 1,
    Nz3: 1,
    Nz4: 1,
    az1s: { 1: null },
    az2e: { 1: null },
    az3x: { 1: null },
    az4y: { 1: null },
    nz1s: { 1: null },
    nz2e: { 1: null },
    nz3x: { 1: null },
    nz4y: { 1: null },
    wz2e: { 1: null },
    wz4y: { 1: null },
  });
  const handleSave = (_) => {
    props.close();
  };
  const validateVariables = () => {
    return Object.values(variables).every((value) => {
			if (typeof value === "object") {
				return Object.values(value).every((value2) => {
          return value2 !== null;
        });
      } else {
        return value !== null;
      }
    });
  };
  return (
    <div className="SignalEdit">
      <Modal
        destroyOnClose={true}
        closable={false}
        title={
          <Title
            level={3}
            editable={{ onChange: (e) => setTitle(e) }}
            style={{ textAlign: "center" }}
          >
            {title}
          </Title>
        }
        visible={props.visible}
        onCancel={props.close}
        onOk={handleSave}
        okText="Save"
        okButtonProps={{ disabled: !validateVariables() }}
        width={"95%"}
      >
        <Tabs>
          <TabPane tab="Chain" key="0">
            <OperatorTransferFunction
              variables={variables}
              setVariables={setVariables}
            />
          </TabPane>
          <TabPane tab="Import" key="2"></TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

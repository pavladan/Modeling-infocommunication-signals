import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { Modal, Typography, Tabs } from "antd";
import OperatorTransferFunction from "./OperatorTransferFunction";
const { Title } = Typography;
const { TabPane } = Tabs;
export default function ChainEdit(props) {
  const [title, setTitle] = useState(props.title || "New chain");

  const handleSave = (_) => {
    props.close();
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
        width={"95%"}
      >
        <Tabs>
          <TabPane tab="Chain" key="0">
            <OperatorTransferFunction />
          </TabPane>
          <TabPane tab="Import" key="2"></TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

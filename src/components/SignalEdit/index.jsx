import React, { useState } from "react";
import { Modal, Typography, Tabs } from "antd";

const { Title } = Typography;
const { TabPane } = Tabs;
export default function SignalEdit(props) {
	const [title, setTitle] = useState(props.title || "New signal");
	const handleSave = _=>{
		props.close()
 }
  return (
    <div className="SignalEdit">
      <Modal
				destroyOnClose={true}
				closable={false}
        title={
          <Title
            level={3}
            editable={{ onChange: e => setTitle(e) }}
            style={{ textAlign: "center" }}
          >
            {title}
          </Title>
        }
        visible={props.visible}
				onCancel={props.close}
				okText="Save"
				onOk={handleSave}
      >
				<Tabs>
					<TabPane tab="Table" key="0">

					</TabPane>
					<TabPane tab="Function" key="1">

					</TabPane>
					<TabPane tab="Import" key="2"></TabPane>
				</Tabs>
			</Modal>
    </div>
  );
}

import React, { useState } from "react";
import { Modal, Typography, Button, Form, Input, InputNumber } from "antd";

const { Title } = Typography;

export default function CalcSettings(props) {
  const handleReset = _ => {};
  const handleSave = _ => {
    props.close();
  };
  return (
    <div className="SignalEdit">
      <Modal
        destroyOnClose={true}
        title={
          <Title level={3} style={{ textAlign: "center" }}>
            Calculate settings
          </Title>
        }
        visible={props.visible}
        onCancel={props.close}
        footer={[
          <Button key="reset" type="link" danger onClick={handleReset}>
            Reset
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            Save
          </Button>
        ]}
      >
        <Form name="settings" wrapperCol={{ flex: "auto" }}>
          {/* <Form.Item label="Display interval" required>
            <Input placeholder="Enter interval" suffix="µs"></Input>
          </Form.Item>
          <Form.Item
            label="The number of reference points in the display interval"
            required
          >
            <InputNumber min={1} style={{ width: "100%" }}></InputNumber>
          </Form.Item> */}
          <Form.Item label="Chain frequency" required>
            <Input placeholder="Enter frequiency" suffix="MHs"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

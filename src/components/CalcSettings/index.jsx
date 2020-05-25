import React, { useState } from "react";
import { Modal, Typography, Button, Form, Input, InputNumber } from "antd";

const { Title } = Typography;

export default function CalcSettings(props) {
const [fraq,setFraq]=useState(6)
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
            Параметры расчета
          </Title>
        }
        visible={props.visible}
        onCancel={props.close}
        footer={[
          <Button key="reset" type="link" danger onClick={handleReset}>
            Сбросить
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            Сохранить
          </Button>
        ]}
      >
        <Form name="settings" >
          {/* <Form.Item label="Display interval" required>
            <Input placeholder="Enter interval" suffix="µs"></Input>
          </Form.Item>
          <Form.Item
            label="The number of reference points in the display interval"
            required
          >
            <InputNumber min={1} style={{ width: "100%" }}></InputNumber>
          </Form.Item> */}
          <Form.Item label="Граничная (центральная) частота звена" required>
            <Input placeholder="Введите частоту" suffix="МГц" value={fraq} onChange={e=>setFraq(e.target.value)}></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { Modal, Typography, Tabs } from "antd";
import OperatorTransferFunction from "./OperatorTransferFunction";

const { Title } = Typography;
const { TabPane } = Tabs;
export default function ChainEdit(props) {
  const [chain, setChain] = useState(
    props.chain || {
      name: "Новое звено",
      variables: {
        Cz: 1,
        N1: 1,
        N2: 1,
        N3: 1,
        N4: 1,
        a1s: { 1: null },
        a2e: { 1: null },
        a3x: { 1: null },
        a4y: { 1: null },
        w2e: { 1: null },
        w4y: { 1: null },
      },
    }
  );
  const handleSave = (_) => {
    props.save(chain);
    props.close();
  };
  const setTitle = (name) => {
    setChain((old) => ({
      ...old,
      name,
    }));
  };
  const setVariable = (variable) => {
    setChain((old) => {
      const variables = {
        ...old.variables,
        ...variable,
      };
      return {
        ...old,
        variables,
      };
    });
  };
  const validateVariables = () => {
    return (
      chain.name &&
      Object.values(chain.variables).every((value) => {
        if (typeof value === "object") {
          return Object.values(value).every((value2) => {
            return value2 !== null;
          });
        } else {
          return value !== null;
        }
      })
    );
  };
  return (
    <div className="SignalEdit">
      <Modal
        destroyOnClose={true}
        closable={false}
        title={
          <Title
            level={3}
            editable={{
              onChange: (e) => {
                if (e) setTitle(e);
              },
            }}
            style={{ textAlign: "center" }}
          >
            {chain.name}
          </Title>
        }
        visible={props.visible}
        onCancel={props.close}
        onOk={handleSave}
        cancelText={"Отменить"}
        okText="Сохранить"
        okButtonProps={{ disabled: !validateVariables() }}
        width={"95%"}
      >
        <Tabs>
          <TabPane tab="Звено" key="0">
            <OperatorTransferFunction
              variables={chain.variables}
              setVariable={setVariable}
            />
          </TabPane>
          <TabPane tab="Импорт" key="2"></TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { Modal, Typography } from "antd";
import OperatorTransferFunction from "./OperatorTransferFunction";

const { Title } = Typography;
export default function ChainEdit(props) {
  const [title, setTitle] = useState(
    (props.chain && props.chain.name) || "Новое звено"
  );
  const [variables, setVariables] = useState(
    (props.chain && props.chain.variables) || {
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
    }
  );
  const handleSave = (_) => {
    props.save({ ...props.chain, name: title, variables });
    props.close();
  };
  const setVariable = (variable) => {
    setVariables((old) => {
      return {
        ...old,
        ...variable,
      };
    });
  };
  const validateVariables = () => {
    const validate = (arr) => {
      return Object.values(arr).every((value) => {
        if (typeof value === "object") {
          return Object.values(value).every((value2) => {
            return value2 !== null;
          });
        } else {
          return value !== null;
        }
      });
    };
    return title && validate(variables);
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
            {title}
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
        <OperatorTransferFunction
          variables={variables}
          setVariable={setVariable}
        />
      </Modal>
    </div>
  );
}

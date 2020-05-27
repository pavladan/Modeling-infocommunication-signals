import React, { useState } from "react";
import "katex/dist/katex.min.css";
import { Modal, Typography, Tabs } from "antd";
import OperatorTransferFunction from "./OperatorTransferFunction";
import Upload from "../Upload";

const { Title } = Typography;
const { TabPane } = Tabs;
export default function ChainEdit(props) {
  const [activeTab, setActiveTab] = useState("0");
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
  const [importVariables, setImportVariables] = useState();
  const handleSave = (_) => {
    if (activeTab === "0") {
      props.save({ name: title, variables });
    } else if (activeTab === "1") {
      props.save({ name: title, variables: importVariables });
    }
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
  const setImportVariable = (variable) => {
    setImportVariables((old) => {
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
    if (activeTab === "0") {
      return title && validate(variables);
    } else if (activeTab === "1") {
      return title && importVariables && validate(importVariables);
    }
  };
  const setImportData = (e) => {
    setImportVariables(e);
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
        <Tabs activeKey={activeTab} onTabClick={setActiveTab}>
          <TabPane tab="Звено" key="0">
            <OperatorTransferFunction
              variables={variables}
              setVariable={setVariable}
            />
          </TabPane>
          <TabPane tab="Импорт" key="1">
            <Upload accept=".zv" setImportData={setImportData} />
            {/* {importVariables && (
              <OperatorTransferFunction
                variables={importVariables}
                setVariable={setImportVariable}
              />
            )} */}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

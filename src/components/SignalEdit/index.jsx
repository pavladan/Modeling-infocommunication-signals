import React, { useState, useEffect } from "react";
import { Modal, Typography, Tabs, Popover, Row, Col } from "antd";
import { ChromePicker } from "react-color";
import TableMode from "./TableMode";
import Chart from "../Chart";
import fixed from "../../helpers/fixed";
import FunctionMode from "./FunctionMode";
import getRandomColor from "../../helpers/getRandomColor";
import mathlive from "mathlive";

const { Title } = Typography;
const { TabPane } = Tabs;
export default function SignalEdit(props) {
  const [signal, setSignal] = useState(
    props.signal || {
      name: "Новый сигнал",
      initial: { type: "table" },
      color: getRandomColor(),
      show: true,
    }
  );
  const [leaps, setLeaps] = useState(signal.initial.leaps || []);
  const [func, setFunc] = useState(signal.initial.func || undefined);
  const [funcLatex, setFuncLatex] = useState(
    signal.initial.funcLatex || undefined
  );

  const [activeTab, setActiveTab] = useState(
    signal.initial.type == "table" ? "0" : "1"
  );

  useEffect(() => {
    if (funcLatex) {
      const fixedLatex = funcLatex
        .replace(/\\le /g, "\\sim ")
        .replace(/\\ll /g, "\\lt ")
        .replace(/\\gg /g, "\\gt ")
        .replace(/\\int /g, "\\cot ");
      const ast = mathlive.latexToAST(fixedLatex);
      setFunc(ast);
    }
  }, [funcLatex]);

  const getTabInitial = () => {
    if (activeTab === "0") {
      return { type: "table", leaps };
    } else if (activeTab === "1") {
      return { type: "func", func, funcLatex };
    }
    return {};
  };
  const getEndSignal = () => {
    if (activeTab === "0") {
      let delay = 0;
      leaps.forEach((e) => {
        delay = Math.max(delay, e.delay);
      });
      const range = delay > 0 ? fixed(delay * 2) : 1;
      return range;
    } else if (activeTab === "1" && funcLatex) {
      const matches1 = [
        ...funcLatex.matchAll(/(>|<|\\ne |\\le |\\ge )([0-9.]+)/g),
      ];
      const matches2 = [
        ...funcLatex.matchAll(/,([0-9.]+)(\\right\)|\\right\\rbrack )/g),
      ];
      if (matches1.length > 0 || matches2.length > 0) {
        const max = Math.max(
          ...matches1.map((e) => e[2]),
          ...matches2.map((e) => e[1])
        );
        return fixed(max * 2);
      }
    }
    return 1;
  };
  const handleSave = (_) => {
    const exitSignal = signal;
    exitSignal.show = true;
    exitSignal.initial = getTabInitial();
    props.close();
    props.save(exitSignal);
  };

  return (
    <div className="SignalEdit">
      <Modal
        destroyOnClose={true}
        closable={false}
        visible={props.visible}
        onCancel={props.close}
        zIndex={1}
        cancelText="Отмена"
        okText="Сохранить"
        onOk={handleSave}
        width={"95%"}
        title={
          <div style={{ position: "relative" }}>
            <Title
              level={3}
              editable={{
                onChange: (e) => {
                  if (e) setSignal((old) => ({ ...old, name: e }));
                },
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
                    onChange={(e) =>
                      setSignal((old) => ({ ...old, color: e.hex }))
                    }
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
                  cursor: "pointer",
                }}
              ></div>
            </Popover>
          </div>
        }
      >
        <Row>
          <Col span={24} md={12}>
            <Tabs activeKey={activeTab} onTabClick={setActiveTab}>
              <TabPane tab="Таблица" key="0">
                <TableMode leaps={leaps} setLeaps={setLeaps} />
              </TabPane>
              <TabPane tab="Функция" key="1">
                <FunctionMode latex={funcLatex} setLatex={setFuncLatex} />
              </TabPane>
            </Tabs>
          </Col>
          <Col span={24} md={12} style={{ minHeight: 200 }}>
            <Chart
              preview={true}
              charts={[
                {
                  name: false,
                  id: 0,
                  show: true,
                  color: signal.color,
                  initial: getTabInitial(),
                },
              ]}
              numberPoints={100}
              renderRange={[0, getEndSignal()]}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

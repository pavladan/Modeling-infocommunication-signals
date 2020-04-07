import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import katex from "katex";
import "katex/dist/katex.min.css";
import { InputNumber, Popover, Button, Table } from "antd";

export default function OperatorTransferFunction() {
  const [inputParentElements, setInputParentElements] = useState([]);
  const [variables, setVariables] = useState({
    Cz: 1,
    Nz1: 1,
    Nz2: 1,
    Nz3: 1,
    Nz4: 1,
    az1s: {},
    az2e: {},
    az3x: {},
    az4y: {},
    nz1s: {},
    nz2e: {},
    nz3x: {},
    nz4y: {},
    wz2e: {},
    wz4y: {},
  });
  const setVariable = (name, value) => {
    setVariables((old) => {
      if (old[name] !== value) return { ...old, [name]: value };
      return old;
    });
  };
  const katexRef = useCallback((node) => {
    if (node) {
      katex.render(
        `K\\left(P\\right)=\\frac{G\\left(P\\right)}{CV\\left(P\\right)}=\\frac{\\prod ^{\\colorbox{none}{Nz3}}_{x\\mathop{=}1}\\left(P+\\colorbox{none}{az3x}\\right)^{\\colorbox{none}{nz3x}}\\cdot \\prod ^{\\colorbox{none}{Nz4}}_{y=1}\\left(P^2+2\\colorbox{none}{az4y}P+\\colorbox{none}{az4y}^2+\\colorbox{none}{wz4y}^2\\right)^{\\colorbox{none}{nz4y}}}{\\colorbox{none}{Cz}\\prod ^{\\colorbox{none}{Nz1}}_{s=1}\\left(P+\\colorbox{none}{az1s}\\right)^{\\colorbox{none}{nz1s}}\\cdot \\prod ^{\\colorbox{none}{Nz2}}_{e=1}\\left(P^2+2\\colorbox{none}{az2e}P+\\colorbox{none}{az2e}^2+\\colorbox{none}{wz2e}^2\\right)^{\\colorbox{none}{nz2e}}}`,
        node,
        {
          throwOnError: false,
          trust: true,
        }
      );
      const elements = [...document.querySelectorAll(".boxpad")].map((n) => ({
        element: n,
        name: n.textContent,
      }));
      elements.forEach((e) => (e.element.textContent = ""));
      setInputParentElements(elements);
    }
  }, []);
  useEffect(() => {
    console.log(variables);
  }, [variables]);
  const inputElements = inputParentElements.map(({ element, name }, i) => {
    if (name.slice(0, 1) === "N" || name.slice(0, 1) === "C") {
      element.style.padding = 0;
      return (
        <SimpleInputPortal
          key={i}
          value={variables[name]}
          onBlur={(value) => setVariable(name, value)}
          el={element}
        ></SimpleInputPortal>
      );
    } else if (name.slice(0, 1) === "a" || name.slice(0, 1) === "w"|| name.slice(0, 1) === "n") {
      const curNameN = "Nz" + name.slice(2, 3);
      return (
        <TableValueViewPortal
          key={i}
          value={variables[name]}
          onChange={(v) => setVariable(name, v)}
          number={variables[curNameN]}
          style={{ position: "relative", zIndex: 1, width: 60 }}
          el={element}
        />
      );
    }
    return null;
  });
  return (
    <div ref={katexRef} className="OperatorTransferFunction">
      {inputElements}
    </div>
  );
}

function SimpleInputPortal(props) {
  return ReactDOM.createPortal(
    <InputNumber
      min={1}
      precision={0}
      defaultValue={props.value}
      onBlur={(e) => {
        props.onBlur(+e.target.value);
      }}
      onPressEnter={(e) => {
        e.target.blur();
      }}
      step={1}
      size="small"
      style={{ position: "relative", zIndex: 1, width: 45 }}
      tabIndex={0}
    ></InputNumber>,
    props.el
  );
}

function TableValueViewPortal(props) {
  const [visible, setVisible] = useState(false);

  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  const columns = [
    {
      title: "Index",
      dataIndex: "i",
    },
    {
      title: "Value",
      dataIndex: "value",
      render: (_, el) => {
        return (
          <InputNumber
            defaultValue={el.value}
            onBlur={(event) => {
              props.onChange({ ...props.value, [el.i]: event.target.value });
            }}
            onPressEnter={(e) => e.target.blur()}
          ></InputNumber>
        );
      },
    },
  ];

  const data = [...Array(props.number)].map((e, i) => {
    let value;
    if (props.value[i + 1] !== undefined) value = props.value[i + 1];
    return {
      key: i,
      i: i + 1,
      value,
    };
  });
  const popoverContent = (
    <>
      <Table columns={columns} dataSource={data} size="small" />
      <a onClick={hide}>Close</a>
    </>
  );
  return ReactDOM.createPortal(
    <Popover
      content={popoverContent}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button
        type="primary"
        size="small"
        type="default"
        style={{ ...props.style }}
      >
        {props.buttonText}
      </Button>
    </Popover>,
    props.el
  );
}

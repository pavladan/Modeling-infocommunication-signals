import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import katex from "katex";

import { InputNumber, Popover, Button, Table } from "antd";

export default function OperatorTransferFunction(props) {
  const [inputParentElements, setInputParentElements] = useState([]);

  const setVariable = (name, value) => {
    props.setVariable({ [name]: value });
  };
  const katexRef = useCallback((node) => {
    if (node) {
      // ^{\\colorbox{none}{n3x}}
      katex.render(
        `K\\left(P\\right)=\\frac{G\\left(P\\right)}{CV\\left(P\\right)}=\\frac{\\prod ^{\\colorbox{none}{N3}}_{x\\mathop{=}1}\\left(P+\\colorbox{none}{a3x}\\right)\\cdot \\prod ^{\\colorbox{none}{N4}}_{y=1}\\left(P^2+2\\colorbox{none}{a4y}P+\\colorbox{none}{a4y}^2+\\colorbox{none}{w4y}^2\\right)}{\\colorbox{none}{Cz}\\prod ^{\\colorbox{none}{N1}}_{s=1}\\left(P+\\colorbox{none}{a1s}\\right)\\cdot \\prod ^{\\colorbox{none}{N2}}_{l=1}\\left(P^2+2\\colorbox{none}{a2e}P+\\colorbox{none}{a2e}^2+\\colorbox{none}{w2e}^2\\right)}`,
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
  const inputElements = inputParentElements.map(({ element, name }, i) => {
    if (name.slice(0, 1) === "N") {
      element.style.padding = 0;
      const changeValue = (value) => {
        setVariable(name, value);
        Object.keys(props.variables).forEach((varName) => {
          if (varName.slice(1, 2) === name.slice(1, 2) && name !== varName) {
            const trimedVar = {};
            for (let i = 1; i <= value; i++) {
              trimedVar[i] = props.variables[varName][i] || null;
            }

            setVariable(varName, trimedVar);
          }
        });
      };
      return ReactDOM.createPortal(
        <PrimeNumbersInput
          key={i}
          value={props.variables[name]}
          onChange={changeValue}
        ></PrimeNumbersInput>,
        element
      );
    } else if (name.slice(0, 1) === "C") {
      return ReactDOM.createPortal(
        <SimpleNumbersInput
          key={i}
          value={props.variables[name]}
          onChange={(value) => setVariable(name, value)}
        ></SimpleNumbersInput>,
        element
      );
    } else if (
      name.slice(0, 1) === "a" ||
      name.slice(0, 1) === "w" ||
      name.slice(0, 1) === "n"
    ) {
      return ReactDOM.createPortal(
        <TableValueView
          key={i}
          value={props.variables[name]}
          onChange={(v) => setVariable(name, v)}
          style={{ position: "relative", zIndex: 1 }}
          condition={(e) => {
            if (name.slice(1, 2) === "1" || name.slice(1, 2) === "2") {
              return e > 0;
            } else if (name.slice(0, 1) === "w") {
              return e > 0;
            }
            return true;
          }}
        />,
        element
      );
    }
    return null;
  });
  return (
    <div
      ref={katexRef}
      className="OperatorTransferFunction"
      style={{ overflow: "auto", padding: "10px 0px" }}
    >
      {inputElements}
    </div>
  );
}

function PrimeNumbersInput(props) {
  return (
    <InputNumber
      value={props.value}
      onChange={(e) => {
        if (typeof e === "number" && e >= 0 && e < 1000 && Number.isInteger(e))
          props.onChange(e);
        else if (e === null) props.onChange(1);
      }}
      onPressEnter={(e) => {
        e.target.blur();
      }}
      size="small"
      style={{ position: "relative", zIndex: 1, width: 45 }}
      tabIndex={0}
    ></InputNumber>
  );
}
function SimpleNumbersInput(props) {
  return (
    <InputNumber
      value={props.value}
      onChange={(e) => {
        if (typeof e === "number" && e !== 0) {
          props.onChange(e);
        } else if (e === null) props.onChange(1);
      }}
      parser={(e) => {
        if (e.slice(-1) === ",") return e.slice(0, -1) + ".";
        return e;
      }}
      onPressEnter={(e) => {
        e.target.blur();
      }}
      size="small"
      style={{ position: "relative", zIndex: 1, width: 75 }}
      tabIndex={0}
    ></InputNumber>
  );
}

function TableValueView(props) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  const data = Object.keys(props.value).map((key, i) => {
    const value = props.value[key];
    return {
      key,
      i: key,
      value,
    };
  });

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
            value={el.value}
            onPressEnter={(e) => e.target.blur()}
            parser={(e) => {
              if (e.slice(-1) === ",") return e.slice(0, -1) + ".";
              return e;
            }}
            tabIndex={0}
            style={{ borderColor: el.value === null && "red", width: 130 }}
            onChange={(e) => {
              if (
                typeof e === "number" &&
                (props.condition ? props.condition(e) : true)
              ) {
                props.onChange({
                  ...props.value,
                  [el.i]: e,
                });
              }
            }}
          ></InputNumber>
        );
      },
    },
  ];

  const popoverContent = (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      pagination={false}
    />
  );
  return (
    <Popover
      content={popoverContent}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      placement="top"
      style={{ maxHeight: 200, overflowY: "auto" }}
    >
      <Button
        type="primary"
        size="small"
        type="default"
        style={{
          ...props.style,
          overflow: "hidden",
          maxWidth: 100,
          minWidth: 10,
        }}
        danger={data.some((d) => d.value === null)}
      >
        {data.map((e) => (e.value !== null ? e.value : " ")).join(", ")}
      </Button>
    </Popover>
  );
}

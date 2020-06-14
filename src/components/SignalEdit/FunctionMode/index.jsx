import React, { useState, useEffect } from "react";
import { MathFieldComponent } from "react-mathlive";
import { Tabs, Tooltip } from "antd";
import "./FunctionMode.scss";
import katex from "katex";

const { TabPane } = Tabs;

export default function FunctionMode(props) {
  const [mathFieltRef, setMathFieltRef] = useState(null);
  const [keyboardTab, setKeyboardTab] = useState("0");

  const keyboardButtons = [
    {
      title: "123",
      buttons: [
        [
          {
            latex: "7",
          },
          {
            latex: "8",
          },
          {
            latex: "9",
          },
          {
            title: "÷",
            latex: "\\frac{\\placeholder{}}{\\placeholder{denominator}}",
          },
          {},
          {
            title: "e",
            latex: "\\exponentialE",
            placeholder: "e",
          },
          {
            latex: "\\pi",
            placeholder: "\\pi",
          },
        ],
        [
          {
            latex: "4",
          },
          {
            latex: "5",
          },
          {
            latex: "6",
          },
          {
            title: "×",
            latex: "\\cdot",
          },
          {},
          {
            latex: "t",
          },
          {
            title: "x _{y}",
            latex: "_{\\placeholder{}}",
            placeholder: "_y",
          },
        ],
        [
          {
            latex: "1",
          },
          {
            latex: "2",
          },
          {
            latex: "3",
          },
          {
            latex: "-",
          },
          {},
          {
            title: "x^2",
            latex: "\\placeholder{}^2",
            placeholder: "^2",
          },
          {
            title: "x^y",
            latex: "\\placeholder{}^{\\placeholder{}}",
            placeholder: "^y",
          },
        ],
        [
          {
            latex: "0",
          },
          {
            latex: ".",
          },
          {
            latex: "=",
          },
          {
            latex: "+",
          },
          {},
          {
            title: "\\sqrt{x}",
            latex: "\\sqrt{\\placeholder{}}",
            placeholder: "\\sqrt",
          },
          {
            title: "\\sqrt[y]{x}",
            latex: "\\sqrt[\\placeholder{}]{\\placeholder{}}",
            placeholder: "\\sqrt[y]",
          },
        ],
      ],
    },
    {
      title: "f()",
      buttons: [
        [
          {
            latex: "\\sin",
            placeholder: "\\sin",
          },
          {
            latex: "\\arcsin",
            placeholder: "\\arcsin",
          },

          {
            latex: "\\ln",
            placeholder: "\\ln",
          },
          {
            title: "\\operatorname{ceil}(x)",
            latex: "\\operatorname{ceil}(\\placeholder{})",
            placeholder: "\\operatorname{ceil}",
          },
          {
            title: "\\int ^t_0 x dt ",
            latex:
              "\\int ^t_0\\left( \\placeholder{}\\differentialD t\\right) ",
            placeholder: "\\int ^t_0 ",
          },
          {
            title: "\\lvert x\\rvert",
            latex: "\\left|\\placeholder{}\\right|",
            placeholder: "\\lvert x\\rvert",
          },
        ],
        [
          {
            latex: "\\cos",
            placeholder: "\\cos",
          },
          {
            latex: "\\arccos",
            placeholder: "\\arccos",
          },

          {
            latex: "\\log _{10}",
            placeholder: "\\log _{10}",
          },
          {
            title: "\\operatorname{floor}(x)",
            latex: "\\operatorname{floor}(\\placeholder{})",
            placeholder: "\\operatorname{floor}",
          },
          {
            title: "\\sum ^{x }_{n\\mathop{=}0}",
            latex: "\\sum ^{\\placeholder{} }_{n\\mathop{=}0}",
            placeholder: "\\sum ^{x}_{n=0}",
          },
          {
            title: "\\operatorname{sign}(x)",
            latex: "\\operatorname{sign}(\\placeholder{})",
            placeholder: "\\operatorname{sign}",
          },
        ],
        [
          {
            latex: "\\tan",
            placeholder: "\\tan",
          },
          {
            latex: "\\arctan",
            placeholder: "\\arctan",
          },

          {
            title: "\\log _{x}",
            latex: "\\log _{\\placeholder{}}",
            placeholder: "\\log _{x}",
          },
          {
            title: "\\operatorname{round}(x)",
            latex: "\\operatorname{round}(\\placeholder{})",
            placeholder: "\\operatorname{round}",
          },

          {
            title: "\\prod ^{x }_{n\\mathop{=}0}",
            latex: "\\prod ^{\\placeholder{} }_{n\\mathop{=}0}",
            placeholder: "\\prod ^{x }_{n=0}",
          },
          {
            title: "f(x)",
            latex: "f(\\placeholder{})",
            placeholder: "f(x)",
          },
        ],
        [
          {
            title: "\\begin{cases}x \\\\ y\\end{cases}",
            latex:
              "\\begin{cases}\\placeholder{} \\\\ \\placeholder{}\\end{cases}",
            style: { fontSize: 12 },
            placeholder: "{",
          },
        ],
      ],
    },
    {
      title: ">=",
      buttons: [
        [
          {
            title: "≠",
            latex: "\\ne",
            noKatex: true,
            placeholder: "\\ne",
          },
          {
            latex: "\\le",
            placeholder: "\\le",
          },
          {
            latex: "<",
            placeholder: "<",
          },
          {
            latex: ">",
            placeholder: ">",
          },
          {
            latex: "\\ge",
            placeholder: "\\ge",
          },
          {
            latex: "\\infty",
            placeholder: "\\infty",
          },
          {
            latex: "\\in",
            placeholder: "\\in",
          },
          {},
        ],
      ],
    },
  ];
  const changeKeyboardTab = (key) => {
    setKeyboardTab((old) => {
      if (old === key) {
        return "-1";
      }
      return key;
    });
  };
  return (
    <div>
      <div className={"keyboard" + (keyboardTab === "-1" ? " collapse" : "")}>
        <Tabs
          type="card"
          size="small"
          activeKey={keyboardTab}
          onTabClick={changeKeyboardTab}
        >
          {keyboardButtons.map((b, i) => (
            <TabPane tab={b.title} key={i}>
              <div className={"keyboard-block keyboard-block-" + i}>
                {b.buttons.map((b, i) => (
                  <div className="keyboard-row" key={i}>
                    {b.map((b, i) => {
                      return b.latex ? (
                        <Tooltip title={b.placeholder} mouseEnterDelay={1}>
                          <div
                            className="keyboard-button"
                            onClick={(e) => {
                              mathFieltRef.$insert(b.latex);
                              mathFieltRef.$focus();
                            }}
                            key={i}
                            style={b.style}
                            ref={(node) => {
                              if (node && !b.noKatex) {
                                katex.render(b.title || b.latex, node, {
                                  throwOnError: false,
                                  trust: true,
                                });
                              }
                            }}
                          >
                            {b.noKatex && b.title}
                          </div>
                        </Tooltip>
                      ) : (
                        <div className="keyboard-space" key={i}></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>
      <div style={{ display: "flex", fontSize: "20px", alignItems: "center" }}>
        <MathFieldComponent
          latex="f\mleft(t\mright)="
          mathFieldConfig={{
            readOnly: true,
          }}
        />
        <div onClick={(e) => mathFieltRef.$focus()} className="input-field">
          <MathFieldComponent
            latex={props.latex}
            onChange={(e) => {
              props.setLatex(e);
            }}
            mathFieldRef={(mf) => setMathFieltRef(mf)}
            mathFieldConfig={{
              defaultMode: "math",
              locale: "ru-RU",
              smartSuperscript: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { MathFieldComponent } from "react-mathlive";
import { Tabs } from "antd";
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
          },
          {
            latex: "\\pi",
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
          },
          {
            title: "x^y",
            latex: "\\placeholder{}^{\\placeholder{}}",
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
          },
          {
            title: "\\sqrt[y]{x}",
            latex: "\\sqrt[\\placeholder{}]{\\placeholder{}}",
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
          },
          {
            latex: "\\arcsin",
          },

          {
            latex: "\\ln",
          },
          {
            title: "\\operatorname{ceil}(x)",
            latex: "\\operatorname{ceil}(\\placeholder{})",
          },
          {
            title: "\\begin{cases}x \\\\ y\\end{cases}",
            latex:
              "\\begin{cases}\\placeholder{} \\\\ \\placeholder{}\\end{cases}",
            style: { fontSize: 12 },
          },
          {
            title: "\\lvert x\\rvert",
            latex: "\\left|\\placeholder{}\\right|",
          },
        ],
        [
          {
            latex: "\\cos",
          },
          {
            latex: "\\arccos",
          },

          {
            latex: "\\log _{10}",
          },
          {
            title: "\\operatorname{floor}(x)",
            latex: "\\operatorname{floor}(\\placeholder{})",
          },
          {
            title: "\\sum ^{x }_{n\\mathop{=}0}",
            latex: "\\sum ^{\\placeholder{} }_{n\\mathop{=}0}",
          },
          {
            title: "\\operatorname{sign}(x)",
            latex: "\\operatorname{sign}(\\placeholder{})",
          },
        ],
        [
          {
            latex: "\\tan",
          },
          {
            latex: "\\arctan",
          },

          {
            title: "\\log _{x}",
            latex: "\\log _{\\placeholder{}}",
          },
          {
            title: "\\operatorname{round}(x)",
            latex: "\\operatorname{round}(\\placeholder{})",
          },

          {
            title: "\\prod ^{x }_{n\\mathop{=}0}",
            latex: "\\prod ^{\\placeholder{} }_{n\\mathop{=}0}",
          },
          {
            title: "f(x)",
            latex: "f(\\placeholder{})",
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
          },
          {
            latex: "<",
          },
          {
            latex: ">",
          },
          {
            latex: "\\ge",
          },
          {
            latex: "\\infty",
          },
          {
            latex: "\\in",
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
              virtualKeyboardMode: "manual",
            }}
          />
        </div>
      </div>
    </div>
  );
}

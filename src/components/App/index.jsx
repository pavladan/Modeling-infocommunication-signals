import React, { useState, useEffect } from "react";
import Chart from "../Chart";
import { Layout } from "antd";
import Sidebar from "../Sidebar";
import Helmet from "react-helmet";

const { Content, Sider } = Layout;

export default function App() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");
  const [collapsed, setCollapsed] = useState(false);
  const [signals, setSignals] = useState([
    {
			name: "Прямоугольный импульс",
      id: "s99",
      show: true,
      color: "#000",
			initial:{
				type: "table", leaps: [{ key: 0, amplitude: 1, delay: 5 }] 
			}
		},
    {
      name: "Периодическая последовательность видеоимпульсов треугольной формы",
      id: "s0",
      show: false,
      color: "#000",
      initial: {
        type: "func",
        func: {
          fn: "cases",
          args: [
            [
              {
                fn: "list",
                arg: [
                  {
                    fn: "multiply",
                    arg: [
                      { fn: "divide", arg: [{ num: "1" }, { num: "1" }] },
                      { sym: "t" },
                    ],
                  },
                  {
                    fn: "\\lbrack)",
                    arg: [{ fn: "list", arg: [{ num: "0" }, { num: "1" }] }],
                  },
                ],
              },
              {},
            ],
            [
              {
                fn: "list",
                arg: [
                  {
                    fn: "subtract",
                    arg: [
                      {
                        fn: "multiply",
                        arg: [
                          {
                            fn: "divide",
                            arg: [
                              { num: "1" },
                              {
                                fn: "subtract",
                                arg: [{ num: "1" }, { num: "1.5" }],
                              },
                            ],
                          },
                          { sym: "t" },
                        ],
                      },
                      {
                        fn: "divide",
                        arg: [
                          {
                            fn: "multiply",
                            arg: [{ num: "1" }, { num: "1.5" }],
                          },
                          {
                            fn: "subtract",
                            arg: [{ num: "1" }, { num: "1.5" }],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    fn: "\\lbrack)",
                    arg: [{ fn: "list", arg: [{ num: "1" }, { num: "1.5" }] }],
                  },
                ],
              },
              {},
            ],
            [
              {
                fn: "list",
                arg: [
                  { num: "0" },
                  {
                    fn: "\\lbrack)",
                    arg: [
                      { fn: "list", arg: [{ num: "1.5" }, { num: "1.5" }] },
                    ],
                  },
                ],
              },
              {},
            ],
            [
              {
                fn: "list",
                arg: [
                  {
                    fn: "f",
                    arg: [
                      { fn: "subtract", arg: [{ sym: "t" }, { num: "1.5" }] },
                    ],
                  },
                  { fn: "negate", arg: [{ sym: "∞" }] },
                  { sym: "∞" },
                ],
              },
              {},
            ],
            [null, {}],
          ],
        },
        funcLatex:
          "\\begin{cases}\\frac{1}{1}\\cdot t,\\left\\lbrack 0,1\\right) \\\\ \\frac{1}{1-1.5}\\cdot t-\\frac{1\\cdot 1.5}{1-1.5},\\left\\lbrack 1,1.5\\right) \\\\ 0,\\left\\lbrack 1.5,1.5\\right) \\\\ f\\mleft(t-1.5\\mright),\\left(-\\infty ,\\infty \\right) \\\\ \\end{cases}",
      },
    },
    {
      name: "Радиосигнал с ЛЧМ",
      id: "s1",
      show: false,
      color: "blue",
      initial: {
        type: "func",
        func: {
          fn: "multiply",
          arg: [
            { num: "1" },
            {
              fn: "cos",
              arg: [
                {
                  fn: "add",
                  arg: [
                    {
                      fn: "multiply",
                      arg: [
                        { num: "2" },
                        { sym: "π" },
                        { num: "5" },
                        { sym: "t" },
                      ],
                    },
                    {
                      fn: "multiply",
                      arg: [
                        { num: "2" },
                        { sym: "π" },
                        {
                          fn: "cot",
                          sub: { num: "0" },
                          sup: { sym: "t" },
                          arg: [
                            {
                              fn: "differentialD",
                              arg: [
                                {
                                  fn: "cases",
                                  args: [
                                    [
                                      {
                                        fn: "list",
                                        arg: [
                                          {
                                            fn: "multiply",
                                            arg: [
                                              {
                                                fn: "divide",
                                                arg: [
                                                  { num: "2" },
                                                  { num: "5" },
                                                ],
                                              },
                                              { sym: "t" },
                                            ],
                                          },
                                          {
                                            fn: "\\lbrack)",
                                            arg: [
                                              {
                                                fn: "list",
                                                arg: [
                                                  { num: "0" },
                                                  { num: "5" },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                      {},
                                    ],
                                    [
                                      {
                                        fn: "list",
                                        arg: [
                                          { num: "0" },
                                          {
                                            fn: "\\lbrack)",
                                            arg: [
                                              {
                                                fn: "list",
                                                arg: [
                                                  { num: "5" },
                                                  { num: "7" },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                      {},
                                    ],
                                    [
                                      {
                                        fn: "list",
                                        arg: [
                                          {
                                            fn: "f",
                                            arg: [
                                              {
                                                fn: "subtract",
                                                arg: [
                                                  { sym: "t" },
                                                  { num: "7" },
                                                ],
                                              },
                                            ],
                                          },
                                          { fn: "negate", arg: [{ sym: "∞" }] },
                                          { sym: "∞" },
                                        ],
                                      },
                                      {},
                                    ],
                                    [null, {}],
                                  ],
                                },
                                { sym: "t" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      fn: "multiply",
                      arg: [
                        { num: "2" },
                        { sym: "π" },
                        {
                          fn: "cot",
                          sub: { num: "0" },
                          sup: { sym: "t" },
                          arg: [
                            {
                              fn: "differentialD",
                              arg: [
                                {
                                  fn: "cases",
                                  args: [
                                    [
                                      {
                                        fn: "list",
                                        arg: [
                                          {
                                            fn: "subtract",
                                            arg: [
                                              {
                                                fn: "multiply",
                                                arg: [
                                                  {
                                                    fn: "divide",
                                                    arg: [
                                                      { num: "2" },
                                                      {
                                                        fn: "subtract",
                                                        arg: [
                                                          { num: "5" },
                                                          { num: "7" },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                  { sym: "t" },
                                                ],
                                              },
                                              {
                                                fn: "divide",
                                                arg: [
                                                  {
                                                    fn: "multiply",
                                                    arg: [
                                                      { num: "2" },
                                                      { num: "7" },
                                                    ],
                                                  },
                                                  {
                                                    fn: "subtract",
                                                    arg: [
                                                      { num: "5" },
                                                      { num: "7" },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            fn: "\\lbrack)",
                                            arg: [
                                              {
                                                fn: "list",
                                                arg: [
                                                  { num: "5" },
                                                  { num: "7" },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                      {},
                                    ],
                                    [
                                      {
                                        fn: "list",
                                        arg: [
                                          { num: "0" },
                                          {
                                            fn: "\\lbrack)",
                                            arg: [
                                              {
                                                fn: "list",
                                                arg: [
                                                  { num: "0" },
                                                  { num: "5" },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                      {},
                                    ],
                                    [
                                      {
                                        fn: "list",
                                        arg: [
                                          {
                                            fn: "f",
                                            arg: [
                                              {
                                                fn: "subtract",
                                                arg: [
                                                  { sym: "t" },
                                                  { num: "7" },
                                                ],
                                              },
                                            ],
                                          },
                                          { fn: "negate", arg: [{ sym: "∞" }] },
                                          { sym: "∞" },
                                        ],
                                      },
                                      {},
                                    ],
                                  ],
                                },
                                { sym: "t" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    { num: "0" },
                  ],
                },
              ],
            },
          ],
        },
        funcLatex:
          "1\\cdot \\cos \\mleft(2\\pi \\cdot 5\\cdot t+2\\pi \\cdot \\int ^t_0\\left(\\begin{cases}\\frac{2}{5}\\cdot t,\\left\\lbrack 0,5\\right) \\\\ 0,\\left\\lbrack 5,7\\right) \\\\ f\\mleft(t-7\\mright),\\left(-\\infty ,\\infty \\right) \\\\ \\end{cases}\\differentialD t\\right)+2\\pi \\int ^t_0\\left(\\begin{cases}\\frac{2}{5-7}t-\\frac{2\\cdot 7}{5-7},\\left\\lbrack 5,7\\right) \\\\ 0,\\left\\lbrack 0,5\\right) \\\\ f\\mleft(t-7\\mright),\\left(-\\infty ,\\infty \\right)\\end{cases}\\differentialD t\\right)+0\\mright)",
      },
    },
  ]);
  const [signal, setSignal] = useState();
  const [results, setResults] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [forceGetData, setForceGetData] = useState(false);
  useEffect(() => {
    const updateWindowDimensions = (e) => {
      if (window.innerWidth < 436) {
        setSidebarWidth(window.innerWidth - 36);
      } else {
        setSidebarWidth(400);
      }
    };
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  });
  const onCollapse = (state) => {
    setCollapsed(state);
  };

  const toggleShowSignal = (e, id) => {
    e.stopPropagation();
    setSignals((old) => {
      return old.map((s) => {
        if (s.id === id) {
          return { ...s, show: !s.show };
        }
        return s;
      });
    });
  };
  const deleteSignal = (_) => {
    setSignals((old) => {
      const newSignals = old.filter((s) => s.id !== signal);
      const lastSignal = newSignals[newSignals.length - 1];
      setSignal(lastSignal ? lastSignal.id : undefined);
      return newSignals;
    });
  };
  const changeColorOnSignal = (id, color) => {
    setSignals((old) => {
      return old.map((r) => {
        if (r.id === id) {
          return { ...r, color: color.hex };
        }
        return r;
      });
    });
  };
  const editSignal = (newSignal) => {
    setSignals((old) => {
      if (newSignal.id !== undefined) {
        return old.map((s) => {
          if (s.id === newSignal.id) {
            return newSignal;
          }
          return s;
        });
      } else {
        const ids = old.map((s) => s.id);
        const newId = genNewId(ids, "s");
        setSignal(newId);
        return [...old, { ...newSignal, id: newId }];
      }
    });
  };
  const genNewId = (ids, preId) => {
    let newId = 0;
    while (ids.some((id) => +id.replace(preId, "") === newId)) {
      newId++;
    }
    return preId + newId;
  };
  const changeColorOnResult = (id, color) => {
    setResults((old) => {
      return old.map((r) => {
        if (r.id === id) {
          return { ...r, color: color.hex };
        }
        return r;
      });
    });
  };
  const setNameOnResult = (id, name) => {
    setResults((old) => {
      return old.map((r) => {
        if (r.id === id) {
          return { ...r, name: name };
        }
        return r;
      });
    });
  };
  const addResult = (newResult) => {
    setResults((old) => {
      const ids = old.map((s) => s.id);
      const newId = genNewId(ids, "r");
      return [...old, { ...newResult, id: newId }];
    });
  };

  const toggleShowResult = (id) => {
    setResults((old) => {
      return old.map((r) => {
        if (r.id === id) {
          return { ...r, show: !r.show };
        }
        return r;
      });
    });
  };
  const deleteResult = (id) => {
    setResults((old) => {
      return old.filter((r) => r.id !== id);
    });
  };

  return (
    <div className="App">
      <Helmet>
        <html lang={lang}></html>
        <body className={theme}></body>
      </Helmet>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          collapsedWidth={0}
          onCollapse={onCollapse}
          theme={theme}
          width={sidebarWidth}
          breakpoint={"md"}
        >
          <Sidebar
            style={{ width: sidebarWidth }}
            results={results}
            addResult={addResult}
            deleteResult={deleteResult}
            toggleShowResult={toggleShowResult}
            changeColorOnResult={changeColorOnResult}
            setNameOnResult={setNameOnResult}
            changeColorOnSignal={changeColorOnSignal}
            signal={signal}
            setSignal={setSignal}
            toggleShowSignal={toggleShowSignal}
            deleteSignal={deleteSignal}
            signals={signals}
            editSignal={editSignal}
            genNewId={genNewId}
            setForceGetData={setForceGetData}
          />
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Chart
              theme={theme}
              charts={[...signals, ...results]}
              forceGetData={forceGetData}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./App.scss";
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
      name: "sin",
      id: "s0",
      show: false,
      color: "red",
      data: [
        { x: 0, y: 2 },
        { x: 1, y: 4 },
        { x: 3, y: 3 },
        { x: 4, y: 6 },
      ],
      initial: {
        type: "table",
        leaps: [
          {
						key:0,
            amplitude: 1,
            delay: 0,
            fraquency: 1,
            phase: -90,
          },
        ],
      },
    },
    {
      name: "cos",
      id: "s1",
      show: true,
      color: "blue",
      data: [
        { x: 0, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 4 },
      ],
      initial: {
        type: "table",
        leaps: [
          {
						key:0,
            amplitude: 1,
            delay: 0,
            fraquency: 1,
            phase: 0,
          },
        ],
      },
    },
    {
      name: "leap",
      id: "s2",
      show: false,
      color: "green",
      data: [
        { x: 0, y: 7 },
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 0 },
        { x: 4, y: 7 },
      ],
      initial: {
        type: "none",
      },
    },
  ]);
  const [signal, setSignal] = useState();
  const [results, setResults] = useState([
    {
      name: "Result signal 1",
      show: false,
      color: "#000",
      id: "r0",
      data: [
        { x: 2, y: 4 },
        { x: 8, y: -5 },
      ],
    },
    { name: "Result signal 2", show: true, color: "#eee", id: "r1", data: [] },
  ]);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  useEffect(() => {
		const updateWindowDimensions = (e) => {
			if (window.innerWidth < 406){
				setSidebarWidth(window.innerWidth-36)
			}else{
				setSidebarWidth(370)
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
            style={{ width: sidebarWidth}}
            results={results}
            deleteResult={deleteResult}
            toggleShowResult={toggleShowResult}
            changeColorOnResult={changeColorOnResult}
            changeColorOnSignal={changeColorOnSignal}
            signal={signal}
            setSignal={setSignal}
            toggleShowSignal={toggleShowSignal}
            deleteSignal={deleteSignal}
            signals={signals}
            editSignal={editSignal}
						genNewId={genNewId}
          />
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>

              <Chart theme={theme} charts={[...signals, ...results]} />

          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

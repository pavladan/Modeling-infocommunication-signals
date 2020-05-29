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
      name: "sin",
      id: "s0",
      show: false,
      color: "red",
      initial: {
        type: "table",
        leaps: [
          {
            key: 0,
            amplitude: 1,
            delay: 0,
            fraquency: 6,
            phase: -90,
          },
        ],
      },
    },
    {
      name: "cos",
      id: "s1",
      show: false,
      color: "blue",
      initial: {
        type: "table",
        leaps: [
          {
            key: 0,
            amplitude: 1,
            delay: 0,
            fraquency: 6,
            phase: 0,
          },
        ],
      },
    },
  ]);
  const [signal, setSignal] = useState();
  const [results, setResults] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [forceGetData, setForceGetData] = useState(false);
  useEffect(() => {
    const updateWindowDimensions = (e) => {
      if (window.innerWidth < 406) {
        setSidebarWidth(window.innerWidth - 36);
      } else {
        setSidebarWidth(370);
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
            <Chart theme={theme} charts={[...signals, ...results]} forceGetData={forceGetData}/>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

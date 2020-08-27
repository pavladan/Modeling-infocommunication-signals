import React, { useState, useEffect } from "react";
import Chart from "../Chart";
import { Layout, message } from "antd";
import Sidebar from "../Sidebar";
import Helmet from "react-helmet";

const { Content, Sider } = Layout;
let worker = new Worker("../../worker/main.js", { type: "module" });

export default function App() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");
  const [collapsed, setCollapsed] = useState(false);
  const [signals, setSignals] = useState([]);
  const [signal, setSignal] = useState();
  const [results, setResults] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [forceGetData, setForceGetData] = useState(false);
  const [renderRange, setRenderRange] = useState([0, 10]);
  const [numberPoints, setNumberPoints] = useState(100);

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
  }, []);

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

  const saveResult = (id) => {
    const cur = results.find((e) => e.id === id);

    const getCalc = new Promise((resolve, reject) => {
      worker.postMessage({
        type: "calc",
        charts: [cur],
        range: { start: renderRange[0], end: renderRange[1], numberPoints },
      });
      const workerListener = (e) => {
        worker.removeEventListener("message", workerListener);
        if (e.data.type === "calc") {
          const resp = e.data.data;
          resolve(resp);
        } else {
          reject(e);
        }
      };
      worker.addEventListener("message", workerListener);
      worker.addEventListener("error", (err) => {
        worker.removeEventListener("message", workerListener);
        reject(err);
      });
    });

    getCalc
      .then((data) => {
				let resString = '';
				data.forEach(e=>{
					resString+=e[id] + '\n'
				})
        const blob = new Blob([resString], {
          type: "application/json",
        });
        saveAs(blob, cur.name + ".res");
      })
      .catch((err) => {
        console.error(err);
        message.error("Что-то пошло не так :(");
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
            saveResult={saveResult}
          />
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Chart
              theme={theme}
              charts={[...signals, ...results]}
              forceGetData={forceGetData}
              renderRange={renderRange}
              setRenderRange={setRenderRange}
              numberPoints={numberPoints}
              setNumberPoints={setNumberPoints}
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

import React, { useState } from "react";
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
      id: 0,
      show: false,
      color: "red",
      data: [
        { x: 0, y: 2 },
        { x: 1, y: 4 },
        { x: 3, y: 3 },
        { x: 4, y: 6 }
      ]
    },
    {
      name: "cos",
      id: 1,
      show: true,
      color: "blue",
      data: [
        { x: 0, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 4 }
      ]
    },
    {
      name: "squar",
      id: 2,
      show: false,
      color: "green",
      data: [
        { x: 0, y: 7 },
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 0 },
        { x: 4, y: 7 }
      ]
    }
  ]);
  const [signal, setSignal] = useState();
  const [results, setResults] = useState([
    { name: "Result signal 1", show: false, color: "#000", id: 3, data: [] },
    { name: "Result signal 2", show: true, color: "#eee", id: 4, data: [] }
  ]);
  const onCollapse = state => {
    setCollapsed(state);
  };
  const sidebarWidth = 470;

  const toggleShowSignal = (e, id) => {
    e.stopPropagation();
    setSignals(old => {
      return old.map(s => {
        if (s.id === id) {
          return { ...s, show: !s.show };
        }
        return s;
      });
    });
  };
  const deleteSignal = _ => {
    setSignals(old => {
      const newSignals = old.filter(s => s.id !== signal);
      const lastSignal = newSignals[newSignals.length - 1];
      setSignal(lastSignal ? lastSignal.id : undefined);
      return newSignals;
    });
  };
  const changeColorOnSignal = (id, color) => {
    setSignals(old => {
      return old.map(r => {
        if (r.id === id) {
          return { ...r, color: color.hex };
        }
        return r;
      });
    });
  };
  const editSignal = newSignal => {
    setSignals(old => {
      if (newSignal.id) {
        return old.map(s => {
          if (s.id === newSignal.id) {
            return newSignal;
          }
          return s;
        });
      } else {
				const ids = old.map(s=>s.id);
				return [...old,{...newSignal, id: genNewId(ids)}]
      }
    });
	};
	const genNewId=ids=>{
		let newId = 0;
		while (ids.some(id=>id===newId)) {newId++;}
		return newId;
	}
  const changeColorOnResult = (id, color) => {
    setResults(old => {
      return old.map(r => {
        if (r.id === id) {
          return { ...r, color: color.hex };
        }
        return r;
      });
    });
  };

  const toggleShowResult = id => {
    setResults(old => {
      return old.map(r => {
        if (r.id === id) {
          return { ...r, show: !r.show };
        }
        return r;
      });
    });
  };
  const deleteResult = id => {
    setResults(old => {
      return old.filter(r => r.id !== id);
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
        >
          <Sidebar
            style={{ width: sidebarWidth }}
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

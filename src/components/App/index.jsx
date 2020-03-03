import React, { useState } from "react";
import "./App.scss";
import Chart from "../Chart";
import { Layout } from "antd";
import Sidebar from "../Sidebar";
import Helmet from 'react-helmet'

const { Content, Sider } = Layout;

export default function App() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = state => {
    setCollapsed(state);
  };
  return (
    <div className="App">
			<Helmet >
				<html lang={lang}></html>
				<body className={theme}></body>
			</Helmet>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
					theme={theme}
					width={470}
        >
          <Sidebar />
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <Chart theme={theme} />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

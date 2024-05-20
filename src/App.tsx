import { Button, Layout, Menu, theme } from "antd";
import {
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import "./App.css";
import CreateTodo from "./Components/CreateTodo";
import TodoComponent from "./Components/TodoComponent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type navigateMapping = {
  "create-todo": string;
  "todos-list": string;
};

const NavigateMapping: navigateMapping = {
  "create-todo": "/create",
  "todos-list": "/showall",
};

const items = [
  {
    key: "Todo",
    icon: <FileOutlined style={{ color: "#fff" }} />,
    label: "Todos",
    children: [
      { key: "create-todo", label: "Create Todo" },
      { key: "todos-list", label: "Todos List" },
    ],
  },
];

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        // collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
            color: "#fff",
          }}
        />
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={({ key }: any) => {
            navigate(NavigateMapping[key as keyof navigateMapping]);
          }}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Routes>
              <Route path="/create" element={<CreateTodo />} />
              <Route path="/showall" element={<TodoComponent />} />
            </Routes>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
}
export default App;

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import EntryForm from "./pages/EntryForm";
import Dashboard from "./pages/Dashboard";
import { Layout, Menu } from "antd";
import { CarOutlined, DashboardOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

function Navbar() {
  const location = useLocation();
  const selectedKey = location.pathname === "/dashboard" ? "2" : "1";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Top Navbar */}
      <Header style={{ display: "flex", alignItems: "center", background: "#000" }}>
        <div style={{ color: "white", fontSize: "20px", fontWeight: "bold", marginRight: "2rem" }}>
          Vehicle Gate System {/* ✅ Removed 🚚 */}
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={[
            { key: "1", icon: <CarOutlined />, label: <Link to="/">Entry</Link> },
            { key: "2", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
          ]}
          style={{ flex: 1 }}
        />
      </Header>

      {/* Page Content */}
      <Content style={{ padding: "2rem", background: "#121212", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<EntryForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
}

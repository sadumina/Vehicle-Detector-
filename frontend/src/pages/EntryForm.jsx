import { useState } from "react";
import { createEntry, fetchVehicles } from "../services/api";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { detectVehicleType } from "../services/vehicleUtils";

const { Title, Text } = Typography;

export default function EntryForm() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async () => {
    if (!vehicleNo) {
      message.warning("⚠️ Please enter a vehicle number");
      return;
    }

    try {
      // ✅ Check existing vehicles to prevent duplicate active entry
      const res = await fetchVehicles();
      const existing = res.data.find(
        (v) => v.vehicleNo === vehicleNo && !v.outTime
      );

      if (existing) {
        message.error("🚫 This vehicle is already inside the factory!");
        return;
      }

      // If not duplicate → allow entry
      await createEntry(vehicleNo);
      message.success("✅ Vehicle entry recorded!");
      setVehicleNo("");
      setType("");
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to record entry");
    }
  };

  const handleChange = (val) => {
    setVehicleNo(val);
    setType(detectVehicleType(val));
  };

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      minHeight: "100vh", background: "linear-gradient(135deg, #0d0d0d, #1a1a1a)"
    }}>
      <Card
        style={{
          width: 400,
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          background: "#1a1a1a",
          color: "white"
        }}
        title={<Title level={4} style={{ color: "#00ff88", margin: 0 }}>🚚 Vehicle Entry</Title>}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label={<span style={{ color: "white" }}>Vehicle Number</span>}>
            <Input
              placeholder="E.g. ABC-1234"
              value={vehicleNo}
              onChange={(e) => handleChange(e.target.value)}
              style={{ background: "#2a2a2a", color: "white", border: "1px solid #444" }}
            />
          </Form.Item>

          {type && (
            <Text style={{ color: "#00ff88", marginBottom: "1rem", display: "block" }}>
              Detected Type: {type}
            </Text>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                borderRadius: "6px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #00ff88, #00cc66)",
                border: "none"
              }}
            >
              Save Entry
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

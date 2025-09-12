import { Bar, Pie } from "@ant-design/plots";

export default function VehicleCharts({ vehicles }) {
  const statusCount = [
    { type: "Inside", value: vehicles.filter(v => !v.outTime).length },
    { type: "Exited", value: vehicles.filter(v => v.outTime).length },
  ];

  const dailyCount = vehicles.reduce((acc, v) => {
    const date = new Date(v.inTime).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dailyData = Object.entries(dailyCount).map(([date, count]) => ({ date, count }));

  return (
    <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ color: "white" }}>Vehicle Status</h3>
       <Pie
  data={statusCount}
  angleField="value"
  colorField="type"
  radius={0.9}
  label={{
    position: "inside",       // ✅ correct in latest API
    content: (d) => `${d.value}`,
    style: { fontSize: 14, fill: "#fff" },
  }}
/>

      </div>

      <div style={{ flex: 2 }}>
        <h3 style={{ color: "white" }}>Vehicles Per Day</h3>
        <Bar data={dailyData} xField="count" yField="date" seriesField="date" legend={false} />
      </div>
    </div>
  );
}

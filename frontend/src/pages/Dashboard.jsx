import { useEffect, useState } from "react";
import { fetchVehicles, markExit } from "../services/api";
import { detectVehicleType } from "../services/vehicleUtils";
import VehicleCharts from "../components/VehicleCharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf/dist/polyfills.es.js";

// Load a Google font like Roboto (with unicode support)
const doc = new jsPDF();
doc.setFont("helvetica", "normal"); // safe

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const res = await fetchVehicles();
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch vehicles");
    }
  };

  const handleExit = async (id) => {
    try {
      await markExit(id);
      loadVehicles();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to mark exit");
    }
  };

  const calcDuration = (inTime, outTime) => {
    const start = new Date(inTime);
    const end = outTime ? new Date(outTime) : new Date();
    const diffMs = end - start;
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return outTime
      ? `${hours}h ${mins}m`
      : `⏳ ${hours}h ${mins}m (inside)`;
  };

  const generatePDF = (vehicle) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("🚚 Vehicle Report", 14, 20);

    autoTable(doc, {
      startY: 35,
      head: [["Field", "Value"]],
      body: [
        ["Vehicle No", vehicle.vehicleNo],
        ["Type", detectVehicleType(vehicle.vehicleNo)],
        ["In Time", new Date(vehicle.inTime).toLocaleString()],
        [
          "Out Time",
          vehicle.outTime ? new Date(vehicle.outTime).toLocaleString() : "Still Inside",
        ],
        ["Duration", calcDuration(vehicle.inTime, vehicle.outTime)],
      ],
      styles: { fontSize: 11, halign: "left" },
      headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
    });

    doc.save(`${vehicle.vehicleNo}_report.pdf`);
  };

  return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", padding: "2rem" }}>
      <div
        style={{
          background: "#1a1a1a",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
          color: "white",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ color: "#00ff88", margin: 0 }}>📊 Vehicle Dashboard</h2>
          <button
            onClick={() => alert("TODO: Export all vehicles as PDF/CSV")}
            style={{
              background: "#00ff88",
              color: "#0d0d0d",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ⬇ Export All
          </button>
        </div>

        {/* Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#004d26", color: "#ffffff" }}>
              <th style={{ padding: "14px", textAlign: "left" }}>Vehicle No</th>
              <th style={{ padding: "14px", textAlign: "left" }}>In Time</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Out Time</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "14px", textAlign: "left" }}>Duration</th>
              <th style={{ padding: "14px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? "#1f1f1f" : "#262626",
                  borderBottom: "1px solid #333",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#333")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = i % 2 === 0 ? "#1f1f1f" : "#262626")
                }
              >
                <td style={{ padding: "12px" }}>{v.vehicleNo}</td>
                <td style={{ padding: "12px" }}>
                  {new Date(v.inTime).toLocaleString()}
                </td>
                <td style={{ padding: "12px" }}>
                  {v.outTime ? new Date(v.outTime).toLocaleString() : "Still Inside"}
                </td>
                <td style={{ padding: "12px" }}>{detectVehicleType(v.vehicleNo)}</td>
                <td style={{ padding: "12px" }}>{calcDuration(v.inTime, v.outTime)}</td>
                <td style={{ textAlign: "center", padding: "12px" }}>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.5rem",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {!v.outTime && (
      <button
        onClick={() => handleExit(v.id)}
        style={{
          background: "#ff4444",
          color: "white",
          padding: "0.4rem 0.8rem",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Mark Exit
      </button>
    )}
    <button
      onClick={() => generatePDF(v)}
      style={{
        background: "#00bcd4",
        color: "white",
        padding: "0.4rem 0.8rem",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      📄 PDF
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div style={{ marginTop: "2rem" }}>
        <VehicleCharts vehicles={vehicles} />
      </div>
    </div>
  );
}

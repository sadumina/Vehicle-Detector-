import { useState } from "react";

// Mock functions - replace these with your actual imports
const createEntry = async (vehicleNo) => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};

const fetchVehicles = async () => {
  return { 
    data: [
      { vehicleNo: "ABC-1234", outTime: null },
      { vehicleNo: "XYZ-5678", outTime: "2024-01-15T10:30:00Z" }
    ] 
  };
};

const detectVehicleType = (vehicleNo) => {
  if (!vehicleNo) return "";
  const patterns = {
    'Truck': /^[A-Z]{2,3}-\d{4}$/,
    'Car': /^[A-Z]{3}-\d{3}$/,
    'Motorcycle': /^[A-Z]{2}-\d{4}$/
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(vehicleNo)) return type;
  }
  return "Unknown";
};

export default function EntryForm() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!vehicleNo) {
      alert("⚠️ Please enter a vehicle number");
      return;
    }

    setLoading(true);
    try {
      // ✅ Check existing vehicles to prevent duplicate active entry
      const res = await fetchVehicles();
      const existing = res.data.find(
        (v) => v.vehicleNo === vehicleNo && !v.outTime
      );

      if (existing) {
        alert("🚫 This vehicle is already inside the factory!");
        return;
      }

      // If not duplicate → allow entry
      await createEntry(vehicleNo);
      alert("✅ Vehicle entry recorded!");
      setVehicleNo("");
      setType("");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to record entry");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (val) => {
    setVehicleNo(val);
    setType(detectVehicleType(val));
  };

  const cardStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
    padding: "2rem"
  };

  const formCardStyle = {
    width: "100%",
    maxWidth: "450px",
    background: "linear-gradient(145deg, #1e293b, #334155)",
    borderRadius: "20px",
    padding: "3rem 2.5rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "2.5rem"
  };

  const iconStyle = {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem auto",
    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "0.5rem"
  };

  const subtitleStyle = {
    color: "#94a3b8",
    fontSize: "0.95rem"
  };

  const inputStyle = {
    width: "100%",
    padding: "1rem 1.25rem",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    marginTop: "0.5rem"
  };

  const labelStyle = {
    color: "#e2e8f0",
    fontSize: "0.9rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
    display: "block"
  };

  const buttonStyle = {
    width: "100%",
    padding: "1rem 1.5rem",
    background: loading ? "#64748b" : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    opacity: loading ? 0.7 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem"
  };

  const typeIndicatorStyle = {
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };

  const pulseStyle = {
    width: "8px",
    height: "8px",
    background: "#22c55e",
    borderRadius: "50%",
    animation: "pulse 2s infinite"
  };

  return (
    <div style={cardStyle}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .input-focus:focus {
            border-color: rgba(59, 130, 246, 0.5) !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
          }
        `}
      </style>
      
      <div style={formCardStyle}>
        {/* Decorative top border */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)"
        }}></div>

        <div style={headerStyle}>
          <div style={iconStyle}>
            <svg style={{width: "40px", height: "40px", color: "white"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 style={titleStyle}>Vehicle Entry</h1>
          <p style={subtitleStyle}>Register vehicle entry to the facility</p>
        </div>

        <div style={{marginBottom: "2rem"}}>
          <label style={labelStyle}>Vehicle Number</label>
          <input
            type="text"
            placeholder="E.g. ABC-1234"
            value={vehicleNo}
            onChange={(e) => handleChange(e.target.value.toUpperCase())}
            style={inputStyle}
            className="input-focus"
            disabled={loading}
          />
        </div>

        {type && (
          <div style={typeIndicatorStyle}>
            <div style={pulseStyle}></div>
            <span style={{color: "#22c55e", fontSize: "0.9rem", fontWeight: "500"}}>
              Detected Type: {type}
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={buttonStyle}
          className={!loading && vehicleNo ? "button-hover" : ""}
          disabled={loading || !vehicleNo}
        >
          {loading ? (
            <>
              <div style={{
                width: "20px",
                height: "20px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></div>
              Recording Entry...
            </>
          ) : (
            <>
              <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Save Entry
            </>
          )}
        </button>

        <div style={{
          marginTop: "2rem",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "center",
          gap: "2rem"
        }}>
          <div style={{display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#64748b"}}>
            <div style={{width: "6px", height: "6px", background: "#3b82f6", borderRadius: "50%"}}></div>
            Secure
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#64748b"}}>
            <div style={{width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%"}}></div>
            Real-time
          </div>
          <div style={{display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#64748b"}}>
            <div style={{width: "6px", height: "6px", background: "#8b5cf6", borderRadius: "50%"}}></div>
            Automated
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { createEntry, fetchVehicles } from "../services/api";
import { detectVehicleType } from "../services/vehicleUtils";

export default function EntryForm() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);

  // 📸 Capture and OCR
  const handleCapturePlate = async () => {
    if (!webcamRef.current) return;

    setCapturing(true);

    // Take snapshot from webcam
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      try {
        // Run OCR
        const { data: { text } } = await Tesseract.recognize(imageSrc, "eng");
        const detected = text.replace(/\s/g, "").toUpperCase(); // clean result
        if (detected) {
          setVehicleNo(detected);
          setType(detectVehicleType(detected));
        } else {
          alert("⚠️ Could not detect plate, try again.");
        }
      } catch (err) {
        console.error(err);
        alert("❌ OCR failed, check console.");
      }
    }

    setCapturing(false);
  };

  // Save entry
  const handleSubmit = async () => {
    if (!vehicleNo) {
      alert("⚠️ Please enter a vehicle number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchVehicles();
      const existing = res.data.find(
        (v) => v.vehicleNo === vehicleNo && !v.outTime
      );

      if (existing) {
        alert("🚫 This vehicle is already inside the factory!");
        return;
      }

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

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
      <h1>Vehicle Entry</h1>
      <p>Register vehicle entry to the facility</p>

      {/* Webcam view */}
      <div style={{ margin: "1rem auto", maxWidth: "400px" }}>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode: "environment" }}
          style={{
            width: "100%",
            borderRadius: "12px",
            border: "2px solid #3b82f6",
          }}
        />
      </div>

      <button
        onClick={handleCapturePlate}
        disabled={capturing}
        style={{
          background: "#3b82f6",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          border: "none",
          cursor: capturing ? "not-allowed" : "pointer",
          marginBottom: "1.5rem",
        }}
      >
        {capturing ? "Processing..." : "📸 Capture Plate"}
      </button>

      <div style={{ margin: "1.5rem auto", maxWidth: "400px" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Vehicle Number
        </label>
        <input
          type="text"
          placeholder="E.g. ABC-1234"
          value={vehicleNo}
          onChange={(e) => handleChange(e.target.value.toUpperCase())}
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#1a1a1a",
            color: "white",
          }}
          disabled={loading}
        />
      </div>

      {type && <p style={{ color: "#22c55e" }}>Detected Type: {type}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || !vehicleNo}
        style={{
          background: "#22c55e",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Entry"}
      </button>
    </div>
  );
}

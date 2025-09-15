import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { createEntry, fetchVehicles } from "../services/api";
import { detectVehicleType } from "../services/vehicleUtils";

export default function EntryForm() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const webcamRef = useRef(null);
  const lastDetectedRef = useRef("");

  // ✅ Handle detected plate
  const handleDetectedPlate = async (detected) => {
    if (!detected || detected.length < 4) return;
    if (detected === lastDetectedRef.current) return; // avoid duplicates
    lastDetectedRef.current = detected;

    setVehicleNo(detected);
    const detectedType = detectVehicleType(detected);
    setType(detectedType);

    // Auto-save if not a bike
    if (detectedType !== "Bike") {
      await handleSubmit(detected, true);
    }
  };

  // 📸 Capture once
  const handleCapturePlate = async () => {
    if (!webcamRef.current) return;
    setCapturing(true);

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const { data: { text } } = await Tesseract.recognize(imageSrc, "eng");
        const detected = text.replace(/\s/g, "").toUpperCase();
        await handleDetectedPlate(detected);
      } catch (err) {
        console.error(err);
        alert("❌ OCR failed");
      }
    }
    setCapturing(false);
  };

  // 📤 Upload photo
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng");
      const detected = text.replace(/\s/g, "").toUpperCase();
      await handleDetectedPlate(detected);
    } catch (err) {
      console.error(err);
      alert("❌ OCR failed from photo");
    } finally {
      setUploading(false);
    }
  };

  // 💾 Save entry
  const handleSubmit = async (plate = vehicleNo, auto = false) => {
    if (!plate) {
      alert("⚠️ Please enter a vehicle number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchVehicles();
      const existing = res.data.find(
        (v) => v.vehicleNo === plate && !v.outTime
      );

      if (existing) {
        alert("🚫 This vehicle is already inside the factory!");
        return;
      }

      await createEntry(plate);
      alert(auto ? `✅ Auto-saved ${plate}` : "✅ Vehicle entry recorded!");

      // Reset
      setVehicleNo("");
      setType("");
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to record entry");
    } finally {
      setLoading(false);
    }
  };

  // 🌀 Auto-scan every 6s when enabled
  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(async () => {
      if (!webcamRef.current) return;
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;
      try {
        const { data: { text } } = await Tesseract.recognize(imageSrc, "eng");
        const detected = text.replace(/\s/g, "").toUpperCase();
        await handleDetectedPlate(detected);
      } catch (err) {
        console.error("Auto scan OCR failed:", err);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [scanning]);

  const handleChange = (val) => {
    setVehicleNo(val);
    setType(detectVehicleType(val));
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "white" }}>
      <h1>🚗 Vehicle Entry</h1>
      <p>Register vehicle entry to the facility</p>

      {/* Webcam */}
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

      {/* Controls */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
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
          }}
        >
          {capturing ? "⏳ Processing..." : "📸 Capture Once"}
        </button>

        <button
          onClick={() => setScanning((s) => !s)}
          style={{
            background: scanning ? "#ef4444" : "#22c55e",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {scanning ? "⛔ Stop Auto-Scan" : "▶ Start Auto-Scan"}
        </button>
      </div>

      {/* Upload photo */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadPhoto}
          style={{ display: "none" }}
          id="uploadInput"
        />
        <label
          htmlFor="uploadInput"
          style={{
            background: "#f59e0b",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {uploading ? "⏳ Processing..." : "📤 Upload Photo"}
        </label>
      </div>

      {/* Show uploaded preview */}
      {preview && (
        <div style={{ marginBottom: "1rem" }}>
          <img
            src={preview}
            alt="Uploaded Preview"
            style={{
              maxWidth: "300px",
              borderRadius: "8px",
              border: "2px solid #444",
            }}
          />
        </div>
      )}

      {/* Vehicle number input */}
      <div style={{ margin: "1.5rem auto", maxWidth: "400px" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Vehicle Number
        </label>
        <input
          type="text"
          placeholder="Detected automatically..."
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

      {/* Manual save */}
      <button
        onClick={() => handleSubmit()}
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
        {loading ? "Saving..." : "💾 Save Entry"}
      </button>
    </div>
  );
}

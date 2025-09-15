import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "antd/dist/reset.css"; // Ant Design styles


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (reg) => console.log("✅ Service Worker registered:", reg),
      (err) => console.error("❌ Service Worker failed:", err)
    );
  });
}

import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {
    console.log("✅ App ready to work offline!");
  },
});



registerSW({
  onNeedRefresh() {
    console.log("🔄 New version available");
  },
  onOfflineReady() {
    console.log("✅ Ready to work offline");
  },
});

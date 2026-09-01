import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App.jsx"
import "./index.css"

// ❌ Context API Providers ki zaroorat khatam ho gayi hai:
// Pehle agar yahan <BucketListProvider> ya <ThemeProvider> laga hua tha, to unhe remove kar diya hai.
// Zustand stores components mein direct access hotay hain.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
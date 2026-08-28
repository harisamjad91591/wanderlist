import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { BucketListProvider } from "@/context/BucketListContext"
import { ThemeProvider } from "@/context/ThemeContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BucketListProvider>
        <App />
      </BucketListProvider>
    </ThemeProvider>
  </React.StrictMode>
)
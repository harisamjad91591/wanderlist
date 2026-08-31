import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import { BucketListProvider } from "@/context/BucketListContext"
import { ThemeProvider } from "@/context/ThemeContext"
import SearchPage from "@/pages/SearchPage"
import MyListPage from "@/pages/MyListPage"
import CountryDetailPage from "@/pages/CountryDetailPage"
import HistoryPage from "@/pages/HistoryPage"

function App() {
  return (
    <ThemeProvider>
      <BucketListProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/list" element={<MyListPage />} />
            <Route path="/country/:code" element={<CountryDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>

          {/* Reusable, app-wide toast host — pages call toast() to trigger it */}
          <ToastContainer
            position="bottom-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            theme="light"
          />
        </Router>
      </BucketListProvider>
    </ThemeProvider>
  )
}

export default App
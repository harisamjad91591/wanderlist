import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import CountryDetailPage from "@/pages/CountryDetailPage"
import HistoryPage from "@/pages/HistoryPage"
import MyListPage from "@/pages/MyListPage"
import SearchPage from "@/pages/SearchPage"

// ❌ REMOVED: BucketListProvider, ThemeProvider imports & wrappers

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/country/:code" element={<CountryDetailPage />} />
        <Route path="/my-list" element={<MyListPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </>
  )
}

export default App
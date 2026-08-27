import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import { BucketListProvider } from "@/context/BucketListContext"
import SearchPage from "@/pages/SearchPage"
import MyListPage from "@/pages/MyListPage"
import CountryDetailPage from "@/pages/CountryDetailPage"

function App() {
  return (
    <BucketListProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/list" element={<MyListPage />} />
          <Route path="/country/:code" element={<CountryDetailPage />} />
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
  )
}

export default App

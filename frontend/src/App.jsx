import { Routes, Route } from "react-router-dom";
import BookingPage from "./pages/client/BookingPage";
import DashboardPage from "./pages/admin/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/admin" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import BookingPage from "./pages/client/BookingPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import LoginPage from "./pages/admin/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>


  );
}

export default App;
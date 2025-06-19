import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./pages/Home/ProtectedRoute";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import OrderTracking from "./pages/Orders/OrderTracking";
import Feedback from "./pages/Feedback";
import MenuManagement from "./pages/Admin/MenuManagement";
import OrdersManagement from "./pages/Admin/OrdersManagement";
import FeedbackManagement from "./pages/Admin/FeedbackManagement";
import Login from "./pages/Login";

// ...other imports

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* User routes */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders/track" element={<OrderTracking />} />
        <Route path="/feedback" element={<Feedback />} />
      </Route>

      {/* Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/menu" element={<MenuManagement />} />
        <Route path="/admin/orders" element={<OrdersManagement />} />
        <Route path="/admin/feedback" element={<FeedbackManagement />} />
        {/* <Route path="/admin/home" element={<HomeManagement />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
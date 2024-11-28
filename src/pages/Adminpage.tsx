import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "../components/adminpage_components/AdminDashboard";
import AdminOrders from "../components/adminpage_components/AdminOrders";
import AdminProducts from "../components/adminpage_components/AdminProducts";
import AdminUsers from "../components/adminpage_components/AdminUsers";

const AdminPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/users" element={<AdminUsers />} />
    </Routes>
  );
};

export default AdminPage;

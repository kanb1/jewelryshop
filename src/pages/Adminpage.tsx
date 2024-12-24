import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../components/adminpage_components/AdminDashboard";
import AdminOrders from "../components/adminpage_components/AdminOrders";
import AdminProducts from "../components/adminpage_components/AdminProducts";
import ProtectedRoute from "../components/shared/ProtectedRoute"; // Import the ProtectedRoute component
import { Box } from "@chakra-ui/react";


const AdminPage: React.FC = () => {
  return (
    <Box
  minH="100vh" 
>
    <Routes>
      {/* the role prop is passed to the protectedroute compoennt. The admindashboard will only render if it's a valid JWT (authenticated user) and if the user's role matches the required role which is admin in this case */}
      <Route path="/" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      <Route path="/orders" element={
          <ProtectedRoute role="admin">
            <AdminOrders />
          </ProtectedRoute>
        } />
      <Route path="/products" element={
          <ProtectedRoute role="admin">
            <AdminProducts />
          </ProtectedRoute>
        } />
    </Routes>
    </Box>
  );
};

export default AdminPage;

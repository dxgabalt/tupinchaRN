import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import UserProfilePage from "./pages/UserProfilePage";
import ServiceManagementPage from "./pages/ServiceManagementPage";
import CommissionPage from "./pages/CommissionPage";
import PaymentManagementPage from "./pages/PaymentManagementPage";
import SupportManagementPage from "./pages/SupportManagementPage";
import SettingsPage from "./pages/SettingsPage";
import PlanesManagmentPage from "./pages/PlanesManagmentPage";
import ServicesManagementPage from "./pages/ServicesmanagemenPage";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/user-profile/:id" element={<UserProfilePage />} />
        <Route path="/services-managment" element={<ServicesManagementPage />} />
        <Route path="/services" element={<ServiceManagementPage />} />
        <Route path="/planes" element={<PlanesManagmentPage />} />
        <Route path="/commissions" element={<CommissionPage />} />
        <Route path="/payments" element={<PaymentManagementPage />} />
        <Route path="/support" element={<SupportManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;

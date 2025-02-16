import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import ServiceManagementPage from "./pages/ServiceManagementPage";
import CommissionPage from "./pages/CommissionPage";
import PaymentManagementPage from "./pages/PaymentManagementPage";
import SupportManagementPage from "./pages/SupportManagementPage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/services" element={<ServiceManagementPage />} />
        <Route path="/commissions" element={<CommissionPage />} />
        <Route path="/payments" element={<PaymentManagementPage />} />
        <Route path="/support" element={<SupportManagementPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TenantDashboard from "../components/TenantDashboard";
import LandlordDashboard from "../components/LandlordDashboard";
import TenantNotifications from "../components/TenantNotifications";
import LandlordNotifications from "../components/LandlordNotifications";
import TenantRequests from "../components/TenantRequests";
import LandlordRequests from "../components/LandlordRequests";
import TenantSettings from "../components/TenantSettings";
import LandlordSettings from "../components/LandlordSettings";
import TenantProfile from "../components/TenantProfile";
import LandlordProfile from "../components/LandlordProfile";

const DashboardPage = () => {
  const userType = localStorage.getItem("userType") || "tenant"; // Default to tenant
  const [selectedSection, setSelectedSection] = useState("dashboard");

  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return userType === "tenant" ? <TenantDashboard /> : <LandlordDashboard />;
      case "notifications":
        return userType === "tenant" ? <TenantNotifications /> : <LandlordNotifications />;
      case "requests":
        return userType === "tenant" ? <TenantRequests /> : <LandlordRequests />;
      case "settings":
        return userType === "tenant" ? <TenantSettings /> : <LandlordSettings />;
      case "profile":
        return userType === "tenant" ? <TenantProfile /> : <LandlordProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        userType={userType}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderSection()}
      </div>
    </div>
  );
};

export default DashboardPage;
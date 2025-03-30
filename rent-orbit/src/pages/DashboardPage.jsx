import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Home, Bell, Settings, LogOut, User, Layers, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
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
import LandLordAddRoom from "../components/LandLordAddRoom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [selectedSection, setSelectedSection] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserType(decoded.userType);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

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
      case "addRoom":
        return <div><LandLordAddRoom/></div>;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(userType === "tenant" ? "/tenant" : "/landlord");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType={userType} selectedSection={selectedSection} setSelectedSection={setSelectedSection} handleLogout={handleLogout} />
      <div className="flex-1 p-8">{renderSection()}</div>
    </div>
  );
};

const Sidebar = ({ userType, selectedSection, setSelectedSection, handleLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const iconSize = 24;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={iconSize} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={iconSize} /> },
    { id: "requests", label: "Requests", icon: <Layers size={iconSize} /> },
    ...(userType === "landlord" ? [{ id: "addRoom", label: "Add Room", icon: <PlusCircle size={iconSize} /> }] : []),
    { id: "settings", label: "Settings", icon: <Settings size={iconSize} /> },
    { id: "profile", label: "Profile", icon: <User size={iconSize} /> },
  ];

  return (
    <div className={`relative h-full ${collapsed ? "w-20" : "w-64"} bg-white shadow-lg p-6 transition-all duration-300 h-screen`}>
      <button
        className="absolute top-4 right-[-12px] bg-purple-700 text-white rounded-full p-1 shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <h2 className="text-xl font-bold mb-5 h-10 text-center">
        {collapsed ? (userType === "tenant" ? "TD" : "LD") : (userType === "tenant" ? "Tenant Dashboard" : "Landlord Dashboard")}
      </h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-4 cursor-pointer p-2 rounded-lg transition-colors duration-300 ${
              selectedSection === item.id ? "bg-purple-700 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedSection(item.id)}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-4 cursor-pointer p-2 rounded-lg transition-colors duration-300 text-white hover:bg-gray-500 bg-slate-800`}
          onClick={handleLogout}
        >
          <LogOut size={iconSize} />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
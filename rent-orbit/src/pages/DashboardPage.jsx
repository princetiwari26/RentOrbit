import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Bell, Settings, LogOut, User, Layers, ChevronLeft, ChevronRight, PlusCircle, DoorClosed, Menu, X } from "lucide-react";
import TenantDashboard from "./Tenant/TenantDashboard";
import LandlordDashboard from "./Landlord/LandlordDashboard";
import TenantNotifications from "./Tenant/TenantNotifications";
import LandlordNotifications from "./Landlord/LandlordNotifications";
import TenantRequests from "./Tenant/TenantRequests";
import LandlordRequests from "./Landlord/LandlordRequests";
import TenantSettings from "./Tenant/TenantSettings";
import LandlordSettings from "./Landlord/LandlordSettings";
import TenantProfile from "./Tenant/TenantProfile";
import LandlordProfile from "./Landlord/LandlordProfile";
import LandLordAddRoom from "./Landlord/LandLordAddRoom";
import LandlordRoomsList from "./Landlord/LandlordRoomsList";
import VisitConfirmationPopup from "./Tenant/VisitConfirmationPopup";
import Sidebar from "../components/Sidebar";

const DashboardPage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserType(decoded.userType);
      fetchNotificationCount(decoded.userType);
      // Set a default request count (will be replaced with API call later)
      setRequestCount(decoded.userType === "tenant" ? 3 : 5);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate, token]);

  const fetchNotificationCount = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/notifications/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const unreadCount = response.data.filter(
        (notification) => !notification.read
      ).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return userType === "tenant" ? (
          <TenantDashboard />
        ) : (
          <LandlordDashboard />
        );
      case "notifications":
        return userType === "tenant" ? (
          <TenantNotifications />
        ) : (
          <LandlordNotifications />
        );
      case "requests":
        return userType === "tenant" ? (
          <TenantRequests />
        ) : (
          <LandlordRequests />
        );
      case "settings":
        return userType === "tenant" ? (
          <TenantSettings />
        ) : (
          <LandlordSettings />
        );
      case "profile":
        return userType === "tenant" ? (
          <TenantProfile />
        ) : (
          <LandlordProfile />
        );
      case "addRoom":
        return (
          <div>
            <LandLordAddRoom />
          </div>
        );
      case "myRoom":
        return (
          <div>
            <LandlordRoomsList />
          </div>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(userType === "tenant" ? "/tenant" : "/landlord");
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const themeColors = {
    tenant: {
      primary: "bg-orange-600",
      hover: "hover:bg-orange-700",
      text: "text-orange-600",
      border: "border-orange-600",
      light: "bg-orange-100",
    },
    landlord: {
      primary: "bg-purple-600",
      hover: "hover:bg-purple-700",
      text: "text-purple-600",
      border: "border-purple-600",
      light: "bg-purple-100",
    },
  };

  const currentTheme = userType ? themeColors[userType] : themeColors.tenant;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed h-full z-30">
        <Sidebar
          userType={userType}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          handleLogout={handleLogout}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          notificationCount={notificationCount}
          requestCount={requestCount}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 left-0 w-64 z-50 ${currentTheme.primary} shadow-lg md:hidden`}
          >
            <Sidebar
              userType={userType}
              selectedSection={selectedSection}
              setSelectedSection={(section) => {
                setSelectedSection(section);
                setMobileSidebarOpen(false);
              }}
              handleLogout={handleLogout}
              collapsed={false}
              setCollapsed={setSidebarCollapsed}
              notificationCount={notificationCount}
              requestCount={requestCount}
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 px-4 overflow-y-auto h-screen transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between py-4">
          <button
            onClick={toggleMobileSidebar}
            className={`p-2 rounded-lg ${currentTheme.text}`}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold capitalize">
            {selectedSection.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </header>

        {/* Content */}
        <main className="py-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${currentTheme.border}`}></div>
            </div>
          ) : (
            renderSection()
          )}
          {userType === "tenant" && (
            <VisitConfirmationPopup token={token} userType={userType} />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
import React, { useState } from 'react';
import { 
  Home, Bell, Settings, LogOut, User, Layers, 
  ChevronLeft, ChevronRight, PlusCircle, DoorClosed,
  ChevronsLeft, ChevronsRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({
  userType,
  selectedSection,
  setSelectedSection,
  handleLogout,
  collapsed,
  setCollapsed,
  notificationCount = 0,
  requestCount = 0,
  isMobile = false
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const iconSize = 20;
  
  const themeColors = {
    tenant: {
      primary: "text-orange-600",
      bg: "bg-orange-600",
      light: "bg-orange-100",
      highlight: "bg-orange-500/10",
      active: "bg-orange-600/20",
      border: "border-orange-600"
    },
    landlord: {
      primary: "text-purple-600",
      bg: "bg-purple-600",
      light: "bg-purple-100",
      highlight: "bg-purple-500/10",
      active: "bg-purple-600/20",
      border: "border-purple-600"
    },
  };

  const currentTheme = userType ? themeColors[userType] : themeColors.tenant;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={iconSize} /> },
    { 
      id: "notifications", 
      label: "Notifications", 
      icon: <Bell size={iconSize} />,
      count: notificationCount
    },
    { 
      id: "requests", 
      label: "Requests", 
      icon: <Layers size={iconSize} />,
      count: requestCount
    },
    ...(userType === "landlord" ? [{ 
      id: "addRoom", 
      label: "Add Room", 
      icon: <PlusCircle size={iconSize} /> 
    }] : []),
    ...(userType === "landlord" ? [{ 
      id: "myRoom", 
      label: "My Rooms", 
      icon: <DoorClosed size={iconSize} /> 
    }] : []),
    { id: "settings", label: "Settings", icon: <Settings size={iconSize} /> },
    { id: "profile", label: "Profile", icon: <User size={iconSize} /> },
  ];

  const toggleButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const menuItemVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
  };

  return (
    <div
      className={`h-full ${collapsed ? "w-20" : "w-64"} bg-white shadow-xl transition-all duration-300 flex flex-col border-r border-gray-200`}
      style={{ height: '100vh' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Collapse Button with Animation */}
      <div className="absolute top-4 right-[-12px] z-10">
        <motion.button
          variants={toggleButtonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={isHovering && !collapsed ? "pulse" : "initial"}
          className={`p-2 rounded-full shadow-lg ${currentTheme.bg} text-white`}
          onClick={() => setCollapsed(!collapsed)}
        >
          <AnimatePresence mode="wait">
            {collapsed ? (
              <motion.div
                key="right"
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: 180 }}
              >
                <ChevronsRight size={18} />
              </motion.div>
            ) : (
              <motion.div
                key="left"
                initial={{ rotate: 180 }}
                animate={{ rotate: 0 }}
                exit={{ rotate: -180 }}
              >
                <ChevronsLeft size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Header */}
      <div className="h-16 flex items-center justify-center p-4 border-b border-gray-200">
        {collapsed ? (
          <motion.div 
            className={`text-2xl font-bold ${currentTheme.primary}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {userType === "tenant" ? "T" : "L"}
          </motion.div>
        ) : (
          <motion.h2 
            className={`text-xl font-bold ${currentTheme.primary}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {userType === "tenant" ? "Tenant Portal" : "Landlord Portal"}
          </motion.h2>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <motion.li
              key={item.id}
              variants={menuItemVariants}
              whileHover="hover"
              whileTap="tap"
              className={`relative ${collapsed ? "flex justify-center" : "flex items-center gap-3"}`}
            >
              <button
                onClick={() => setSelectedSection(item.id)}
                className={`w-full p-3 rounded-lg transition-colors duration-200 flex items-center ${
                  selectedSection === item.id 
                    ? `${currentTheme.active} ${currentTheme.primary} font-medium`
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {(item.count > 0 && !collapsed) && (
                    <span className={`absolute -top-2 -right-2 ${currentTheme.light} ${currentTheme.primary} text-xs font-bold px-1.5 py-0.5 rounded-full`}>
                      {item.count}
                    </span>
                  )}
                </div>
                
                {!collapsed && (
                  <>
                    <span className="ml-2">{item.label}</span>
                    {(item.count > 0) && (
                      <span className={`ml-auto ${currentTheme.light} ${currentTheme.primary} text-xs font-bold px-2 py-0.5 rounded-full`}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
              
              {/* Collapsed badge */}
              {(item.count > 0 && collapsed) && (
                <span className={`absolute top-1 right-1 ${currentTheme.light} ${currentTheme.primary} text-xs font-bold px-1 py-0.5 rounded-full`}>
                  {item.count}
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`flex items-center w-full ${collapsed ? "justify-center" : "justify-start gap-3"} p-3 rounded-lg text-gray-300 hover:bg-gray-100 transition-colors duration-200`}
        >
          <LogOut size={iconSize} className={currentTheme.primary} />
          {!collapsed && (
            <span className={currentTheme.primary}>Logout</span>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
// import React, { useState } from "react";
// import { Home, Bell, Settings, LogOut, User, Layers } from "lucide-react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const Sidebar = ({ userType, selectedSection, setSelectedSection }) => {
//   const [collapsed, setCollapsed] = useState(false);

//   const menuItems = [
//     { id: "dashboard", label: "Dashboard", icon: <Home /> },
//     { id: "notifications", label: "Notifications", icon: <Bell /> },
//     { id: "requests", label: "Requests", icon: <Layers /> },
//     { id: "settings", label: "Settings", icon: <Settings /> },
//     { id: "logout", label: "Logout", icon: <LogOut /> },
//   ];

//   return (
//     <div className={`relative h-full ${collapsed ? "w-20" : "w-64"} bg-white shadow-lg p-6 transition-all duration-300 h-screen`}>
//       <button
//         className="absolute top-4 right-[-12px] bg-purple-700 text-white rounded-full p-1 shadow-lg"
//         onClick={() => setCollapsed(!collapsed)}
//       >
//         {collapsed ? <ChevronRight /> : <ChevronLeft />}
//       </button>
//       <h2 className="text-xl font-bold mb-5 h-10">
//         {collapsed
//           ? userType === "tenant" ? "TD" : "LD"
//           : userType === "tenant" ? "Tenant Dashboard" : "Landlord Dashboard"}
//       </h2>
//       <ul className="space-y-4">
//         {menuItems.map((item) => (
//           <li
//             key={item.id}
//             className={`flex items-center gap-4 cursor-pointer p-2 rounded-lg transition-colors duration-300 ${
//               selectedSection === item.id
//                 ? "bg-purple-700 text-white"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//             onClick={() => setSelectedSection(item.id)}
//           >
//             <div className="">{item.icon}</div>
//             {!collapsed && <span>{item.label}</span>}
//           </li>
//         ))}
//       </ul>
//       <div className="mt-10">
//         <div
//           className={`flex items-center gap-4 cursor-pointer p-2 rounded-lg transition-colors duration-300 ${
//             selectedSection === "profile"
//               ? "bg-purple-700 text-white"
//               : "text-white hover:bg-gray-500 bg-slate-800"
//           }`}
//           onClick={() => setSelectedSection("profile")}
//         >
//           <div><User /></div>
//           {!collapsed && <span>Profile</span>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;




import React, { useState } from "react";
import { Home, Bell, Settings, LogOut, User, Layers, ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ userType, selectedSection, setSelectedSection }) => {
  const [collapsed, setCollapsed] = useState(false);

  const iconSize = 24;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={iconSize} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={iconSize} /> },
    { id: "requests", label: "Requests", icon: <Layers size={iconSize} /> },
    { id: "settings", label: "Settings", icon: <Settings size={iconSize} /> },
    { id: "logout", label: "Logout", icon: <LogOut size={iconSize} /> },
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
        {collapsed
          ? userType === "tenant" ? "TD" : "LD"
          : userType === "tenant" ? "Tenant Dashboard" : "Landlord Dashboard"}
      </h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-4 cursor-pointer p-2 rounded-lg transition-colors duration-300 ${
              selectedSection === item.id
                ? "bg-purple-700 text-white"
                : "text-gray-700 hover:bg-gray-100"
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
          className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} gap-4 cursor-pointer p-2 rounded-lg transition-colors duration-300 ${
            selectedSection === "profile"
              ? "bg-purple-700 text-white"
              : "text-white hover:bg-gray-500 bg-slate-800"
          }`}
          onClick={() => setSelectedSection("profile")}
        >
          <User size={iconSize} />
          {!collapsed && <span>Profile</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
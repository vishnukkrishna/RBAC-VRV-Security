import React, { useState } from "react";
import { FaUsers, FaKey } from "react-icons/fa";
import { MdSecurity, MdDashboard } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { motion } from "framer-motion";

const menuItems = [
  { label: "Dashboard", icon: <MdDashboard /> },
  { label: "Users", icon: <FaUsers /> },
  { label: "Roles", icon: <MdSecurity /> },
  { label: "Permissions", icon: <FaKey /> },
];

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleClick = (index) => {
    setActiveButton(index);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      <motion.aside
        className="fixed top-0 left-0 h-full bg-gray-900 text-white flex flex-col items-start sm:items-center sm:w-64 w-60 border-r border-gray-700 shadow-lg rounded-r-lg"
        initial={{ opacity: 0, x: -200, scale: 0.95 }}
        animate={{
          opacity: isSidebarOpen ? 1 : 0,
          x: isSidebarOpen ? 0 : -200,
          scale: isSidebarOpen ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 30,
        }}
      >
        <div className="w-full flex justify-center py-4 mb-8 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white tracking-wide">RBAC</h1>
        </div>

        <ul className="flex flex-col gap-4 w-full px-4">
          {menuItems.map((menu, index) => (
            <li key={index} className="w-full">
              <button
                type="button"
                className={`flex items-center gap-4 w-full h-12 px-4 rounded-md text-left text-white/90 hover:bg-gray-800 transition-all ${
                  activeButton === index ? "bg-gray-700" : ""
                }`}
                onClick={() => handleClick(index)}
              >
                <span className="text-2xl">{menu.icon}</span>
                <span className="flex-1 text-lg">{menu.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.aside>

      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 sm:hidden z-50 p-2 rounded-full bg-gray-900 text-white"
      >
        {isSidebarOpen ? (
          <AiOutlineCloseCircle size={24} />
        ) : (
          <CgMenuGridO size={24} />
        )}
      </button>
    </div>
  );
};

export default Sidebar;

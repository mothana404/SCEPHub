import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineMail,
  HiOutlineBriefcase,
  HiOutlineCheck,
  HiOutlineCollection,
  HiOutlineCube,
  HiOutlineTemplate,
  HiOutlineUsers,
  HiOutlineX,
} from "react-icons/hi";
import PropTypes from "prop-types";

function Sidebar({ isDrawerOpen, closeDrawer }) {
  const location = useLocation();
  const [role, setRole] = useState(() => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    return authData?.role;
  });

  // Animation variants for small screens
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Function to get dynamic classes for NavLinks
  const getNavLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center p-2 text-base transition-all duration-200 rounded-lg ${
      isActive
        ? "bg-[#041643] text-white font-medium shadow-lg"
        : "text-gray-700 hover:bg-[#041643] hover:text-white"
    }`;
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const authData = JSON.parse(localStorage.getItem("auth"));
      console.log(authData);
      setRole(authData?.role);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    // Replace the motion.aside with this:
    <aside
      className={` font-sans fixed mt-7 top-0 left-0 z-40 w-64 h-screen pt-14 bg-white shadow-xl transition-transform 
                ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0`}
      aria-label="Sidebar"
    >
      {/* Close Button for Mobile */}
      <button
        onClick={closeDrawer}
        className="md:hidden mt-10 absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:bg-gray-100"
      >
        <HiOutlineX className="w-6 h-6" />
      </button>

      {/* Sidebar Content Container */}
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Brand/Logo Section */}
        <div className="mb-6 px-4">
          <h2 className="text-xl font-bold text-[#041643]">Dashboard</h2>
          <p className="text-sm text-gray-500">
            {role === "1" && "Student Portal"}
            {role === "2" && "Instructor Portal"}
            {role === "3" && "Admin Portal"}
          </p>
        </div>

        {/* Navigation Lists */}
        <nav className="space-y-4">
          {/* Common Navigation */}
          <div className="pb-4">
            <NavLink to="/dashboard" className={getNavLinkClass("/dashboard")}>
              <HiOutlineViewGrid className="w-6 h-6 mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* Role-based Navigation Groups */}
          {role === "1" && (
            <div className="space-y-4">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student Access
                </h3>
              </div>

              <NavLink
                to="/enrolled-projects"
                className={getNavLinkClass("/enrolled-projects")}
              >
                <HiOutlineCheck className="w-6 h-6 mr-3" />
                <span>Joined Projects</span>
              </NavLink>

              <NavLink
                to="/student/available-projects"
                className={getNavLinkClass("/student/available-projects")}
              >
                <HiOutlineBriefcase className="w-6 h-6 mr-3" />
                <span>Available Projects</span>
              </NavLink>

              <NavLink
                to="/enrolled-courses"
                className={getNavLinkClass("/enrolled-courses")}
              >
                <HiOutlineBookOpen className="w-6 h-6 mr-3" />
                <span>Enrolled Courses</span>
              </NavLink>

              <NavLink
                to="/available-courses"
                className={getNavLinkClass("/available-courses")}
              >
                <HiOutlineAcademicCap className="w-6 h-6 mr-3" />
                <span>Available Courses</span>
              </NavLink>

              <NavLink
                to="/private/messages"
                className={getNavLinkClass("/private/messages")}
              >
                <HiOutlineMail className="w-6 h-6 mr-3" />
                <span>Messages</span>
                {/* Optional: Add unread message count badge */}
                {/* <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    2
                                </span> */}
              </NavLink>
            </div>
          )}

          {role === "2" && (
            <div className="space-y-4">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Instructor Portal
                </h3>
              </div>

              <NavLink
                to="/instructor/courses"
                className={getNavLinkClass("/instructor/courses")}
              >
                <HiOutlineBookOpen className="w-6 h-6 mr-3" />
                <span>My Courses</span>
              </NavLink>

              <NavLink
                to="/instructor/projects"
                className={getNavLinkClass("/instructor/projects")}
              >
                <HiOutlineCube className="w-6 h-6 mr-3" />
                <span>My Projects</span>
              </NavLink>

              <NavLink
                to="/instructor/ProjectManagement"
                className={getNavLinkClass("/instructor/ProjectManagement")}
              >
                <HiOutlineTemplate className="w-6 h-6 mr-3" />
                <span>Projects Workspace</span>
              </NavLink>

              <NavLink
                to="/private/messages"
                className={getNavLinkClass("/private/messages")}
              >
                <HiOutlineMail className="w-6 h-6 mr-3" />
                <span>Messages</span>
                {/* <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    3
                                </span> */}
              </NavLink>
            </div>
          )}

          {role === "3" && (
            <div className="space-y-4">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>

              {/* Users Management Group */}
              <div className="space-y-2">
                <div className="px-3">
                  <p className="text-xs font-medium text-gray-400">
                    Users Management
                  </p>
                </div>

                <NavLink
                  to="/admin/instructors"
                  className={getNavLinkClass("/admin/instructors")}
                >
                  <HiOutlineAcademicCap className="w-6 h-6 mr-3" />
                  <span>Instructors</span>
                </NavLink>

                <NavLink
                  to="/admin/students"
                  className={getNavLinkClass("/admin/students")}
                >
                  <HiOutlineUserGroup className="w-6 h-6 mr-3" />
                  <span>Students</span>
                </NavLink>

                <NavLink
                  to="/admin/admins"
                  className={getNavLinkClass("/admin/admins")}
                >
                  <HiOutlineUsers className="w-6 h-6 mr-3" />
                  <span>Admins</span>
                </NavLink>
              </div>

              {/* Content Management Group */}
              <div className="space-y-2">
                <div className="px-3">
                  <p className="text-xs font-medium text-gray-400">
                    Content Management
                  </p>
                </div>

                <NavLink
                  to="/admin/projects"
                  className={getNavLinkClass("/admin/projects")}
                >
                  <HiOutlineCube className="w-6 h-6 mr-3" />
                  <span>Projects</span>
                </NavLink>

                <NavLink
                  to="/admin/courses"
                  className={getNavLinkClass("/admin/courses")}
                >
                  <HiOutlineBookOpen className="w-6 h-6 mr-3" />
                  <span>Courses</span>
                </NavLink>

                <NavLink
                  to="/admin/categories"
                  className={getNavLinkClass("/admin/categories")}
                >
                  <HiOutlineCollection className="w-6 h-6 mr-3" />
                  <span>Categories</span>
                </NavLink>
                <NavLink
                  to="/private/messages"
                  className={getNavLinkClass("/private/messages")}
                >
                  <HiOutlineMail className="w-6 h-6 mr-3" />
                  <span>Messages</span>
                  {/* Optional: Add unread message count badge */}
                  {/* <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    2
                                </span> */}
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200 md:static md:bg-transparent md:border-none">
          <div className="flex flex-col space-y-4">
            {/* User Status */}
            <div className="flex items-center px-3 py-2 rounded-lg bg-white shadow-sm md:bg-transparent md:shadow-none">
              <div className="flex-1 min-w-0 mt-10">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {role === "1" && "Student Account"}
                  {role === "2" && "Instructor Account"}
                  {role === "3" && "Admin Account"}
                </p>
                <div className="flex-shrink-0 flex flex-row mt-2">
                  <div className="w-2 h-2 mr-2 bg-green-500 rounded-full mt-1"></div>
                  <p className="text-xs text-gray-500 truncate">
                    Active Session
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2"></div>

            {/* Version Info */}
            <div className="text-xs text-center text-gray-500">
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// PropTypes
Sidebar.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

export default Sidebar;

// Add these styles to your CSS
const styles = `
  /* Custom Scrollbar */
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 2px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  /* Active NavLink Animation */
  .active-nav-link {
    position: relative;
  }

  .active-nav-link::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background-color: #041643;
    border-radius: 2px;
  }

  /* Hover Effects */
  .nav-link-hover {
    transition: all 0.2s ease;
  }

  .nav-link-hover:hover {
    transform: translateX(4px);
  }
`;

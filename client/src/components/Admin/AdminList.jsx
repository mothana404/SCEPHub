import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBriefcase, 
  FiCalendar, 
  FiEye, 
  FiTrash2, 
  FiPlus, 
  FiX, 
  FiSearch 
} from 'react-icons/fi';
import PropTypes from 'prop-types';

function AdminList() {
  // States
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [adminToToggle, setAdminToToggle] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    user_name: '',
    user_email: '',
    phone_number: '',
    department: '',
    password: '',
  });

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  // Utility function to format dates
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Modal control functions
  const openViewModal = (admin) => {
    setCurrentAdmin(admin);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setCurrentAdmin(null);
    setIsViewModalOpen(false);
  };

  const openToggleModal = (admin) => {
    setAdminToToggle(admin);
    setIsToggleModalOpen(true);
  };

  const closeToggleModal = () => {
    setAdminToToggle(null);
    setIsToggleModalOpen(false);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewAdmin({
      user_name: '',
      user_email: '',
      phone_number: '',
      department: '',
      password: '',
    });
  };

  // Search handler with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchTerm = search.toLowerCase();
      const filtered = admins.filter(admin =>
        admin.user.user_name.toLowerCase().includes(searchTerm) ||
        admin.user.user_email.toLowerCase().includes(searchTerm) ||
        (admin.department && admin.department.toLowerCase().includes(searchTerm))
      );
      setFilteredAdmins(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [search, admins]);

  // API Functions and Handlers
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/user/users/3', {
        withCredentials: true,
      });
      setAdmins(response.data);
      setFilteredAdmins(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch administrators');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async () => {
    if (!adminToToggle) return;

    const action = adminToToggle.user.is_deleted ? 'restore' : 'delete';
    setActionLoading(true);

    try {
      await axios.put(`http://localhost:8000/user/deleteAccount/${adminToToggle.user.user_id}`, {}, {
        withCredentials: true
      });

      toast.success(`Administrator ${action}d successfully`);

      // Update the local state
      const updatedAdmins = admins.map(admin => {
        if (admin.user.user_id === adminToToggle.user.user_id) {
          return {
            ...admin,
            user: {
              ...admin.user,
              is_deleted: !admin.user.is_deleted
            }
          };
        }
        return admin;
      });

      setAdmins(updatedAdmins);

      // Also update the filteredAdmins
      const updatedFiltered = filteredAdmins.map(admin => {
        if (admin.user.user_id === adminToToggle.user.user_id) {
          return {
            ...admin,
            user: {
              ...admin.user,
              is_deleted: !admin.user.is_deleted
            }
          };
        }
        return admin;
      });

      setFilteredAdmins(updatedFiltered);

      // Close the modal
      setIsToggleModalOpen(false);
      setAdminToToggle(null);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} administrator`);
    } finally {
      setActionLoading(false);
    }
  };

  // Create admin handler
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const { user_name, user_email, phone_number, department, password } = newAdmin;

    // Validation
    if (!user_name.trim() || !user_email.trim() || !phone_number.trim() || 
        !department.trim() || !password.trim()) {
      toast.error('All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/user/admin/createAccount',
        {
          ...newAdmin,
          role: 2,
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success('Administrator created successfully!');
        closeCreateModal();
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create administrator');
    }
  };

  // Input change handler for create form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Effect to fetch admins on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-end items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search administrators..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Create Button */}
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>New Admin</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Administrator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500 dark:text-gray-400">Loading administrators...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No administrators found
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredAdmins.map((admin, index) => (
                    <motion.tr
                      key={admin.user_id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={admin.user.profile_picture || "https://via.placeholder.com/40"}
                              alt={admin.user.user_name}
                              loading="lazy"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {admin.user.user_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {admin.user_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {admin.user.user_email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {admin.user.phone_number || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {admin.department || 'Not assigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openViewModal(admin)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {admin.user.is_deleted ? (
                            <button
                              onClick={() => openToggleModal(admin)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                              title="Restore Administrator"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openToggleModal(admin)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title="Delete Administrator"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Admin Modal */}
      <AnimatePresence>
        {isViewModalOpen && currentAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-admin-title"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <h3 id="view-admin-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                    Administrator Details
                  </h3>
                  <button
                    onClick={closeViewModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiUser className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-base text-gray-900 dark:text-white">{currentAdmin.user.user_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiMail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-base text-gray-900 dark:text-white">{currentAdmin.user.user_email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiPhone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {currentAdmin.user.phone_number || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiBriefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {currentAdmin.department || 'Not assigned'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiCalendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined Date</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {formatDate(currentAdmin.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={closeViewModal}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete/Restore Confirmation Modal */}
      <AnimatePresence>
        {isToggleModalOpen && adminToToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="toggle-admin-title"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  {adminToToggle.user.is_deleted ? (
                    <FiX className="w-12 h-12 text-green-600" />
                  ) : (
                    <FiTrash2 className="w-12 h-12 text-red-600" />
                  )}
                </div>
                <h3 id="toggle-admin-title" className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                  {adminToToggle.user.is_deleted ? 'Restore Administrator' : 'Delete Administrator'}
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Are you sure you want to {adminToToggle.user.is_deleted ? 'restore' : 'delete'}{' '}
                  <span className="font-medium">{adminToToggle.user.user_name}</span>? 
                  This action {adminToToggle.user.is_deleted ? 'will restore the administrator\'s account' : 'cannot be undone'}.
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={closeToggleModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleAdmin}
                    disabled={actionLoading}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      adminToToggle.user.is_deleted 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {actionLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{adminToToggle.user.is_deleted ? 'Restoring...' : 'Deleting...'}</span>
                      </div>
                    ) : (
                      adminToToggle.user.is_deleted ? 'Restore' : 'Delete'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Admin Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-admin-title"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 id="create-admin-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Administrator
                  </h3>
                  <button
                    onClick={closeCreateModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateAdmin}>
                <div className="px-6 py-4 space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="user_name"
                        value={newAdmin.user_name}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="user_email"
                        value={newAdmin.user_email}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone_number"
                        value={newAdmin.phone_number}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Department Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <div className="relative">
                      <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="department"
                        value={newAdmin.department}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter department"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newAdmin.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create Administrator
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// PropTypes for AdminList (optional but recommended)
AdminList.propTypes = {
  // Define props if any. Currently, this component does not receive props.
};

export default AdminList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBook, 
  FiAward, 
  FiEye, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiLink 
} from 'react-icons/fi';
import PropTypes from 'prop-types';

function InstructorsList() {
  // States
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState(null);
  const [instructorToToggle, setInstructorToToggle] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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
  const openViewModal = (instructor) => {
    setCurrentInstructor(instructor);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setCurrentInstructor(null);
    setIsViewModalOpen(false);
  };

  const openToggleModal = (instructor) => {
    setInstructorToToggle(instructor);
    setIsToggleModalOpen(true);
  };

  const closeToggleModal = () => {
    setInstructorToToggle(null);
    setIsToggleModalOpen(false);
  };

  // Search handler with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const searchTerm = search.toLowerCase();
      const filtered = instructors.filter(instructor =>
        instructor.user.user_name.toLowerCase().includes(searchTerm) ||
        instructor.user.user_email.toLowerCase().includes(searchTerm) ||
        (instructor.major && instructor.major.toLowerCase().includes(searchTerm))
      );
      setFilteredInstructors(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [search, instructors]);

  // API Functions and Handlers
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/user/users/2', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setInstructors(response.data);
        setFilteredInstructors(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInstructor = async () => {
    if (!instructorToToggle) return;

    const action = instructorToToggle.user.is_deleted ? 'restore' : 'delete';
    setActionLoading(true);

    try {
      await axios.put(`http://localhost:8000/user/deleteAccount/${instructorToToggle.user.user_id}`, {}, {
        withCredentials: true
      });

      toast.success(`Instructor ${action}d successfully`);

      // Update the local state
      const updatedInstructors = instructors.map(instructor => {
        if (instructor.user.user_id === instructorToToggle.user.user_id) {
          return {
            ...instructor,
            user: {
              ...instructor.user,
              is_deleted: !instructor.user.is_deleted
            }
          };
        }
        return instructor;
      });

      setInstructors(updatedInstructors);

      // Also update the filteredInstructors
      const updatedFiltered = filteredInstructors.map(instructor => {
        if (instructor.user.user_id === instructorToToggle.user.user_id) {
          return {
            ...instructor,
            user: {
              ...instructor.user,
              is_deleted: !instructor.user.is_deleted
            }
          };
        }
        return instructor;
      });

      setFilteredInstructors(updatedFiltered);

      // Close the modal
      setIsToggleModalOpen(false);
      setInstructorToToggle(null);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} instructor`);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row justify-end items-start sm:items-center space-y-4 sm:space-y-0">
        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instructors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Major
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
                      <span className="text-gray-500 dark:text-gray-400">Loading instructors...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInstructors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No instructors found
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredInstructors.map((instructor, index) => (
                    <motion.tr
                      key={instructor.user.user_id}
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
                              src={instructor.user.user_img || "https://via.placeholder.com/40"}
                              alt={instructor.user.user_name}
                              loading="lazy"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {instructor.user.user_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {instructor.user.user_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {instructor.user.user_email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {instructor.user.phone_number || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {instructor.major || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(instructor.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openViewModal(instructor)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {instructor.user.is_deleted ? (
                            <button
                              onClick={() => openToggleModal(instructor)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                              title="Restore Instructor"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openToggleModal(instructor)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title="Delete Instructor"
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

      {/* View Instructor Modal */}
      <AnimatePresence>
        {isViewModalOpen && currentInstructor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-instructor-title"
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
                  <h3 id="view-instructor-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                    Instructor Details
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
                        <p className="text-base text-gray-900 dark:text-white">{currentInstructor.user.user_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiMail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-base text-gray-900 dark:text-white">{currentInstructor.user.user_email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiPhone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {currentInstructor.user.phone_number || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiBook className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Major</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {currentInstructor.major || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiAward className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {currentInstructor.skills || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiLink className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Links</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {currentInstructor.links || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Me Section */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">About Me</p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {currentInstructor.about_me || 'No description provided'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete/Restore Confirmation Modal */}
      <AnimatePresence>
        {isToggleModalOpen && instructorToToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="toggle-instructor-title"
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
                  {instructorToToggle.user.is_deleted ? (
                    <FiX className="w-12 h-12 text-green-600" />
                  ) : (
                    <FiTrash2 className="w-12 h-12 text-red-600" />
                  )}
                </div>
                <h3 id="toggle-instructor-title" className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                  {instructorToToggle.user.is_deleted ? 'Restore Instructor' : 'Delete Instructor'}
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Are you sure you want to {instructorToToggle.user.is_deleted ? 'restore' : 'delete'}{' '}
                  <span className="font-medium">{instructorToToggle.user.user_name}</span>? 
                  This action {instructorToToggle.user.is_deleted ? 'will restore the instructor\'s account' : 'cannot be undone'}.
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={closeToggleModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleInstructor}
                    disabled={actionLoading}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      instructorToToggle.user.is_deleted 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {actionLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{instructorToToggle.user.is_deleted ? 'Restoring...' : 'Deleting...'}</span>
                      </div>
                    ) : (
                      instructorToToggle.user.is_deleted ? 'Restore' : 'Delete'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InstructorsList;
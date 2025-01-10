import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEye, 
  FiTrash2, 
  FiSearch, 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiBook, 
  FiAward 
} from 'react-icons/fi';

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Modal control functions
  const openViewModal = (student) => {
    setCurrentStudent(student);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const closeViewModal = () => {
    setCurrentStudent(null);
    setIsViewModalOpen(false);
  };

  const closeDeleteModal = () => {
    setStudentToDelete(null);
    setIsDeleteModalOpen(false);
  };

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
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/user/users/1', {
        withCredentials: true,
      });
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    const filtered = students.filter(student =>
      student.user.user_name.toLowerCase().includes(searchTerm) ||
      student.user.user_email.toLowerCase().includes(searchTerm)
    );
    setFilteredStudents(filtered);
  };

  // Toggle delete/restore student
  const handleToggleDeleteStudent = async () => {
    if (!studentToDelete) return;

    const action = studentToDelete.user.is_deleted ? 'restore' : 'delete';

    try {
      await axios.put(`http://localhost:8000/user/deleteAccount/${studentToDelete.user_id}`, {}, {
        withCredentials: true
      });

      toast.success(`Student ${action}d successfully`);

      // Update the local state
      const updatedStudents = students.map(student => {
        if (student.user_id === studentToDelete.user_id) {
          return {
            ...student,
            user: {
              ...student.user,
              is_deleted: !student.user.is_deleted
            }
          };
        }
        return student;
      });

      setStudents(updatedStudents);

      // Also update the filteredStudents
      const updatedFiltered = filteredStudents.map(student => {
        if (student.user_id === studentToDelete.user_id) {
          return {
            ...student,
            user: {
              ...student.user,
              is_deleted: !student.user.is_deleted
            }
          };
        }
        return student;
      });

      setFilteredStudents(updatedFiltered);

      // Close the modal
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} student`);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-end space-x-4 w-full sm:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 sm:flex-initial">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Major
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Skills
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
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500 dark:text-gray-400">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No students found
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.user_id}
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
                              src={student.user.user_img || "https://via.placeholder.com/40"}
                              alt={student.user.user_name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.user.user_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {student.user_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {student.user.user_email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.user.phone_number || 'No phone'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {student.major || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white truncate max-w-xs">
                          {student.skills || 'No skills listed'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openViewModal(student)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {student.user.is_deleted ? (
                            <button
                              onClick={() => openDeleteModal(student)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                              title="Restore Student"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openDeleteModal(student)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title="Delete Student"
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

      {/* View Student Modal */}
      <AnimatePresence>
        {isViewModalOpen && currentStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Student Details
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
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiUser className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-base text-gray-900 dark:text-white">{currentStudent.user.user_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiMail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-base text-gray-900 dark:text-white">{currentStudent.user.user_email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiPhone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                        <p className="text-base text-gray-900 dark:text-white">
                          {currentStudent.user.phone_number || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FiBook className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Major</p>
                        <p className="text-base text-gray-900 dark:text-white">{currentStudent.major || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FiAward className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</p>
                        <p className="text-base text-gray-900 dark:text-white">{currentStudent.skills || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">About Me</p>
                    <p className="mt-1 text-base text-gray-900 dark:text-white">
                      {currentStudent.about_me || 'No description provided'}
                    </p>
                  </div>

                  {currentStudent.user.user_cv && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CV</p>
                      <a
                        href={currentStudent.user.user_cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center text-blue-600 hover:text-blue-500"
                      >
                        View CV
                        <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete/Restore Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && studentToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
                  {studentToDelete.user.is_deleted ? (
                    <FiX className="w-12 h-12 text-green-600" />
                  ) : (
                    <FiTrash2 className="w-12 h-12 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-center text-gray-900 dark:text-white mb-4">
                  {studentToDelete.user.is_deleted ? 'Restore Student' : 'Delete Student'}
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Are you sure you want to {studentToDelete.user.is_deleted ? 'restore' : 'delete'}{' '}
                  <span className="font-medium">{studentToDelete.user.user_name}</span>? 
                  This action {studentToDelete.user.is_deleted ? 'will restore the student\'s account' : 'cannot be undone'}.
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleDeleteStudent}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      studentToDelete.user.is_deleted 
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    }`}
                  >
                    {studentToDelete.user.is_deleted ? 'Restore' : 'Delete'}
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

export default StudentsList;
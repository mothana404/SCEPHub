import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboadLayouts/DashbordLayout';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrump';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiCheck, FiX, FiCalendar, FiUsers } from 'react-icons/fi';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [updatedProjectData, setUpdatedProjectData] = useState({});
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/category', { withCredentials: true });
        setCategories(response.data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/project/admin/projectsData', {
        params: { search, page: currentPage },
        withCredentials: true,
      });
      setProjects(response.data.projects);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.put(`http://localhost:8000/project/deleteProject/${id}`, {}, { withCredentials: true });
      fetchProjects();
      toast.success('Project status updated successfully');
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const updateProject = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/project/instructor/update/${selectedProject.project_id}`,
        updatedProjectData,
        { withCredentials: true }
      );
      setProjects(prev =>
        prev.map(project =>
          project.project_id === selectedProject.project_id ? response.data : project
        )
      );
      setOpenPopup(false);
      toast.success('Project updated successfully');
    } catch (error) {
      setErrors(error.response?.data?.errors || { general: 'Something went wrong' });
      toast.error('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenPopup = (project) => {
    setSelectedProject(project);
    setUpdatedProjectData({ ...project });
    setOpenPopup(true);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProjectData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, search]);

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 h-full bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        <div className="mb-8">
          <Breadcrumb pageTitle="Project Management" />
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex justify-end space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Project Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span className="text-gray-500 dark:text-gray-400">Loading projects...</span>
                      </div>
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {projects.map((project, index) => (
                      <motion.tr
                        key={project.project_id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                src={project.project_img || '/default-project.png'}
                                alt={project.project_name}
                                className="h-12 w-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = '/default-project.png';
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {project.project_name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {project.project_description?.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {project.instructor?.user.user_name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiUsers className="mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {project.numberOfMembers || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {project.category?.category_name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(project.end_date) < new Date() ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              Passed
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Running
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleOpenPopup(project)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteProject(project.project_id)}
                              className={`${project.is_deleted
                                  ? 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                  : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                } transition-colors duration-200`}
                            >
                              {project.is_deleted ? (
                                <FiCheck className="w-5 h-5" />
                              ) : (
                                <FiTrash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Modal */}
        <AnimatePresence>
          {openPopup && selectedProject && (
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
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Update Project
                    </h3>
                    <button
                      onClick={() => setOpenPopup(false)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  updateProject();
                }}>
                  <div className="px-6 py-4 space-y-4">
                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        name="project_name"
                        value={updatedProjectData.project_name || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.project_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.project_name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.project_name}</p>
                      )}
                    </div>

                    {/* Project Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Project Description
                      </label>
                      <textarea
                        name="project_description"
                        value={updatedProjectData.project_description || ''}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.project_description ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {errors.project_description && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.project_description}</p>
                      )}
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        name="project_category"
                        value={updatedProjectData.project_category || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.project_category ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.category_id} value={category.category_id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                      {errors.project_category && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.project_category}</p>
                      )}
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          value={updatedProjectData.start_date || ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.start_date ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.start_date && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.start_date}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          value={updatedProjectData.end_date || ''}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.end_date ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.end_date && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.end_date}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-b-lg flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setOpenPopup(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        'Update Project'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </DashboardLayout>
  );
}

export default Projects;
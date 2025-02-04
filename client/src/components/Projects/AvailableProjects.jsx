import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineClipboard, HiOutlineExclamationCircle, HiOutlineSearch, HiOutlineUsers } from 'react-icons/hi';
import axios from 'axios';
import DashboardLayout from '../DashboadLayouts/DashbordLayout';
import Breadcrumb from '../Breadcrump';

function AvailableProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        window.scrollTo(0, 0);
        const response = await axios.get(
          `http://localhost:8000/project/allProjects/${'a'}`,
          { withCredentials: true }
        );
        setProjects(response.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <Breadcrumb pageTitle="Available Projects" />

            {/* Stats and Search Section */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center">
                  <HiOutlineClipboard className="h-6 w-6 text-blue-500" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
                    Available Projects
                  </h3>
                </div>
                <p className="mt-2 text-3xl font-bold text-[#041643]">
                  {projects.length}
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <AnimatePresence>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-64"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#041643]"></div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-64"
              >
                <div className="text-center">
                  <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-red-500" />
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{error}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.project_id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <Link to={`/theProjectDetails/${project.project_id}`} className="block">
                      <div className="relative h-48">
                        <img
                          className="w-full h-full object-cover"
                          src={project.project_img}
                          alt={project.project_name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                          {project.category.category_name}
                        </span>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                          {project.project_name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: project.project_description }}
                        >
                          {/* {project.project_description} */}
                        </p>

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center text-gray-600">
                            <HiOutlineUsers className="w-5 h-5 mr-2" />
                            <span className="text-sm">{project.participants.length} Participants</span>
                          </div>
                          <span className="text-[#041643] font-medium text-sm hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default AvailableProjects;
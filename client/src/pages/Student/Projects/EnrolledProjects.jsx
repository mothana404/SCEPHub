import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineClipboard, HiOutlineExclamationCircle } from 'react-icons/hi';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';
import ProjectsCards from '../../../components/Projects/ProjectsCards';
import Breadcrumb from '../../../components/Breadcrump';

function EnrolledProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProjects = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/project/student/enrolledProjects',
                    { withCredentials: true }
                );
                setProjects(response.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Filter projects based on search term
    const filteredProjects = projects.filter(project =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <main className="p-4 md:ml-64 h-full dark:bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <Breadcrumb pageTitle="Joined Projects" />
                        
                        {/* Stats and Search Section */}
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Stats Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                                <div className="flex items-center">
                                    <HiOutlineClipboard className="h-6 w-6 text-blue-500" />
                                    <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
                                        Total Projects
                                    </h3>
                                </div>
                                <p className="mt-2 text-3xl font-bold text-[#041643]">
                                    {projects.length}
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
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
                                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                                        {error}
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredProjects.length === 0 ? (
                                    <div className="text-center py-12">
                                        <HiOutlineClipboard className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                                            No projects found
                                        </h3>
                                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                                            {searchTerm ? "Try adjusting your search term" : "Get started by joining a project"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredProjects.map((project) => (
                                            <ProjectsCards
                                                key={project.project_id}
                                                project={project}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </DashboardLayout>
    );
}

export default EnrolledProjects;
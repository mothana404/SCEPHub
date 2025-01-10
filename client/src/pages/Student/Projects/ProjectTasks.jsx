import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch,
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaTimes,
    FaLink,
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaCode
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';
import { Link, useParams } from 'react-router-dom';
import LiveChat from '../../../components/LiveChat';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CodeEditor from '../../../components/Projects/CodeEditor';

function ProjectTasks() {
    const { id } = useParams();
    const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);

    const [allTasks, setAllTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // New state for status filter
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const itemsPerPage = 6;
    const [taskDelivery, setTaskDelivery] = useState('');
    const [refresh, setRefresh] = useState(0);
    const [userID, setuserID] = useState('');
    const [project, setProject] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 25 } },
        exit: { opacity: 0, scale: 0.8 }
    };

    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    // Fetch tasks from backend based on search query
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/task/student/tasksForStudentProject/${id}`, {
                    params: {
                        searchQuery,
                        page: 1, // Always fetch all tasks for client-side filtering
                        limit: 1000 // Assume a reasonable upper limit
                    },
                    withCredentials: true,
                });
                setAllTasks(response.data.tasks);
                setTotalItems(response.data.meta.totalItems);
                setuserID(response.data.StudentID);

                const presponse = await axios.get(`http://localhost:8000/project/homeProjectDetails/${id}`);
                setProject(presponse.data.project_name);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch Tasks');
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [id, searchQuery, refresh]);

    // Memoize filtered tasks based on status filter
    const filteredTasks = useMemo(() => {
        if (statusFilter === 'all') return allTasks;
        return allTasks.filter(task => task.status === statusFilter);
    }, [allTasks, statusFilter]);

    // Update total pages whenever filtered tasks change
    useEffect(() => {
        setTotalPages(Math.ceil(filteredTasks.length / itemsPerPage));
        if (currentPage > Math.ceil(filteredTasks.length / itemsPerPage)) {
            setCurrentPage(1); // Reset to first page if current page exceeds total pages
        }
    }, [filteredTasks, itemsPerPage, currentPage]);

    // Get current page tasks
    const currentTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredTasks.slice(startIndex, endIndex);
    }, [filteredTasks, currentPage, itemsPerPage]);

    const handleSubmit = async (e, taskID) => {
        e.preventDefault();
        if (!taskDelivery.trim()) {
            toast.error('Please enter task delivery details.');
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:8000/task/student/taskDelivery/${taskID}`,
                { task_link: taskDelivery },
                { withCredentials: true }
            );
            if (response.status === 201) {
                toast.success('Task delivery details sent successfully!');
                closePopup();
                setRefresh(prev => prev + 1);
                setTaskDelivery('');
            } else {
                toast.error('Failed to send task delivery details. Please try again.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'There was an error sending your task delivery details.');
        }
    };

    const handleViewDetails = (task) => {
        if (task.status === 'completed') {
            toast.info('This task has been completed.');
            return;
        }
        setSelectedTask(task);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedTask(null);
        setTaskDelivery('');
    };

    const handleInputChange = (e) => {
        setTaskDelivery(e.target.value);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FaCheckCircle className="text-green-500 inline mr-2" />;
            case 'pending_approval':
                return <FaClock className="text-blue-500 inline mr-2" />;
            case 'in_progress':
                return <FaSpinner className="text-yellow-500 inline mr-2 animate-spin" />;
            default:
                return null;
        }
    };

    const renderModal = () => {
        if (!selectedTask) return null;

        const isPendingApproval = selectedTask.status === 'pending_approval';
        const isCompleted = selectedTask.status === 'completed';

        return (
            <AnimatePresence>

                {isPopupOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                    >
                        <div className="flex flex-col bg-white p-8 rounded-lg w-[700px] gap-4 relative">
                            <button
                                onClick={closePopup}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>

                            {isPendingApproval && (
                                <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg flex items-center">
                                    <FaClock className="mr-2" />
                                    <span>Your submission is made successfully and waiting for review.</span>
                                </div>
                            )}

                            {isCompleted && (
                                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
                                    <FaCheckCircle className="mr-2" />
                                    <span>This task has been completed.</span>
                                </div>
                            )}

                            {!isCompleted && !isPendingApproval && (
                                <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg flex items-center">
                                    <FaSpinner className="mr-2 animate-spin" />
                                    <span>This task is in progress.</span>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-4">{selectedTask.title}</h3>
                            <div className="space-y-3">
                                <p className="text-gray-700"><strong>Description:</strong> {selectedTask.description}</p>
                                <p className="text-gray-700"><strong>Due Date:</strong> {new Date(selectedTask.due_date).toLocaleDateString()}</p>
                                <p className="text-gray-700"><strong>Created At:</strong> {new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-700 flex items-center">
                                    <strong>Task Delivery:</strong>
                                    {selectedTask.task_delivery ? (
                                        <Link
                                            to={selectedTask.task_delivery}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-blue-500 hover:underline flex items-center"
                                        >
                                            <FaLink className="mr-1" /> View Submission
                                        </Link>
                                    ) : (
                                        <span className="ml-2 text-gray-500">No submission yet.</span>
                                    )}
                                </p>
                                <p className="text-gray-700 flex items-center">
                                    <strong>Additional File:</strong>
                                    {selectedTask.task_img ? (
                                        <Link
                                            to={selectedTask.task_img}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-blue-500 hover:underline flex items-center"
                                        >
                                            <FaEye className="mr-1" /> View File
                                        </Link>
                                    ) : (
                                        <span className="ml-2 text-gray-500">No additional file.</span>
                                    )}
                                </p>
                                {!isCompleted && !isPendingApproval && (
                                    <form onSubmit={(e) => handleSubmit(e, selectedTask.task_id)} className="mt-4">
                                        <label htmlFor="taskDelivery" className="block text-gray-700 mb-2">
                                            Enter Task Delivery Details:
                                        </label>
                                        <input
                                            id="taskDelivery"
                                            type="text"
                                            value={taskDelivery}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter task delivery link"
                                        />
                                        <button
                                            type="submit"
                                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                                        >
                                            <FaCheckCircle className="mr-2" /> Submit
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <main className="p-4 md:ml-64 pt-2 dark:bg-gray-900 transition-colors duration-300 overflow-auto">
                <div className="-my-2 py-0 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-4">
                    <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white shadow-lg px-12">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4 items-center">
                                {/* Search Input
                                <div className="inline-flex border rounded w-7/12 px-2 lg:px-6 h-12 bg-transparent">
                                    <div className="flex flex-wrap items-stretch w-full h-full mb-6 relative">
                                        <div className="flex">
                                            <span className="flex items-center leading-normal bg-transparent rounded rounded-r-none border border-r-0 border-none lg:px-3 py-2 whitespace-no-wrap text-grey-dark text-sm">
                                                <FaSearch />
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="flex-shrink flex-grow flex-auto leading-normal tracking-wide w-px flex-1 border border-none border-l-0 rounded rounded-l-none px-3 relative focus:outline-none text-xxs lg:text-xs lg:text-base text-gray-500 font-thin"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1); // Reset to first page on search
                                            }}
                                        />
                                    </div>
                                </div> */}
                                {/* Status Filter */}
                                <div className="inline-flex border rounded h-12 bg-transparent">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(1); // Reset to first page on filter change
                                        }}
                                        className="appearance-none bg-transparent border-none px-3 py-2 text-gray-500 text-sm lg:text-base focus:outline-none"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending_approval">Pending Approval</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <span className="flex items-center px-2">
                                        {/* Optional: Add an icon or indicator for the dropdown */}
                                    </span>
                                </div>
                            </div>
                            <div className="font-light text-3xl text-gray-500 text-opacity-55 italic">{project}</div>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg pb-4">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b-2 border-gray-300 text-left text-blue-500 tracking-wider">
                                        <FaEye className="inline mr-1" /> Task ID
                                    </th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-blue-500 tracking-wider">Title</th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-blue-500 tracking-wider">Task Delivery</th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-blue-500 tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-blue-500 tracking-wider">Status</th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-blue-500 tracking-wider">Created At</th>
                                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm text-blue-500 tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                <AnimatePresence>
                                    {currentTasks.map((task) => (
                                        <motion.tr
                                            key={task.task_id}
                                            className="bg-white hover:bg-gray-100 border-b transform hover:scale-105 transition duration-200"
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={tableRowVariants}
                                        >
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm leading-5 text-gray-800">#{task.task_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                                                <div className="text-sm leading-5 text-blue-900">{task.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                                                {task.task_delivery ? (
                                                    <Link
                                                        to={task.task_delivery}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline flex items-center"
                                                    >
                                                        <FaLink className="mr-1" /> View
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-500">No Submission</span>
                                                )}
                                            </td>
                                            <td
                                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 ${new Date(task.due_date) < new Date() ? 'text-red-600 font-bold' : 'text-blue-900'
                                                    }`}
                                            >
                                                {new Date(task.due_date).toLocaleDateString('en-GB', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                                                <span className="flex items-center">
                                                    {getStatusIcon(task.status)}
                                                    <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-xs">
                                                        {task.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-blue-900 text-sm leading-5">
                                                {new Date(task.createdAt).toLocaleDateString('en-GB', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                                                <button
                                                    onClick={() => handleViewDetails(task)}
                                                    className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none flex items-center"
                                                >
                                                    <FaEye className="mr-2" /> View Details
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4">
                            <div>
                                <p className="text-sm leading-5 text-blue-700">
                                    Showing <span className="font-medium">{currentPage}</span> to{' '}
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTasks.length)}</span> of{' '}
                                    <span className="font-medium">{filteredTasks.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                                        aria-label="Previous"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`-ml-px relative inline-flex items-center px-4 py-2 border text-sm leading-5 font-medium ${currentPage === index + 1
                                                ? 'text-blue-700 bg-white'
                                                : 'text-blue-600 hover:bg-gray-100'
                                                } focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                                        aria-label="Next"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsCodeEditorOpen(true)}
                        className="fixed bottom-14 right-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-blue-700 shadow-lg flex items-center"
                    >
                        <FaCode className="mr-2" /> Open Code Editor
                    </button>

                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg flex items-center"

                    >
                        <FaEye className="mr-2" /> Open Chat
                    </button>
                    <AnimatePresence>
                        {isCodeEditorOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed mt-10 inset-0 z-50 overflow-y-auto bg-black bg-opacity-50"
                            >
                                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
                                    >
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                    Code Editor
                                                </h3>
                                                <button
                                                    onClick={() => setIsCodeEditorOpen(false)}
                                                    className="text-gray-400 hover:text-gray-500"
                                                >
                                                    <FaTimes className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <div className="h-[600px]">
                                                <CodeEditor />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isChatOpen && (
                        <LiveChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} groupId={id} userID={userID} />
                    )}

                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                {renderModal()}

            </main>

        </DashboardLayout>

    )
};

ProjectTasks.propTypes = {
    id: PropTypes.string,
};

export default ProjectTasks;
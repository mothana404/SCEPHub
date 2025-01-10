import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineBookOpen, 
  HiOutlineSearch, 
  HiOutlineFilter,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineX
} from 'react-icons/hi';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';
import Breadcrumb from '../../../components/Breadcrump/';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function AllCourses() {
  // States
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const coursesPerPage = 8;

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

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/category', { 
        withCredentials: true 
      });
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  // Fetch courses from backend with search and category filters
// Fetch courses from backend with search and category filters
const fetchCourses = async (search = '', selectedCats = []) => {
  setLoading(true);
  setError(null);
  try {
    const params = { course_name: search };
    
    if (selectedCats.length > 0) {
      // Join category IDs with commas for the backend
      params.categories = selectedCats.join(',');
    }

    const response = await axios.get('http://localhost:8000/course/allCourses', {
      params,
      withCredentials: true,
    });

    // Assuming the backend returns an array of courses directly
    const fetchedCourses = response.data.map(course => ({
      id: course.course_id,
      image: course.course_img,
      category: course.category?.category_name || 'Uncategorized',
      instructor: course.instructor?.user?.user_name || 'Unknown Instructor',
      instructorImg: course.instructor?.user?.profile_picture || 'https://via.placeholder.com/40',
      lessons: course.contents?.length || 0, // Handle undefined 'contents'
      enrolled: course.enrolled_count || 0, // Handle undefined 'enrolled_count'
      duration: course.duration || 'N/A', // Handle undefined 'duration'
      level: course.level || 'Beginner', // Handle undefined 'level'
      rating: course.rating || '0.0',
      title: course.course_name,
      description: course.course_description
    }));

    setCourses(fetchedCourses);
    setCurrentPage(1);
  } catch (err) {
    console.error(err);
    setError('Failed to fetch courses. Please try again.');
  } finally {
    setLoading(false);
  }
};

  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Remove category if already selected
        return prev.filter(id => id !== categoryId);
      } else {
        // Add category to selection
        return [...prev, categoryId];
      }
    });
  };

  // Handle clearing all filters
  const clearFilters = () => {
    setSelectedCategories([]);
  };

  // Pagination logic
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch courses when search term or selected categories change
  useEffect(() => {
    fetchCourses(searchTerm, selectedCategories);
  }, [searchTerm, selectedCategories]);

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Breadcrumb pageTitle="Available Courses" />

            {/* Stats and Search Section */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <HiOutlineBookOpen className="h-6 w-6 text-blue-500" />
                    <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      Total Courses
                    </h3>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#041643]">
                    {courses.length}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Hidden on mobile, toggleable */}
            <div className="hidden lg:block">
              <div className="sticky top-4">
                {/* Category Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Categories
                    </h2>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {categories.map(category => (
                      <label key={category.category_id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={category.category_id}
                          checked={selectedCategories.includes(category.category_id)}
                          onChange={() => handleCategoryChange(category.category_id)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{category.category_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden fixed bottom-4 right-4 bg-[#041643] text-white p-3 rounded-full shadow-lg z-10"
              aria-label="Toggle Filters"
            >
              {isFilterOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineFilter className="w-6 h-6" />}
            </button>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
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
                    <p className="text-red-500">{error}</p>
                  </motion.div>
                ) : courses.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-64"
                  >
                    <p className="text-gray-700 dark:text-gray-300">No courses found.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {currentCourses.map((course) => (
                      <Link to={`/course/${course.id}`}>
                      <motion.div
                        key={course.id}
                        variants={cardVariants}
                        whileHover="hover"
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                      >
                        <div className="relative h-48">
                          <img
                            className="w-full h-full object-cover"
                            src={course.image || 'https://via.placeholder.com/400x200'}
                            alt={course.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                            {course.category}
                          </span>
                        </div>

                        <div className="p-5 space-y-3">
                       
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {course.title}
                          </h3>

                          <div className="flex items-center space-x-2">
                            <img
                              src={course.instructorImg}
                              alt={course.instructor}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {course.instructor}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            {/* <div className="flex items-center space-x-1">
                              <HiOutlineClock className="w-4 h-4" />
                              <span>{course.duration}</span>
                            </div> */}
                            <div className="flex items-center space-x-1">
                              <HiOutlineStar className="w-4 h-4 text-yellow-400" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                       </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {!loading && !error && courses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex flex-col items-center space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#041643]'
                        }
                      `}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </button>

                    <div className="flex items-center space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(num => {
                          if (totalPages <= 5) return true;
                          if (num === 1 || num === totalPages) return true;
                          if (Math.abs(currentPage - num) <= 1) return true;
                          return false;
                        })
                        .map((number, index, array) => (
                          <React.Fragment key={number}>
                            {index > 0 && array[index - 1] !== number - 1 && (
                              <span className="text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => paginate(number)}
                              className={`
                                w-10 h-10 rounded-lg text-sm font-medium
                                transition-colors duration-200
                                ${currentPage === number
                                  ? 'bg-[#041643] text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#041643]'
                                }
                              `}
                            >
                              {number}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#041643]'
                        }
                      `}
                    >
                      Next
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Showing {indexOfFirstCourse + 1} to{' '}
                    {Math.min(indexOfLastCourse, courses.length)} of {courses.length} courses
                  </p>
                </motion.div>
              )}

              {/* Mobile Filter Sidebar */}
              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                      onClick={() => setIsFilterOpen(false)}
                    />
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'tween' }}
                      className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 z-50 lg:hidden"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Filters
                          </h3>
                          <button
                            onClick={() => setIsFilterOpen(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <HiOutlineX className="w-6 h-6" />
                          </button>
                        </div>
                        {/* Category Filters */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Categories
                            </h2>
                            {selectedCategories.length > 0 && (
                              <button
                                onClick={clearFilters}
                                className="text-sm text-blue-500 hover:underline"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                          <div className="space-y-2 max-h-80 overflow-y-auto">
                            {categories.map(category => (
                              <label key={category.category_id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  value={category.category_id}
                                  checked={selectedCategories.includes(category.category_id)}
                                  onChange={() => handleCategoryChange(category.category_id)}
                                  className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{category.category_name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </main>
    </DashboardLayout>
  );
}

export default AllCourses;
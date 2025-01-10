import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  HiOutlineBookOpen, 
  HiOutlineSearch, 
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineShoppingCart
} from 'react-icons/hi';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';
import Breadcrumb from '../../../components/Breadcrump';

function EnrolledCourses() {
  // States
  const [courses, setCourses] = useState([]);
  const [UnSubcourses, setUnSubCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  // Fetch enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/course/enrollmentCourses', {
          withCredentials: true,
        });
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to fetch enrolled courses.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch unsubscribed courses
  useEffect(() => {
    const fetchUnSubCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/course/getUnSubCourses', {
          withCredentials: true,
        });
        setUnSubCourses(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnSubCourses();
  }, []);

  // Handle checkout
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/create-checkout-session', {}, {
        withCredentials: true,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('Checkout session URL not found');
      }
    } catch (err) {
      console.error('Failed to create checkout session:', err);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64  dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <Breadcrumb pageTitle="Enrolled Courses" />

            {/* Stats and Search Section */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <HiOutlineBookOpen className="h-6 w-6 text-blue-500" />
                    <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      Enrolled Courses
                    </h3>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#041643]">
                    {courses.length}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <HiOutlineShoppingCart className="h-6 w-6 text-blue-500" />
                    <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                      Pending Courses
                    </h3>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#041643]">
                    {UnSubcourses.length}
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Enrolled Courses
            </h2>
            
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
              ) : filteredCourses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <HiOutlineBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    No courses found
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {searchTerm ? "Try adjusting your search term" : "Start by enrolling in a course"}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.course_id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <Link to={`/course/view-subscriped/${course.course_id}`}>
                        <div className="relative h-48">
                          <img
                            className="w-full h-full object-cover"
                            src={course.course_img || 'default-course-image.png'}
                            alt={course.course_name}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                            {course.category?.category_name || 'Beginner'}
                          </span>
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                            {course.course_name}
                          </h3>

                          <div className="flex items-center space-x-2">
                            <HiOutlineAcademicCap className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {course.instructor?.user?.user_name || 'Unknown Instructor'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-yellow-400">
                              <HiOutlineStar className="w-5 h-5" />
                              <span className="text-sm font-medium">
                                {course.rating || '0.0'}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <HiOutlineClock className="w-5 h-5 mr-1" />
                              <span className="text-sm">3 Weeks</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
                    {/* Unsubscribed Courses Section */}
                    {UnSubcourses.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Alert Banner */}
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <div className="flex items-center">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-yellow-400" />
                  <p className="ml-3 text-sm text-yellow-700">
                    <span className="font-medium">Attention!</span> Complete the checkout process to access these courses.
                  </p>
                </div>
              </div>

              {/* Unsubscribed Courses Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Pending Courses
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {UnSubcourses.map((course) => (
                    <motion.div
                      key={course.course.course_id}
                      variants={cardVariants}
                      whileHover="hover"
                      className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200"
                    >
                      <div className="relative h-48">
                        <img
                          className="w-full h-full object-cover filter blur-[2px]"
                          src={course.course.course_img || 'default-course-image.png'}
                          alt={course.course.course_name}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                          {course.course.category?.category_name || 'Beginner'}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-white/90 text-[#041643] px-4 py-2 rounded-full text-sm font-medium">
                            Pending Checkout
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                          {course.course.course_name}
                        </h3>

                        <div className="flex items-center space-x-2">
                          <HiOutlineAcademicCap className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {course.course.instructor?.user?.user_name || 'Unknown Instructor'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <HiOutlineStar className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              {course.rating || '0.0'}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <HiOutlineClock className="w-5 h-5 mr-1" />
                            <span className="text-sm">3 Weeks</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Checkout Button */}
                <div className="mt-8 flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className={`
                      flex items-center space-x-2 px-6 py-3 bg-[#041643] text-white rounded-full
                      font-medium shadow-lg transition-all
                      ${checkoutLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-[#082265]'}
                    `}
                  >
                    <HiOutlineShoppingCart className="w-5 h-5" />
                    <span>
                      {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                    </span>
                    {checkoutLoading && (
                      <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                      </div>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}

export default EnrolledCourses;
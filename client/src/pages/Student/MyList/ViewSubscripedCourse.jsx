import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ToastContainer, toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

import {
  HiOutlineHome,
  HiOutlinePlay,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineChevronRight,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import DashboardLayout from "../../../components/DashboadLayouts/DashbordLayout";

const ViewSubscribedCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRatingSubmit = async (ratingValue) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/course/rate/${courseId}`,
        {
          courseId,
          rating: ratingValue,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success(`${response.data}`);
        setRating(ratingValue);
      } else {
        toast.error("Failed to submit rating.");
      }
    } catch (error) {
      toast.error("Failed to submit rating.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/course/coursePage/${courseId}`,
          { withCredentials: true }
        );
        setCourse(response.data.course);
        setContent(response.data.content);
        if (response.data.content.length > 0) {
          setCurrentVideo(response.data.content[0]);
        }
        if (response.data.course.rating) {
          setRating(response.data.course.rating);
        }
      } catch (error) {
        toast.error("Failed to load course data.");
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
    if (videoRef.current) {
      //   videoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!course || !currentVideo) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#041643]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64  dark:bg-gray-900 min-h-screen">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
          >
            <Link to="/" className="flex items-center hover:text-[#041643]">
              <HiOutlineHome className="w-4 h-4 mr-1" />
              Home
            </Link>
            <HiOutlineChevronRight className="w-4 h-4" />
            <span className="text-[#041643] font-medium">
              {course.course_name}
            </span>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Video and Description */}
            <motion.div variants={itemVariants} className="lg:w-3/4">
              {/* Video Player Container */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative pb-[56.25%]">
                  {currentVideo.video_url ? (
                    <>
                      <video
                        ref={videoRef} // Ref attached correctly
                        className="absolute top-0 left-0 w-full h-full"
                        src={currentVideo.video_url}
                        controls
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </>
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200">
                      <p className="text-gray-700">Video not available</p>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentVideo.video_title}
                  </h1>

                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                          <label
                            key={index}
                            className={`cursor-pointer ${
                              rating ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                          >
                            <input
                              type="radio"
                              name="rating"
                              className="hidden"
                              value={ratingValue}
                              onClick={() =>
                                !rating && handleRatingSubmit(ratingValue)
                              }
                              disabled={rating > 0}
                            />
                            <FaStar
                              className={`transition-colors duration-200 ${
                                rating ? "opacity-80" : "hover:scale-110"
                              }`}
                              color={
                                ratingValue <= (rating || hover)
                                  ? "#ffc107"
                                  : "#e4e5e9"
                              }
                              size={24}
                              onMouseEnter={() =>
                                !rating && setHover(ratingValue)
                              }
                              onMouseLeave={() => !rating && setHover(0)}
                            />
                          </label>
                        );
                      })}
                      {rating ? (
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {rating
                            ? `Your rating: ${rating}/5`
                            : "Rate this course"}
                        </span>
                      ) : (
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Rate this course
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-600 dark:text-gray-400">
                    <div
                      className="text-gray-600 dark:text-gray-400"
                      dangerouslySetInnerHTML={{
                        __html:
                          currentVideo.video_description ||
                          "No description available.",
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Tabs Section */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <Tabs>
                  <TabList className="flex gap-3 border-b border-gray-200 dark:border-gray-700 px-4">
                    <Tab
                      className={({ selected }) =>
                        `flex items-center space-x-2  py-4 px-6 font-medium text-sm focus:outline-none border-b-2 transition-colors duration-200 ${
                          selected
                            ? "border-[#041643] text-[#041643] dark:text-white"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        }`
                      }
                    >
                      <HiOutlineBookOpen className="w-5 h-5" />
                      <span>Course Description</span>
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `flex items-center space-x-2 py-4 px-6 font-medium text-sm focus:outline-none border-b-2 transition-colors duration-200 ${
                          selected
                            ? "border-[#041643] text-[#041643] dark:text-white"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        }`
                      }
                    >
                      <HiOutlineInformationCircle className="w-5 h-5" />
                      <span>Additional Information</span>
                    </Tab>
                  </TabList>

                  <TabPanel>
                    <div className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: course.course_description,
                          }}
                        />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <HiOutlineAcademicCap className="w-5 h-5 text-[#041643]" />
                        <span className="font-medium">Instructor:</span>
                        <span>
                          {course.instructor?.user?.user_name ||
                            "Unknown Instructor"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HiOutlineBookOpen className="w-5 h-5 text-[#041643]" />
                        <span className="font-medium">Total Lectures:</span>
                        <span>{content.length}</span>
                      </div>
                      {/* Add more course information as needed */}
                    </div>
                  </TabPanel>
                </Tabs>
              </motion.div>
            </motion.div>

            {/* Sidebar - Course Content */}
            <motion.div variants={itemVariants} className="lg:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden sticky top-4">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course Content
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {content.length} lectures
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-2">
                    {content.map((video, index) => (
                      <motion.button
                        key={video.video_id}
                        onClick={() => handleVideoClick(video)}
                        className={`w-full flex items-center p-3 rounded-lg transition-all ${
                          currentVideo.video_id === video.video_id
                            ? "bg-[#041643] text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          {currentVideo.video_id === video.video_id ? (
                            <HiOutlinePlay className="w-4 h-4" />
                          ) : (
                            <span className="text-sm">{index + 1}</span>
                          )}
                        </div>
                        <div className="ml-3 text-left">
                          <p
                            className={`text-sm font-medium ${
                              currentVideo.video_id === video.video_id
                                ? "text-white"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {video.video_title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {/* Add video duration if available */}
                            10:00
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

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
};

export default ViewSubscribedCourse;

// src/pages/Student/MyList/ViewCourse.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Faq from '../../../components/Faq';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// StarRating Component for reusability
const StarRating = ({ rating = 0 }) => {
    // Ensure rating is a valid number between 0 and 5
    const validRating = Math.min(Math.max(Number(rating), 0), 5);
    const fullStars = Math.floor(validRating);
    const emptyStars = 5 - fullStars;

    return (
        <div className="flex">
            {[...Array(fullStars)].map((_, index) => (
                <svg
                    key={`full-${index}`}
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.368 2.45a1 1 0 00-.364 1.118l1.286 3.958c.3.921-.755 1.688-1.54 1.118l-3.368-2.45a1 1 0 00-1.175 0l-3.368 2.45c-.784.57-1.838-.197-1.54-1.118l1.286-3.958a1 1 0 00-.364-1.118L2.86 9.385c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.958z" />
                </svg>
            ))}
            {[...Array(emptyStars)].map((_, index) => (
                <svg
                    key={`empty-${index}`}
                    className="w-5 h-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.368 2.45a1 1 0 00-.364 1.118l1.286 3.958c.3.921-.755 1.688-1.54 1.118l-3.368-2.45a1 1 0 00-1.175 0l-3.368 2.45c-.784.57-1.838-.197-1.54-1.118l1.286-3.958a1 1 0 00-.364-1.118L2.86 9.385c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.958z" />
                </svg>
            ))}
        </div>
    );
};

const ViewCourse = ({
    course,
    content = [],
    allCourses = [],
    isEnrolled = false,
}) => {
    const [lockedMessage, setLockedMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [autoPlayNext, setAutoPlayNext] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate(); // For navigation if needed

    // Handle enrollment action
    const handleEnrollmentToggle = async () => {
        setLoading(true);
        try {
            // Example API call for enrollment (adjust as needed)
            const response = await axios.post(
                `http://localhost:8000/course/enroll/${course.course_id}`,
                {},
                { withCredentials: true }
            );
            if (response.status === 200) {
                toast.success('Successfully enrolled in the course!');
                // Optionally, refresh the page or update state
                navigate(`/course/${course.course_id}`);
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            toast.error('Failed to enroll. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle locked content click
    const handleLockedContentClick = (title) => {
        setLockedMessage(`You need to enroll in this course to access "${title}".`);
        toast.warn(`Please enroll to access "${title}".`);
    };

    // Determine if content is a single object or an array
    const isSingleVideo = content.length === 1;

    // Extract the single video or the array of videos
    const videos = content;

    // Related courses (excluding the current course)
    const relatedCourses = allCourses
        .filter((c) => c.course_id !== course.course_id)
        .slice(0, 2);

    // Handle video end to auto-play next video if enrolled
    const handleVideoEnd = () => {
        if (isEnrolled && currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
            setAutoPlayNext(true);
            // Scroll to top or to the video player if necessary
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Effect to auto-play next video if set
    useEffect(() => {
        if (autoPlayNext && videoRef.current) {
            videoRef.current.play();
            setAutoPlayNext(false);
        }
    }, [currentVideoIndex, autoPlayNext]);

    // Handle sidebar section click
    const handleSidebarClick = (index) => {
        setCurrentVideoIndex(index);
        setAutoPlayNext(false); // Reset autoplay
        // Scroll to top or to the video player if necessary
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col lg:flex-row mt-8">
            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
            />

            {/* Main Content */}
            <div className="w-full lg:w-2/3 lg:pr-8">


                {/* Course Video or Enrollment Message */}
                <div className="mb-8">
                    {isSingleVideo ? (
                        <div className="text-center p-8 bg-yellow-100 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Preview Video</h2>
                            {videos[0].video_url ? (
                                <video
                                    className="w-full h-auto rounded-lg shadow-lg"
                                    controls
                                    src={videos[0].video_url}
                                    preload="metadata"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg shadow-lg">
                                    <p className="text-gray-700">Preview video not available.</p>
                                </div>
                            )}
                            <p className="mt-4 text-gray-700">
                                To access all course content, please subscribe.
                            </p>
                        </div>
                    ) : (
                        // Enrolled: Display current video with navigation
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">{videos[currentVideoIndex].video_title}</h2>
                            <div className="relative pb-[56.25%]">
                                {videos[currentVideoIndex].video_url ? (
                                    <video
                                        ref={videoRef}
                                        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                                        controls
                                        src={videos[currentVideoIndex].video_url}
                                        preload="metadata"
                                        onEnded={handleVideoEnd}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 rounded-lg shadow-lg">
                                        <p className="text-gray-700">Video not available.</p>
                                    </div>
                                )}
                            </div>
                            <div
                                className="text-gray-700 mt-4"
                                dangerouslySetInnerHTML={{
                                    __html: videos[currentVideoIndex].video_description || 'No description available.',
                                }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Enrollment Message for Not Enrolled */}


                {/* Tabs for Description, Curriculum, and FAQ */}
                <Tabs>
                    <TabList className="flex space-x-4 border-b border-gray-300">
                        <Tab className="py-2 px-4 focus:outline-none">Description</Tab>
                        <Tab className="py-2 px-4 focus:outline-none">Curriculum</Tab>
                        <Tab className="py-2 px-4 focus:outline-none">FAQ</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">About This Course</h3>
                            <div
                                className="text-gray-700 mb-4"
                                dangerouslySetInnerHTML={{
                                    __html: course.course_description || 'No description available.',
                                }}
                            ></div>
                            {course.course_img && (
                                <img
                                    src={course.course_img}
                                    alt={course.course_name}
                                    className="w-full h-auto rounded-lg shadow-md"
                                />
                            )}
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">Course Curriculum</h3>
                            <div
                                className="text-gray-700 mb-4"
                                dangerouslySetInnerHTML={{
                                    __html: course.course_curriculum || 'No curriculum available.',
                                }}
                            ></div>
                            {/* Example Curriculum - Replace with actual data if available */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-2">Week 1: Introduction</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Understanding the Basics</li>
                                    <li>Setting Up Your Environment</li>
                                    <li>First Project: Getting Started</li>
                                </ul>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold mb-2">FAQ</h3>
                            <Faq />
                        </div>
                    </TabPanel>
                </Tabs>


            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 lg:pl-8 mt-8 lg:mt-0">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Course Details</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <span>
                                <strong>Instructor:</strong>{' '}
                                {course.instructor?.user?.user_name || 'Unknown'}
                            </span>
                        </li>
                        <li className="flex items-center">
                            <span>
                                <strong>Subject:</strong> {course.category?.category_name || 'N/A'}
                            </span>
                        </li>
                        <li className="flex items-center">
                            <span>
                                <strong>Lectures:</strong> {videos.length} {videos.length === 1 ? 'Lecture' : 'Lectures'}
                            </span>
                        </li>
                        <li className="flex items-center">
                            <span>
                                <strong>Rating:</strong> {course.rating || '0.0'}
                            </span>
                        </li>
                        <li className="flex items-center">
                            <span>
                                <strong>Language:</strong> {course.language || 'N/A'}
                            </span>
                        </li>
                    </ul>




                        <div className="mt-6">
                            <h4 className="text-lg font-semibold mb-2">Course Sections</h4>
                            <ul className="space-y-2">
                                {videos.map((video, index) => (
                                    <li key={video.video_id}>
                                        <button
                                            onClick={() => handleSidebarClick(index)}
                                            className={`w-full text-left py-2 px-4 rounded-md ${index === currentVideoIndex
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                } transition duration-200`}
                                        >
                                            {video.video_title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>


                    {/* Locked Content Section for Not Enrolled Users */}
                    {videos.length <= 1 && (
                        <div className="mt-6">
                    
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewCourse;
// src/pages/Student/MyList/ViewCourse.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'react-apexcharts';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';
import { Breadcrumb } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

// StarRating Component for Reusability
const StarRating = ({ rating = 0 }) => {
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
    )};

const InstructorViewCourse = () => {
    const { courseId } = useParams(); // Extract courseId from URL
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [autoPlayNext, setAutoPlayNext] = useState(false);
    const [trendData, setTrendData] = useState([]); // State for trend data
    const [statistics, setStatistics] = useState({
        earnings: 0,
        numberOfStudents: 0,
    }); // State for statistics
    const videoRef = useRef(null);
    const navigate = useNavigate(); // For navigation if needed

    // Fetch course data and statistics
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Fetch main course data
                const courseResponse = await axios.get(
                    `http://localhost:8000/course/coursePage/${courseId}`,
                    { withCredentials: true }
                );
                const courseData = courseResponse.data;
                setCourse(courseData.course || null);
                setSections(courseData.content || []);
                if (courseData.content && courseData.content.length > 0) {
                    setCurrentVideoIndex(0);
                }

                // Fetch course statistics
                const statsResponse = await axios.get(
                    `http://localhost:8000/course/CourseViewStatistics/${courseId}`,
                    { withCredentials: true }
                );
                const statsData = statsResponse.data;
                setStatistics({
                    earnings: statsData.earnings || 0,
                    numberOfStudents: statsData.numberOfStudents || 0,
                });

                // Set trend data
                setTrendData(statsData.trendData || []);
            } catch (err) {
                console.error('Error fetching course data:', err.message);
                toast.error('Failed to load course data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    // Handle video end to auto-play next video
    const handleVideoEnd = () => {
        if (currentVideoIndex < sections.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
            setAutoPlayNext(true);
            // Scroll to top or to the video player if necessary
            // window.scrollTo({ top: 0, behavior: 'smooth' });
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
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <main className="md:ml-64 h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <p className="text-gray-500">Loading course data...</p>
                </main>
            </DashboardLayout>
        );
    }

    if (!course) {
        return (
            <DashboardLayout>
                <main className="md:ml-64 h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <p className="text-red-500">Course not found.</p>
                </main>
            </DashboardLayout>
        );
    }

    // Prepare data for ApexCharts (Bar Chart)
    const chartOptions = {
        chart: {
            id: 'students-trend',
            type: 'bar', // Changed from 'line' to 'bar'
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: trendData.map((data) => `${data.weekStart} - ${data.weekEnd}`),
            title: {
                text: 'Week',
            },
        },
        yaxis: {
            title: {
                text: 'Number of Students',
            },
            min: 0,
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val;
                },
            },
            theme: 'dark',
        },
    };

    const chartSeries = [
        {
            name: 'Students Registered',
            data: trendData.map((data) => data.registeredStudents),
        },
    ];

    return (
        <DashboardLayout>
            {/* Toast Container for React Toastify */}
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
            <main className="md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-6">
                {/* Breadcrumb Navigation */}
                <div className="mb-5">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>View Course Statistics</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                {/* Top Section - Course Info and Statistics */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {/* Left Side - Course Info */}
                    <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800      flex overflow-hidden transition-transform duration-300 transform    ">
                        <img
                            src={course.course_img || 'https://via.placeholder.com/300'}
                            alt={course.course_name || 'Course Image'}
                            className="w-1/2 object-cover"
                        />
                        <div className="p-4 w-1/2 flex flex-col justify-center">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                {course.course_name || 'Untitled Course'}
                            </h1>
                            <StarRating rating={course.rating} />
                        </div>
                    </div>

                    {/* Right Side - Statistics Cards */}
                    <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Number of Students */}
                        <div className="bg-white dark:bg-gray-800      p-4 flex items-center transition-transform duration-300 transform    ">
                            <div className="p-3 rounded-full bg-blue-500 text-white">
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5V10H2v10h5m10-5l-5 5m0-5l5 5"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {statistics.numberOfStudents}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Number of Students</p>
                            </div>
                        </div>

                        {/* Earnings from the Course */}
                        <div className="bg-white dark:bg-gray-800      p-4 flex items-center transition-transform duration-300 transform    ">
                            <div className="p-3 rounded-full bg-green-500 text-white">
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm0 10c-2.761 0-5-2.239-5-5h2c0 1.654 1.346 3 3 3s3-1.346 3-3h2c0 2.761-2.239 5-5 5z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    ${statistics.earnings}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Earnings</p>
                            </div>
                        </div>

                        {/* Number of Sections */}
                        <div className="bg-white dark:bg-gray-800      p-4 flex items-center transition-transform duration-300 transform    ">
                            <div className="p-3 rounded-full bg-purple-500 text-white">
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                    {sections.length}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Number of Sections</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="mb-6 bg-white dark:bg-gray-800      p-6 transition-transform duration-300 transform    ">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        Registered Students Trend
                    </h2>
                    {trendData && trendData.length > 0 ? (
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="bar" // Ensure the type is set to 'bar'
                            height={350}
                        />
                    ) : (
                        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">No trend data available.</p>
                        </div>
                    )}
                </div>

                {/* Sections and Videos */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Sections */}
                    <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800      p-4 transition-transform duration-300 transform    ">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Sections
                        </h3>
                        <ul className="space-y-2">
                            {sections.length > 0 ? (
                                sections.map((section, index) => (
                                    <li key={section.video_id}>
                                        <button
                                            onClick={() => handleSidebarClick(index)}
                                            className={`w-full text-left py-2 px-4 rounded-md ${
                                                index === currentVideoIndex
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            } transition-colors duration-200`}
                                        >
                                            {section.video_title || 'Untitled Section'}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-300">No sections available.</p>
                            )}
                        </ul>
                    </div>

                    {/* Video Display */}
                    <div className="w-full lg:w-3/4 bg-white dark:bg-gray-800      p-4 transition-transform duration-300 transform    ">
                        {sections.length > 0 ? (
                            <>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                    {sections[currentVideoIndex]?.video_title || 'Video'}
                                </h3>
                                <div className="relative pb-[56.25%] mb-4">
                                    {sections[currentVideoIndex]?.video_url ? (
                                        <video
                                            ref={videoRef}
                                            className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                                            controls
                                            src={sections[currentVideoIndex].video_url}
                                            preload="metadata"
                                            onEnded={handleVideoEnd}
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 shadow-lg">
                                            <p className="text-gray-700 dark:text-gray-300">Video not available.</p>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="text-gray-700 dark:text-gray-300"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            sections[currentVideoIndex]?.video_description ||
                                            'No description available.',
                                    }}
                                ></div>
                            </>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-300">No sections available for this course.</p>
                        )}
                    </div>
                </div>
            </main>
        </DashboardLayout>
    )};

export default InstructorViewCourse;
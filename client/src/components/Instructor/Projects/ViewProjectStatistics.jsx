import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import Chart from 'react-apexcharts';
import DashboardLayout from '../../DashboadLayouts/DashbordLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ViewProjectStatistics = () => {
    const { projectId } = useParams(); // Get projectId from route
    const navigate = useNavigate();
    const [statisticsData, setStatisticsData] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch project statistics and details when component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch statistics and project details concurrently
                const [statsResponse, projectResponse] = await Promise.all([
                    axios.get(
                        `http://localhost:8000/project/viewProjectsStatistics/${projectId}`,
                        {
                            withCredentials: true, // Include credentials
                        }
                    ),
                    axios.get(
                        `http://localhost:8000/project/projectDetails/${projectId}`,
                        {
                            withCredentials: true, // Include credentials
                        }
                    ),
                ]);

                setStatisticsData(statsResponse.data);
                setProjectDetails(projectResponse.data.projectDetails);
                console.log(projectResponse.data.projectDetails.required_skills);
            } catch (err) {
                setError('Failed to load data');
                toast.error(err.response?.data?.message || 'Error fetching data', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    if (loading) {
        return (
            <DashboardLayout>
                <main className="md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-6 flex items-center justify-center">
                    <p className="text-gray-800 dark:text-gray-100 text-xl animate-pulse">Loading...</p>
                </main>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <main className="md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-6 flex items-center justify-center">
                    <p className="text-red-500 dark:text-red-300 text-xl">{error}</p>
                </main>
            </DashboardLayout>
        );
    }

    // Chart configurations
    const applicationStatusData = {
        labels: ['Pending Students', 'Rejected Students', 'Accepted Students'],
        series: [
            statisticsData.numberOfPendingStudents,
            statisticsData.numberOfRejectedStudents,
            statisticsData.numberOfAcceptedStudents,
        ],
        colors: ['#F59E0B', '#EF4444', '#10B981'],
    };

    const taskProgressData = {
        categories: ['Pending Tasks', 'Completed Tasks', 'In Progress Tasks'],
        series: [
            {
                name: 'Tasks',
                data: [
                    statisticsData.numberOfPendingTasks,
                    statisticsData.numberOfCompletedTasks,
                    statisticsData.numberOfInProgressTasks,
                ],
            },
        ],
        colors: ['#F59E0B', '#10B981', '#3B82F6'],
    };

    const donutChartOptions = {
        chart: {
            type: 'donut',
        },
        labels: applicationStatusData.labels,
        colors: applicationStatusData.colors,
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ],
        legend: {
            position: 'right',
            offsetY: 0,
            height: 230,
        },
        animation: {
            animateGradually: {
                enabled: true,
                delay: 100
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        },
    };

    const barChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
            },
        },
        xaxis: {
            categories: taskProgressData.categories,
            labels: {
                style: {
                    colors: ['#6B7280'], // Gray-500
                    fontSize: '14px',
                },
            },
        },
        colors: taskProgressData.colors,
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        animation: {
            animateGradually: {
                enabled: true,
                delay: 100
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        },
    };

    return (
        <DashboardLayout>
            <ToastContainer />
            <main className="md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-6">
                {/* Breadcrumb */}
                <div className="mb-5">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Project Statistics</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                    {/* Project Information Card */}
                    <div className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-lg p-6    transition-transform duration-500  ">
                        {/* Project Image */}
                        <div className="relative">
                            <img
                                src={projectDetails.project_img}
                                alt={projectDetails.project_name}
                                className="w-full h-64 object-cover   "
                            />
                            {/* Optional Overlay */}
                            {/* <div className="absolute inset-0 bg-black bg-opacity-25   "></div> */}
                        </div>
                        {/* Project Details */}
                        <div className="mt-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {projectDetails.project_name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 break-words"
                            dangerouslySetInnerHTML={{ __html: projectDetails.project_description }}>
</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                        Required Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {projectDetails.required_skills && projectDetails.required_skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full transition-transform duration-300 transform hover:scale-110 animate-bounceIn"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                        {/* Total Tasks */}
                        <div className="bg-white dark:bg-gray-800 shadow-md p-6    flex items-center transition-transform duration-500   hover:shadow-lg">
                            <div className="p-4 rounded-full bg-blue-500 text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
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
                                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {statisticsData.numberOfAllTasks}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Total Tasks</p>
                            </div>
                        </div>

                        {/* Pending Tasks */}
                        <div className="bg-white dark:bg-gray-800 shadow-md p-6    flex items-center transition-transform duration-500   hover:shadow-lg">
                            <div className="p-4 rounded-full bg-yellow-500 text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
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
                                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {statisticsData.numberOfPendingTasks}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Pending Tasks</p>
                            </div>
                        </div>

                        {/* Accepted Students */}
                        <div className="bg-white dark:bg-gray-800 shadow-md p-6    flex items-center transition-transform duration-500   hover:shadow-lg">
                            <div className="p-4 rounded-full bg-green-500 text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m2 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                    {statisticsData.numberOfAcceptedStudents}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">Accepted Students</p>
                            </div>
                        </div>

                        {/* Project Workspace */}
                        <div
                            onClick={() => navigate(`/instructor/project/workSpace/${projectId}`)}
                            className="bg-[#350dc4] dark:bg-gray-800 shadow-md p-6    flex items-center cursor-pointer animate-bounce transition-transform duration-300 transform   hover:shadow-lg"
                        >
                            <div className="p-4 rounded-full bg-white text-[#350dc4]">
                                {/* Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
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
                                <p className="text-2xl font-bold text-white dark:text-gray-100">
                                    View Workspace
                                </p>
                                <p className="text-white dark:text-gray-300">Go to Project Workspace</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participants Section */}
                <div className=" dark:bg-gray-800 p-6    transition-transform duration-500   mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        Participants
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectDetails.participants.map((participant) => (
                            <div
                                key={participant.participant_id}
                                className="bg-gray-50 dark:bg-gray-700 shadow-md p-4    flex items-center space-x-4 transition-transform duration-500   hover:shadow-lg animate-slideUp"
                            >
                                {/* Participant Avatar */}
                                <div className="flex-shrink-0">
                                    {participant.student.user.user_img ? (
                                        <img
                                            src={participant.student.user.user_img}
                                            alt={participant.student.user.user_name}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold">
                                            {participant.student.user.user_name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                {/* Participant Info */}
                                <div>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                        {participant.student.user.user_name}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {participant.student.major || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Donut Chart */}
                    {/* <div className="bg-white dark:bg-gray-800 shadow-md p-6    transition-transform duration-500   hover:shadow-lg animate-fadeIn">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Application Status Distribution
                        </h2>
                        <Chart
                            options={donutChartOptions}
                            series={applicationStatusData.series}
                            type="donut"
                            height={350}
                        />
                    </div> */}

                    {/* Bar Chart */}
                    <div className="bg-white dark:bg-gray-800 shadow-md p-6    transition-transform duration-500   hover:shadow-lg animate-fadeIn">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Task Progress Overview
                        </h2>
                        <Chart
                            options={barChartOptions}
                            series={taskProgressData.series}
                            type="bar"
                            height={350}
                        />
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );

};

export default ViewProjectStatistics;
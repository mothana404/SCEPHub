// src/pages/Instructor/Dashboard.jsx

import React, { useEffect, useState, useRef } from 'react';
import { 
  LayoutGrid, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import DashboardLayout from '../../components/DashboadLayouts/DashbordLayout';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    activeCourses: { count: 0, courses: [] },
    completedProjects: { count: 0, projects: [] },
    upcomingDeadlines: [],
    endedProjects: 0,
    awaitProjects: 0,
    paymentMonth: 0,
    subscriptionStudents: 0,
    subscriptionPercentage: 0,
    projectStatistics: [],
  });

  // State variables to manage dropdown visibility
  const [isCompletedProjectsOpen, setIsCompletedProjectsOpen] = useState(false);
  const [isActiveCoursesOpen, setIsActiveCoursesOpen] = useState(false);
  const [isUpcomingDeadlinesOpen, setIsUpcomingDeadlinesOpen] = useState(false);

  // Refs for detecting clicks outside the dropdowns
  const completedProjectsRef = useRef(null);
  const activeCoursesRef = useRef(null);
  const upcomingDeadlinesRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/instructorStatistics', {
          withCredentials: true,
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle clicks outside the dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        completedProjectsRef.current &&
        !completedProjectsRef.current.contains(event.target)
      ) {
        setIsCompletedProjectsOpen(false);
      }
      if (
        activeCoursesRef.current &&
        !activeCoursesRef.current.contains(event.target)
      ) {
        setIsActiveCoursesOpen(false);
      }
      if (
        upcomingDeadlinesRef.current &&
        !upcomingDeadlinesRef.current.contains(event.target)
      ) {
        setIsUpcomingDeadlinesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Chart configurations with a more modern, sleek look
  const courseProgressOptions = {
    chart: {
      type: 'radialBar',
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          margin: 5,
        },
        hollow: {
          margin: 15,
          size: '65%'
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'solid',
      colors: ['#4CAF50']
    },
    labels: ['Course Progress']
  };

  const projectProgressOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '22%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Projects'],
    },
    fill: {
      opacity: 1,
      colors: ['#3B82F6']
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " projects"
        }
      }
    }
  };

  const projectProgressSeries = dashboardData.projectStatistics && dashboardData.projectStatistics.length > 0 
    ? dashboardData.projectStatistics
    : [{
        name: "Projects",
        data: [dashboardData.endedProjects]
      }];

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 min-h-screen bg-meta-2">
        <div className="container mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Courses Card */}
            <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6 transform transition-all hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <BookOpen className="text-blue-500 w-10 h-10 mb-3" />
                  <h3 className="text-gray-500 dark:text-gray-300 text-sm">Total Courses</h3>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {dashboardData.totalCourses}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Projects Card */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6 transform transition-all hover:scale-105 relative" 
              ref={completedProjectsRef}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CheckCircle2 className="text-green-500 w-10 h-10 mb-3" />
                  <h3 className="text-gray-500 dark:text-gray-300 text-sm">Completed Projects</h3>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {dashboardData.completedProjects.count}
                  </p>
                </div>
                {/* Dropdown Trigger */}
                {dashboardData.completedProjects.count > 0 && (
                  <div>
                    <button 
                      className="text-gray-500 hover:text-gray-700 focus:outline-none" 
                      onClick={() => setIsCompletedProjectsOpen(!isCompletedProjectsOpen)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {/* Dropdown Content */}
              {isCompletedProjectsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    {dashboardData.completedProjects.projects.map((project) => (
                      <li key={project.project_id}>
                        <a 
                          href={`/Instructor/Project/statistics/View/${project.project_id}`} 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setIsCompletedProjectsOpen(false)}
                        >
                          {project.project_name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Active Courses Card */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6 transform transition-all hover:scale-105 relative" 
              ref={activeCoursesRef}
            >
              <div className="flex items-center justify-between">
                <div>
                  <TrendingUp className="text-purple-500 w-10 h-10 mb-3" />
                  <h3 className="text-gray-500 dark:text-gray-300 text-sm">Active Courses</h3>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {dashboardData.activeCourses.count}
                  </p>
                </div>
                {/* Dropdown Trigger */}
                {dashboardData.activeCourses.count > 0 && (
                  <div>
                    <button 
                      className="text-gray-500 hover:text-gray-700 focus:outline-none" 
                      onClick={() => setIsActiveCoursesOpen(!isActiveCoursesOpen)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {/* Dropdown Content */}
              {isActiveCoursesOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    {dashboardData.activeCourses.courses.map((course) => (
                      <li key={course.course_id}>
                        <a 
                          href={`/Instructor/Courses/View/${course.course_id}`} 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setIsActiveCoursesOpen(false)}
                        >
                          {course.course_name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Upcoming Deadlines Card */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6 transform transition-all hover:scale-105 relative" 
              ref={upcomingDeadlinesRef}
            >
              <div className="flex items-center justify-between">
                <div>
                  <Clock className="text-red-500 w-10 h-10 mb-3" />
                  <h3 className="text-gray-500 dark:text-gray-300 text-sm">Upcoming Deadlines</h3>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {dashboardData.upcomingDeadlines.length}
                  </p>
                </div>
                {/* Dropdown Trigger */}
                {dashboardData.upcomingDeadlines.length > 0 && (
                  <div>
                    <button 
                      className="text-gray-500 hover:text-gray-700 focus:outline-none" 
                      onClick={() => setIsUpcomingDeadlinesOpen(!isUpcomingDeadlinesOpen)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {/* Dropdown Content */}
              {isUpcomingDeadlinesOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    {dashboardData.upcomingDeadlines.map((deadline, index) => (
                      <li key={index}>
                        <a 
                          href={`/projects/${deadline.project_id}`} 
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => setIsUpcomingDeadlinesOpen(false)}
                        >
                          {deadline.project_name} - Due: {new Date(deadline.end_date).toLocaleDateString()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Project Progress Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Project Progress
              </h2>
              <Chart
                options={projectProgressOptions}
                series={projectProgressSeries}
                type="bar"
                height={350}
              />
            </div>

            {/* Subscription Percentage Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-sm shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Subscription Percentage
              </h2>
              <Chart
                options={courseProgressOptions}
                series={[dashboardData.subscriptionPercentage]}
                type="radialBar"
                height={350}
              />
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Dashboard;
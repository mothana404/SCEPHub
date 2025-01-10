import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboadLayouts/DashbordLayout';
import Chart from 'react-apexcharts';
import axios from 'axios';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    activeCourses: 0,
    completedProjects: 0,
    upComingDeadlines: 0,
    profileCompleted: 0,
    projectsProgress: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/studentStatistics', {
            withCredentials: true,
          });
          console.log(response.data);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const courseProgressOptions = {
    chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '75%',
        },
      },
    },
    labels: ['Profile completed'],
  };

  const projectProgressOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '85%',
      },
    },
    tooltip: {
        enabled: true,
      },
  };

  const projectProgressSeries = dashboardData.projectsProgress && dashboardData.projectsProgress.length > 0 
        ? dashboardData.projectsProgress
        : [{
            "name": "you first future project",
            "data": [
                1
            ]
        }]; 

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 h-screen pt-4">
        <div className="flex flex-wrap -m-4 text-center">
          {/* Total Courses Card */}
          <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
            <div className="bg-white border-2 border-gray-200 dark:border-gray-700 px-4 py-6 rounded-lg dark:bg-gray-800">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-indigo-500 w-12 h-12 mb-3 inline-block"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 0110 10h-4a6 6 0 10-12 0H2a10 10 0 0110-10z"></path>
              </svg>
              <h2 className="title-font font-medium text-3xl text-gray-900 dark:text-white">
                {dashboardData.totalCourses}
              </h2>
              <p className="leading-relaxed dark:text-gray-300">Total Courses</p>
            </div>
          </div>

          {/* Completed Projects Card */}
          <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
            <div className="bg-white border-2 border-gray-200 dark:border-gray-700 px-4 py-6 rounded-lg dark:bg-gray-800">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-green-500 w-12 h-12 mb-3 inline-block"
                viewBox="0 0 24 24"
              >
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
              </svg>
              <h2 className="title-font font-medium text-3xl text-gray-900 dark:text-white">
                {dashboardData.completedProjects}
              </h2>
              <p className="leading-relaxed dark:text-gray-300">Completed Projects</p>
            </div>
          </div>

          {/* Active Courses Card */}
          <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
            <div className="bg-white border-2 border-gray-200 dark:border-gray-700 px-4 py-6 rounded-lg dark:bg-gray-800">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-blue-500 w-12 h-12 mb-3 inline-block"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h2 className="title-font font-medium text-3xl text-gray-900 dark:text-white">
                {dashboardData.activeCourses}
              </h2>
              <p className="leading-relaxed dark:text-gray-300">Active Courses</p>
            </div>
          </div>

          {/* Upcoming Deadlines Card */}
          <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
            <div className=" bg-white border-2 border-gray-200 dark:border-gray-700 px-4 py-6 rounded-lg dark:bg-gray-800">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-red-500 w-12 h-12 mb-3 inline-block"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3"></path>
                <path d="M20 12a8 8 0 10-16 0 8 8 0 0016 0z"></path>
              </svg>
              <h2 className="title-font font-medium text-3xl text-gray-900 dark:text-white">
                {dashboardData.upComingDeadlines}
              </h2>
              <p className="leading-relaxed dark:text-gray-300">Upcoming Deadlines</p>
            </div>
          </div>

          {/* Profile Completion and Project Progress Charts */}
          <div className="w-full mt-8 grid gap-4 md:grid-cols-2">
            <div className="bg-white p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Project Progress</h3>
              <Chart
                options={projectProgressOptions}
                series={projectProgressSeries}
                type="bar"
                height={350}
              />
            </div>
            <div className="bg-white p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Profile completed</h3>
              <Chart
                options={courseProgressOptions}
                series={[dashboardData.profileCompleted]}
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

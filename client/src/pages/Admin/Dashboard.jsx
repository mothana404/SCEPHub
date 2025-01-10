import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/DashboadLayouts/DashbordLayout';
import { CountUp } from 'countup.js';
import Chart from 'react-apexcharts';
import axios from 'axios';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalProjects: 0,
    monthPayment: 0,
    inProgressProjects: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/user/adminStatistics', {
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

  const Counter = ({ endValue }) => {
    const countUpRef = useRef(null);
  
    useEffect(() => {
      const countUp = new CountUp(countUpRef.current, endValue);
      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }, [endValue]);
  
    return <span ref={countUpRef}></span>;
  };


    const state = {
      options: {},
      series: [44, 55, 41, 17, 15],
  }

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

  const projectProgressSeries = [{
            "name": "you first future project",
            "data": [
                50
            ]
        }]; 

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 h-screen pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Courses */}
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h2 className="text-2xl font-bold text-gray-700"> <Counter endValue={dashboardData.totalCourses} />+</h2>
            <p className="text-gray-500 mt-2">Total Courses</p>
          </div>

          {/* Total Projects */}
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h2 className="text-2xl font-bold text-gray-700"> <Counter endValue={dashboardData.totalProjects} /></h2>
            <p className="text-gray-500 mt-2">Total Projects</p>
          </div>

          {/* Monthly Payment */}
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h2 className="text-2xl font-bold text-gray-700">${ <Counter endValue={dashboardData.monthPayment} />}</h2>
            <p className="text-gray-500 mt-2">This Month Payment</p>
          </div>

          {/* Upcoming Projects */}
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h2 className="text-2xl font-bold text-gray-700"> <Counter endValue={dashboardData.inProgressProjects} /></h2>
            <p className="text-gray-500 mt-2">in Progress Projects</p>
          </div>
        </div>

                  {/* Profile Completion and Project Progress Charts */}
                  <div className="w-full mt-8 grid gap-4 md:grid-cols-2">
            <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Project Progress</h3>
              <Chart
                options={projectProgressOptions}
                series={projectProgressSeries}
                type="bar"
                height={350}
              />
            </div>
            <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Profile completed</h3>
              <div className="donut">
        <Chart options={state.options} series={state.series} type="donut" width="380" />
      </div>
            </div>
          </div>
      </main>
    </DashboardLayout>
  );
}

export default Dashboard;

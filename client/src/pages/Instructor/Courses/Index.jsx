// src/pages/Instructor/Courses/Index.js

import React from 'react';
import CoursesList from '../../../components/Instructor/Courses/CoursesList';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';
import Breadcrumb from '../../../components/Breadcrump';

function Index() {
    return (
        <DashboardLayout>
            <main className=" md:ml-64 h-full bg-meta-2 dark:bg-gray-900 transition-colors duration-300">
                <div className="react-wrapper">
                    {/* Breadcrumb Section */}
                    <div className='my-5'>
                        <Breadcrumb pageTitle="My Courses List" />
                    </div>

                    {/* Courses List Section */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
                        <CoursesList />
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
}

export default Index;

import React from 'react'

import InstructorsList from '../../components/Admin/InstructorsList'
import Breadcrumb from '../../components/Breadcrump'
import DashboardLayout from '../../components/DashboadLayouts/DashbordLayout'
function Instructors() {
  return (
    <DashboardLayout>
    <main className="p-4 md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="react-wrapper">
            {/* Breadcrumb Section */}
            <div className='mb-5'>
                <Breadcrumb pageTitle="Instructors Management" />
            </div>

            {/* Courses List Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
                <InstructorsList />
            </div>
        </div>
    </main>
    </DashboardLayout>
  )
}

export default Instructors
import React from 'react'
import DashboardLayout from '../../components/DashboadLayouts/DashbordLayout'
import Breadcrumb from '../../components/Breadcrump'
import AdminList from '../../components/Admin/AdminList'

function Admins() {
  return (
    <DashboardLayout>
    <main className=" md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="react-wrapper">
            {/* Breadcrumb Section */}
            <div className='my-5'>
                <Breadcrumb pageTitle="Administrators Management" />
            </div>

            {/* Courses List Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
                <AdminList />
            </div>
        </div>
    </main>
    </DashboardLayout>
  )
}

export default Admins
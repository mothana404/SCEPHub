import React from 'react'
import DashboardLayout from '../../components/DashboadLayouts/DashbordLayout'
import Breadcrumb from '../../components/Breadcrump'
import CategoriesList from '../../components/Admin/CategoriesList'

function Categories() {
  return (
    <DashboardLayout>
    <main className=" md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="react-wrapper">
            {/* Breadcrumb Section */}
            <div className='my-5'>
                <Breadcrumb pageTitle="Categories Management" />
            </div>

            {/* Courses List Section */}
            <div className="bg-gray-50 dark:bg-gray-800  p-4 sm:p-6">
                <CategoriesList />
            </div>
        </div>
    </main>
    </DashboardLayout>
  )
}

export default Categories
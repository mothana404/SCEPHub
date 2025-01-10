import React from 'react';
import AdminDashboard from '../pages/Admin/Dashboard';
import InstructorDashboard from '../pages/Instructor/Dashboard';
import StudentDashboard from '../pages/Student/Dashboard';

function Dashboard() {
    // Retrieve auth data from local storage
    const authData = JSON.parse(localStorage.getItem('auth'));

    // Access the role from the stored auth data
    const role = authData?.role;

    return (
        <div>
            {role === 1 && <StudentDashboard />}
            {role === 2 && <InstructorDashboard />}
            {role === 3 && <AdminDashboard />}
        </div>
    );
}

export default Dashboard;

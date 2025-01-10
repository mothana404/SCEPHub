// src/components/Instructor/Courses/CoursesList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilIcon, CheckIcon, XIcon } from '@heroicons/react/solid';
import { EyeIcon } from 'lucide-react';

function CoursesList() {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [togglingCourseId, setTogglingCourseId] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, [search]);

    const fetchCourses = () => {
        axios.get(`http://localhost:8000/course/instructorCourses?course_name=${search}`, { withCredentials: true })
            .then((response) => {
                if (response.status === 200) {
                    setCourses(response.data);
                }
            })
            .catch((error) => {
                console.error('There was an error fetching the courses!', error);
                toast.error('Failed to fetch courses.', {
                    position: "top-right",
                    autoClose: 5000,
                });
            });
    };

    const togglePublishStatus = async (courseID) => {
        setTogglingCourseId(courseID);
        try {
            const response = await axios.put(
                `http://localhost:8000/course/activateCourse/${courseID}`,
                {}, 
                { withCredentials: true }
            );

            toast.success(response.data);

            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course.course_id === courseID
                        ? { ...course, is_deleted: !course.is_deleted }
                        : course
                )
            );
        } catch (error) {
            console.error('Error toggling publish status:', error);
            toast.error('Failed to toggle publish status. Please try again.');
        } finally {
            setTogglingCourseId(null);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="container mx-auto py-6">
            <ToastContainer />
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                {/* Search Input */}
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
                    <input
                        type="text"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#0d3656] transition duration-200"
                        placeholder="Search courses..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Add Course Button */}
                <NavLink to='/instructor/create/course' className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#152c5a] to-[#1e4d8b] text-white font-semibold rounded-lg hover:bg-gradient-to-l hover:bg-white/20  focus:outline-none focus:ring-2 focus:ring-[#051941] transition duration-200">
                    Add Course
                </NavLink>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto shadow-lg sm:rounded-lg bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-[#152c5a] to-[#1e4d8b] text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                                Thumbnail
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                                Course Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden sm:table-cell">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden md:table-cell">
                                Rating
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course.course_id} className="hover:bg-gray-100 transition duration-150">
                                    {/* Thumbnail */}
                                    <td className="px-10 py-4 whitespace-nowrap">
                                        <img
                                            src={course.course_img}
                                            alt={course.course_name}
                                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                                        />
                                    </td>

                                    {/* Course Name */}
                                    <th scope="row" className="flex justify-center align-middle items-center  px-6 py-4 font-medium text-gray-900 whitespace-nowrap text-sm sm:text-base">
                                        {course.course_name}
                                    </th>

                                    {/* Category */}
                                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell text-sm sm:text-base">
                                        {course.category.category_name}
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell text-sm sm:text-base">
                                        {course.rating}
                                    </td>

                                    {/* Action */}
                                    <td className="px-6 py-4 text-center space-x-4">
                                        <NavLink to={`/Instructor/Courses/View/${course.course_id}`} className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium transition duration-200">
                                            <EyeIcon className="h-5 w-5 inline-block mr-1" />
                                            View
                                        </NavLink>
                                        <NavLink to={`/Instructor/Courses/Edit/${course.course_id}`} className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium transition duration-200">
                                            <PencilIcon className="h-5 w-5 inline-block mr-1" />
                                            Edit
                                        </NavLink>

                                        <button
                                            onClick={() => togglePublishStatus(course.course_id)}
                                            className={` dark:text-red-500 hover:underline text-sm sm:text-base ${course.is_deleted ? 'text-green-500 ' : 'text-red-600'}`}
                                            disabled={togglingCourseId === course.course_id}
                                        >
                                            {togglingCourseId === course.course_id ? (
                                                <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                </svg>
                                            ) : course.is_deleted ? (
                                                <CheckIcon className="h-5 w-5 inline-block mr-1" />
                                            ) : (
                                                <XIcon className="h-5 w-5 inline-block mr-1" />
                                            )}
                                            {course.is_deleted ? 'Publish' : 'Unpublish'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No courses found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CoursesList;

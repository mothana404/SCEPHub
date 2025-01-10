// src/pages/Student/Courses/CourseDetails.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrump'; // Ensure the path is correct
import CourseDetailsMain from './CourseDetailsMain';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';

const CourseDetails = () => {
  const location = useLocation();
  const courseURL = location.pathname.split('/');

  // Assuming the course ID is the third segment in the URL
  const courseID = Number(courseURL[2]);

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]); // New state for content
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false); // State for enrollment status

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/course/coursePage/${courseID}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCourse(data.course);
        setContent(data.content); // Set the content state
        setIsEnrolled(data.enrollments > 0); // Determine enrollment status

        // Fetch related courses based on category
        // Ensure your backend has an endpoint for related courses
        const relatedResponse = await fetch(`http://localhost:8000/course/relatedCourses/${data.course.course_category}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedCourses(relatedData.courses); // Adjust based on API response
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseID]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center">Loading...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center">Course not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="p-4 md:ml-64 h-full pt-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <Breadcrumb pageTitle={course.course_name} />

          <CourseDetailsMain
            course={course}
            content={content} // Correctly passing 'content'
            allCourses={relatedCourses} // Passing related courses
            isEnrolled={isEnrolled} // Passing enrollment status
          />
        </div>
      </main>
    </DashboardLayout>
  );
};

export default CourseDetails;
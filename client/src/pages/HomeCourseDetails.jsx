import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function HomeCourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState(null);
  const [enrollments, setEnrollments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/course/coursePage/${id}`);
        setCourse(response.data.course);
        setContent(response.data.content);
        setEnrollments(response.data.enrollments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
<>
  <NavBar />
  <motion.div
    initial={{ opacity: 0, y: 100 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.0 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="relative rounded-2xl bg-white p-8 shadow-lg">
          <div className="absolute top-0 right-0 h-24 w-1/3 bg-gradient-to-l from-blue-50 to-transparent rounded-tr-2xl"></div>
          
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              {course.category.category_name}
            </span>
          </div>

          {/* Course Title and Description */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.course_name}</h1>
          <div className="prose prose-lg text-gray-500 mb-6" dangerouslySetInnerHTML={{ __html: course.course_description }} />

          {/* Course Stats */}
          <div className="flex flex-wrap gap-6 items-center mb-6">
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-blue-600 text-white font-semibold rounded-lg">
                {course.rating}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <svg
                      key={index}
                      className={`h-5 w-5 ${
                        ratingValue <= Math.floor(course.rating)
                          ? "text-yellow-400"
                          : ratingValue - course.rating < 1 && ratingValue - course.rating > 0
                          ? "text-yellow-300"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  );
                })}
              </div>
            </div>

            {/* Enrollments */}
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">{enrollments} Students enrolled</span>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 border-t border-gray-100 pt-6">
            <img
              src={course.instructor.user.user_img || 'default-avatar.png'}
              alt={course.instructor.user.user_name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">Created by {course.instructor.user.user_name}</p>
              <p>Last updated {new Date(course.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                Course Content
              </button>
            </nav>
          </div>

          {/* Course Sections */}
          <div className="mt-6 space-y-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <details className="group">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">Course Sections</h2>
                  <svg
                    className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <div className="border-t border-gray-200 px-6 py-4">
                  <ul className="space-y-4">
                    {content.map((video, index) => (
                      <li
                        key={video.video_id}
                        className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{video.video_title}</h3>
                          <p className="text-sm text-gray-500">
                            {video.video_description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </p>
                        </div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  <Footer />
</>
  );
}

export default HomeCourseDetails;

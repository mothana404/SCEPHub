import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function HomeTopCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/course/topRatingCourses');
        setCourses(response.data); 
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const renderRating = (rating) => {
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const fullStars = Array(filledStars).fill(
      <svg
        className="shrink-0 size-5 text-yellow-400 dark:text-yellow-600"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
      </svg>
    );

    const halfStar = hasHalfStar && (
      <svg
        className="shrink-0 size-5 text-yellow-400 dark:text-yellow-600"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592l-4.389-2.256-4.389 2.256c-.386.198-.824-.149-.746-.592l.83-4.73-3.522-3.356c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792z"></path>
      </svg>
    );

    const emptyStars = Array(5 - filledStars - (hasHalfStar ? 1 : 0)).fill(
      <svg
        className="shrink-0 size-5 text-gray-300 dark:text-neutral-600"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
      </svg>
    );

    return [...fullStars, halfStar, ...emptyStars];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 font-sans">
        <div className="flex items-end justify-between mb-10">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl font-extrabold leading-tight text-black sm:text-4xl lg:text-3xl">
              Top Rated Courses
            </h2>
            <p className="max-w-xl mx-auto mt-1 text-base leading-relaxed text-gray-600 lg:mx-0">
              Check out our top rated courses.
            </p>
          </div>
        </div>

        <div class="m-5">
        {courses.map((course) => (
            <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div key={course.course_id} class="group mx-2 mt-10 grid max-w-screen-md grid-cols-1 space-x-8 overflow-hidden rounded-lg border text-gray-700 shadow transition hover:shadow-lg sm:mx-auto sm:grid-cols-5">
            <Link to={`/CourseDetails/${course.course_id}`} class="col-span-2 text-left text-gray-600 hover:text-gray-700">
                <div class="group relative h-56 w-full overflow-hidden">
                <img src={`${course.course_img}`} alt={`${course.course_img}`} class="h-full w-full border-none object-cover text-gray-700 transition group-hover:scale-125" />
                <span class="absolute top-2 left-2 rounded-full bg-yellow-200 px-2 text-xs font-semibold text-yellow-600">{course.category.category_name}</span>
                <img src="/images/AnbWyIjnwNbW9Wz6c_cja.svg" class="absolute inset-1/2 w-10 max-w-full -translate-x-1/2 -translate-y-1/2 transition group-hover:scale-125" alt="" />
                </div>
            </Link>
            <div class="col-span-3 flex flex-col space-y-3 pr-8 text-left">
                <Link to={`/CourseDetails/${course.course_id}`} class="mt-3 overflow-hidden text-2xl font-semibold">
                    {course.course_name.length > 20
                    ? course.course_name.slice(0, 20) + ' ...'
                    : course.course_name}
                </Link>
                {/* <p class="overflow-hidden text-sm line-clamp-2">
                    {course.course_description.length > 100
                    ? course.course_description.slice(0, 100) + ' ...'
                    : course.course_description}
                </p> */}
                <p class="text-gray-500"
                         dangerouslySetInnerHTML={{ __html: course.course_description.length > 120
                            ? course.course_description.slice(0, 120) + '...'
                            : course.course_description }}
                        ></p>
                <Link to={`/CourseDetails/${course.course_id}`} class="text-sm font-semibold text-gray-500 hover:text-gray-700">{course.instructor.user.user_name}</Link>
                <div class="flex flex-col text-gray-700 sm:flex-row">
                <div class="flex h-fit space-x-2 text-sm font-medium">
                    <div class="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">160 Enrolled</div>
                    <div className="flex items-center">
                  {renderRating(course.rating)}
                </div>
                </div>
                
                <Link to={`/CourseDetails/${course.course_id}`} class="my-5 rounded-md px-5 py-2 text-center transition hover:scale-105 bg-blue-600 text-white sm:ml-auto">Show Details</Link>
                </div>
            </div>
            </div>
            </motion.div>
             ))}
        </div>
      </div>
    </motion.div>
  );
}

export default HomeTopCourses;

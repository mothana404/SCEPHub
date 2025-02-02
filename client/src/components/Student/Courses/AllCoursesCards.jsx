import React from 'react';
import { Link } from 'react-router-dom';

const AllCoursesCards = (props) => {
    const { courseID, courseImg, courseTitle, courseAuthor, courseType, courseLesson, courseDuration, courseReview } = props;

    return (
        <div className="bg-white max-h-72 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <div className="relative h-40 md:h-32 lg:h-40">
                <img className="w-full h-full object-cover" src={courseImg} alt={courseTitle} />
                {/* <span className="absolute top-2 left-2 bg-[#152c5a] text-white text-xs font-semibold py-1 px-2 rounded">
                    {courseType || 'Beginner'}
                </span> */}
            </div>
            <div className="p-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-1 hover:underline transition-colors duration-300">
                    <Link to={`/course/${courseID}`}>{courseTitle || 'Design Course'}</Link>
                </h4>
                <p className="text-xs text-gray-500">{courseAuthor}</p>
                <div className="flex items-center text-xs text-yellow-400 mt-1">
                    <span className="font-semibold mr-1">{courseReview}</span>
                    <div>
                        {'★'.repeat(Math.round(courseReview))}
                        {'☆'.repeat(5 - Math.round(courseReview))}
                    </div>
                </div>
                <ul className="text-xs text-gray-500 mt-2">
                    <li>{courseLesson} Lessons</li>
                    <li>{courseDuration}</li>
                </ul>
            </div>
        </div>
    );
}

export default AllCoursesCards;

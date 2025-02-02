import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineClipboardCheck, HiOutlineClock, HiOutlineEye } from 'react-icons/hi';
import PropTypes from 'prop-types';
import axios from 'axios';

function ProjectsCards({ project }) {
  const [uncompletedTasks, setUncompletedTasks] = useState(0);
  const [closestTime, setClosestTime] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/project/student/tasksNumber/${project.project_id}`,
          { withCredentials: true }
        );
        setUncompletedTasks(response.data.UncompletedTasks);
        setClosestTime(response.data.ClosestTimeToSubmit);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    fetchData();
  }, [project.project_id]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString || new Date(dateString) <= new Date()) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
          src={project.project_img || 'https://via.placeholder.com/400x200'}
          alt={project.project_name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h2 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
          {project.project_name}
        </h2>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Tasks Status */}
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center space-x-2">
            <HiOutlineClipboardCheck className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Uncompleted Tasks</span>
          </div>
          <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
            {uncompletedTasks}
          </span>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center space-x-2">
            <HiOutlineClock className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Next Deadline</span>
          </div>
          <span className="text-sm font-medium">
            {formatDate(closestTime)}
          </span>
        </div>

        {/* Action Button */}
        <Link 
          to={`/student/project/tasks/${project.project_id}`}
          className="mt-4 block"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center space-x-2 bg-[#041643] text-white py-2.5 px-4 rounded-lg font-medium transition-colors hover:bg-[#082265]"
          >
            <HiOutlineEye className="w-5 h-5" />
            <span>View Project</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

ProjectsCards.propTypes = {
  project: PropTypes.shape({
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired,
    project_img: PropTypes.string,
  }).isRequired,
};

export default ProjectsCards;
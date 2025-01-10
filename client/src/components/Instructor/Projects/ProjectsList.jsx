// ProjectsList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/category', { withCredentials: true });
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [search]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/project/instructorProjects?project_name=${search}`, { withCredentials: true });
      if (response.status === 200) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('There was an error fetching the projects!', error);
      toast.error('Failed to fetch projects.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await axios.put(`http://localhost:8000/project/deleteProject/${projectId}`, {}, { withCredentials: true });
        if (response.status === 200) {
          setProjects(prevProjects => prevProjects.filter(project => project.project_id !== projectId));
          toast.success('Project deleted successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error('There was an error deleting the project!', error);
        toast.error('Failed to delete project.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleEditProject = (projectId) => {
    navigate(`/instructor/edit/project/${projectId}`);
  };

  return (
    <div className="container mx-auto py-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {/* Search Input */}
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <input
            type="text"
            className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#0d3656] transition duration-200"
            placeholder="Search projects..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Add Project Button */}
        <NavLink to='/instructor/create/project' className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#152c5a] to-[#1e4d8b] text-white font-semibold rounded-lg hover:bg-gradient-to-l hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#051941] transition duration-200">
          Add Project
        </NavLink>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto shadow-lg sm:rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-[#152c5a] to-[#1e4d8b] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Thumbnail</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden sm:table-cell">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden sm:table-cell">End Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.project_id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  {/* Thumbnail */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.project_img ? (
                      <img
                        src={project.project_img}
                        alt={project.project_name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-200 rounded-md">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </td>

                  {/* Project Name */}
                  <th className="text-start px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap text-sm sm:text-base">
                    {project.project_name}
                  </th>

                  {/* Category */}
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-300 hidden sm:table-cell text-sm sm:text-base">
                    {project.category.category_name}
                  </td>

                  {/* Start Date */}
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-300 hidden sm:table-cell text-sm sm:text-base">
                    {new Date(project.start_date).toLocaleDateString('en-CA')}
                  </td>

                  {/* End Date */}
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-300 hidden sm:table-cell text-sm sm:text-base">
                    {new Date(project.end_date).toLocaleDateString('en-CA')}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-center space-x-2">
                    <Link
                      className="text-blue-600 dark:text-[#152c5a] hover:underline text-sm sm:text-base"
                      to={`/Instructor/Project/statistics/View/${project.project_id}`}
                    >
                      View
                    </Link>
                    <button
                      className="text-blue-600 dark:text-[#152c5a] hover:underline text-sm sm:text-base"
                      onClick={() => handleEditProject(project.project_id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 dark:text-red-500 hover:underline text-sm sm:text-base"
                      onClick={() => handleDeleteProject(project.project_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectsList;
// CreateProject.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../DashboadLayouts/DashbordLayout';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register FilePond plugins
registerPlugin(FilePondPluginFileValidateType);

const CreateProject = () => {
  // State Variables
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    project_name: '',
    project_category: '',
    project_description: '',
    imageFiles: [], // For FilePond
    start_date: null, // Using DatePicker
    end_date: null,   // Using DatePicker
    required_skills: '',
  });
  const [errors, setErrors] = useState({
    project_name: '',
    project_category: '',
    project_description: '',
    imageFiles: '',
    start_date: '',
    end_date: '',
    required_skills: '',
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/category', {
          withCredentials: true,
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  // Handle image file uploads with FilePond
  const handleImageUpdate = (fileItems) => {
    setFormData(prevState => ({
      ...prevState,
      imageFiles: fileItems.map(fileItem => fileItem.file),
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      imageFiles: '',
    }));
  };

  // Handle date changes with react-datepicker
  const handleDateChange = (date, field) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: date,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      project_name: '',
      project_category: '',
      project_description: '',
      imageFiles: '',
      start_date: '',
      end_date: '',
      required_skills: '',
    };
    let isValid = true;

    if (!formData.project_name.trim()) {
      newErrors.project_name = 'Project name is required.';
      isValid = false;
    }

    if (!formData.project_category) {
      newErrors.project_category = 'Please select a category.';
      isValid = false;
    }

    if (!formData.project_description.trim()) {
      newErrors.project_description = 'Project description is required.';
      isValid = false;
    }

    if (formData.imageFiles.length === 0) {
      newErrors.imageFiles = 'Please upload a project image.';
      isValid = false;
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required.';
      isValid = false;
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required.';
      isValid = false;
    }

    if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      newErrors.end_date = 'End date cannot be before start date.';
      isValid = false;
    }

    if (!formData.required_skills.trim()) {
      newErrors.required_skills = 'Please specify required skills.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    // Prepare FormData
    const payload = new FormData();
    payload.append('project_name', formData.project_name);
    payload.append('project_category', formData.project_category);
    payload.append('project_description', formData.project_description);
    payload.append('start_date', formData.start_date.toISOString().split('T')[0]); // YYYY-MM-DD
    payload.append('end_date', formData.end_date.toISOString().split('T')[0]);     // YYYY-MM-DD

    // Append required_skills as JSON string
    const skillsArray = formData.required_skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
    payload.append('required_skills', JSON.stringify(skillsArray));

    // Append image file
    if (formData.imageFiles.length > 0) {
      payload.append('file', formData.imageFiles[0]); // Ensure 'file' matches backend field
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/project/instructor/createProject',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      console.log('Project created successfully:', response.data);
      toast.success('Project created successfully!');
      // Redirect after a short delay to allow the toast to show
      setTimeout(() => {
        window.location.href = '/instructor/projects';
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <main className="md:ml-80">
        <div className='w-full max-w-4xl mx-auto border p-6 rounded-xl bg-white shadow-md'>
          {/* Toast Notifications */}
          <ToastContainer />

          <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-black mb-6">Create Project</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              {/* Project Name */}
              <div className="p-2">
                <input
                  type="text"
                  id="project_name"
                  name="project_name"
                  placeholder="Project Name"
                  value={formData.project_name}
                  onChange={handleChange}
                  className={`bg-gray-100 block w-full rounded-md border ${errors.project_name ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2`}
                />
                {errors.project_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.project_name}</p>
                )}
              </div>

              {/* Project Category */}
              <div className="p-2">
                <select
                  id="project_category"
                  name="project_category"
                  value={formData.project_category}
                  onChange={handleChange}
                  className={`bg-gray-100 block w-full rounded-md border ${errors.project_category ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
                {errors.project_category && (
                  <p className="text-red-500 text-sm mt-1">{errors.project_category}</p>
                )}
              </div>

              {/* Project Description */}
              <div className="p-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                  Project Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.project_description}
                  onChange={(content) => {
                    setFormData(prevState => ({
                      ...prevState,
                      project_description: content,
                    }));
                    setErrors(prevErrors => ({
                      ...prevErrors,
                      project_description: '',
                    }));
                  }}
                  placeholder="Enter project description"
                  className={`bg-gray-100 block w-full rounded-md border ${errors.project_description ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2`}
                />
                {errors.project_description && (
                  <p className="text-red-500 text-sm mt-1">{errors.project_description}</p>
                )}
              </div>

              {/* Image Upload with FilePond */}
              <div className="p-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                  Project Image
                </label>
                <FilePond
                  allowMultiple={false}
                  files={formData.imageFiles}
                  onupdatefiles={handleImageUpdate}
                  name="file" // Ensure this matches backend field name
                  labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                  acceptedFileTypes={['image/*']}
                  className="dark:bg-gray-100"
                />
                {errors.imageFiles && (
                  <p className="text-red-500 text-sm mt-1">{errors.imageFiles}</p>
                )}
              </div>

              <div className='flex '>
                {/* Start Date */}
                <div className="p-2  w-50">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                    Start Date
                  </label>
                  <DatePicker
                    selected={formData.start_date}
                    onChange={(date) => handleDateChange(date, 'start_date')}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select start date"
                    className={`bg-gray-100 block w-full rounded-md border ${errors.start_date ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2`}
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                  )}
                </div>

                {/* End Date */}
                <div className="p-2  w-50">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                    End Date
                  </label>
                  <DatePicker
                    selected={formData.end_date}
                    onChange={(date) => handleDateChange(date, 'end_date')}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select end date"
                    className={`bg-gray-100 block w-full rounded-md border ${errors.end_date ? 'border-red-500' : 'border-gray-300'
                      } shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2`}
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                  )}
                </div>
              </div>
              {/* Required Skills */}
              <div className="p-2">
                <input
                  type="text"
                  id="required_skills"
                  name="required_skills"
                  placeholder="Required Skills (comma-separated)"
                  value={formData.required_skills}
                  onChange={handleChange}
                  className={`bg-gray-100 block w-full rounded-md border ${errors.required_skills ? 'border-red-500' : 'border-gray-300'
                    } shadow-sm focus:border-[#5126d1] focus:ring-[#3e65c9] focus:ring-opacity-50 h-12 p-2`}
                />
                {errors.required_skills && (
                  <p className="text-red-500 text-sm mt-1">{errors.required_skills}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="col-span-full mt-6 p-2">
                <button
                  type="submit"
                  className="block w-full bg-[#354dd8] hover:bg-[#3d68f4] text-white font-bold py-3 px-4 rounded-full"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default CreateProject;
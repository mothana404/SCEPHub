import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-video-preview/dist/filepond-plugin-video-preview.css';

// Import FilePond and its plugins
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginVideoPreview from 'filepond-plugin-video-preview';
import Breadcrumb from '../../../components/Breadcrump';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register the FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginVideoPreview
);

function Create() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [step, setStep] = useState(1);
  const [sectionCount, setSectionCount] = useState(0); // Track number of sections added
  const [courseId, setCourseId] = useState(null); // To store the created course_id
  const [courseDetails, setCourseDetails] = useState({
    name: '',
    description: '',
    category: '',
    image: [], 
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/category`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setCategories(response.data);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the categories!', error);
        toast.error('Failed to fetch categories.', {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }, []);

  // Error states for course details
  const [courseErrors, setCourseErrors] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
  });

  // State for the current section
  const [currentSection, setCurrentSection] = useState({
    video_title: '',
    videoDescription: '',
    videoFile: [],
  });

  // Error states for the current section
  const [sectionErrors, setSectionErrors] = useState({
    video_title: '',
    videoDescription: '',
    videoFile: '',
  });

  // Handle changes in course details form fields
  const handleCourseDetailsChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    // Validate the specific field
    let error = '';
    if (name === 'name' && !value.trim()) {
      error = 'Course name is required';
    }
    if (name === 'category' && !value.trim()) {
      error = 'Please select a category';
    }
    setCourseErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Handle Quill editor change for Course Description
  const handleCourseDescriptionChange = (event) => {
    const content = event.target.value;  // Get the value from the event object
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      description: content,
    }));
  
    // Error validation: check if the content is empty
    const error = content === '' ? 'Course description is required' : '';
    setCourseErrors((prevErrors) => ({
      ...prevErrors,
      description: error,
    }));
  };

  // Handle image file upload for course thumbnail
  const handleImageFileUpdate = (fileItems) => {
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      image: fileItems.map((fileItem) => fileItem.file),
    }));

    // Validate image upload
    const error = fileItems.length === 0 ? 'Please upload a thumbnail image' : '';
    setCourseErrors((prevErrors) => ({
      ...prevErrors,
      image: error,
    }));
  };

  // Handle changes in the current section form fields
  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setCurrentSection((prevSection) => ({
      ...prevSection,
      [name]: value,
    }));

    // Validate the specific field
    let error = '';
    if (name === 'video_title' && !value.trim()) {
      error = 'Video title is required';
    }
    setSectionErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Handle Quill editor change for Video Description
  const handleVideoDescriptionChange = (content) => {
    setCurrentSection((prevSection) => ({
      ...prevSection,
      videoDescription: content,
    }));

    // Simple validation: check if content is not empty
    const error = content.replace(/<(.|\n)*?>/g, '').trim() === '' ? 'Video description is required' : '';
    setSectionErrors((prevErrors) => ({
      ...prevErrors,
      videoDescription: error,
    }));
  };

  // Handle video file upload
  const handleVideoFileUpdate = (fileItems) => {
    setCurrentSection((prevSection) => ({
      ...prevSection,
      videoFile: fileItems.map((fileItem) => fileItem.file),
    }));

    // Validate video upload
    const error = fileItems.length === 0 ? 'Please upload a video' : '';
    setSectionErrors((prevErrors) => ({
      ...prevErrors,
      videoFile: error,
    }));
  };

  // Helper function to validate all course fields
  const validateCourse = () => {
    const errors = {};
    if (!courseDetails.name.trim()) {
      errors.name = 'Course name is required';
    }
    if (courseDetails.description.replace(/<(.|\n)*?>/g, '').trim() === '') {
      errors.description = 'Course description is required';
    }
    if (!courseDetails.category.trim()) {
      errors.category = 'Please select a category';
    }
    if (courseDetails.image.length === 0) {
      errors.image = 'Please upload a thumbnail image';
    }
    setCourseErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to validate the current section
  const validateCurrentSection = () => {
    const errors = { video_title: '', videoDescription: '', videoFile: '' };
    const section = currentSection;

    if (!section.video_title.trim()) {
      errors.video_title = 'Video title is required';
    }
    if (section.videoDescription.replace(/<(.|\n)*?>/g, '').trim() === '') {
      errors.videoDescription = 'Video description is required';
    }
    if (section.videoFile.length === 0) {
      errors.videoFile = 'Please upload a video';
    }

    setSectionErrors(errors);

    return Object.values(errors).every((error) => error === '');
  };

  // Function to handle course details submission
  const handleCourseSubmit = async () => {
    if (!validateCourse()) {
      toast.error('Please fix the errors in the form.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('course_name', courseDetails.name);
    formData.append('course_description', courseDetails.description);
    formData.append('course_category', courseDetails.category);

    // Append thumbnail image
    if (courseDetails.image.length > 0) {
      formData.append('file', courseDetails.image[0]);
    }

    try {
      const response = await axios.post('http://localhost:8000/course', formData, {
        withCredentials: true,
      });
      if (response.status === 201) {
        const data = response.data; 
        if (data.status === 'success') {
          toast.success('Course created successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
          setCourseId(data.data.course_id); // Store the course_id
          setStep(2); // Move to the first section
        } else {
          toast.error(`Failed to create course: ${data.message}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else {
        toast.error(`Failed to create course: ${response.statusText}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting the form.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Function to handle saving a section and moving to the next one
  const saveAndAddNewSection = async () => {
    if (!courseId) {
      toast.error('Course ID is missing. Please create the course first.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!validateCurrentSection()) {
      toast.error('Please fix the errors in the section form.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('video_title', currentSection.video_title);
    formData.append('video_description', currentSection.videoDescription);

    if (currentSection.videoFile.length > 0) {
      formData.append('file', currentSection.videoFile[0]);
    }

    try {
      const response = await axios.post(`http://localhost:8000/course/content/${courseId}`, formData, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success('Section saved successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        console.log(response.data);
        // Increment section count
        setSectionCount(prevCount => prevCount + 1);
        // Reset current section
        setCurrentSection({
          video_title: '',
          videoDescription: '',
          videoFile: [],
        });
        setSectionErrors({
          video_title: '',
          videoDescription: '',
          videoFile: '',
        });
        setStep(prevStep => prevStep + 1); // Move to the next section
      } else {
        toast.error(`Failed to save section: ${response.statusText}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('An error occurred while saving the section.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Function to handle final submission and preview
  const handleSaveAndPreview = async () => {
    if (!courseId) {
      toast.error('Course ID is missing. Please create the course first.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!validateCurrentSection()) {
      toast.error('Please fix the errors in the section form.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('video_title', currentSection.video_title);
    formData.append('video_description', currentSection.videoDescription);
    if (currentSection.videoFile.length > 0) {
      formData.append('file', currentSection.videoFile[0]);
    }

    try {
      const response = await axios.post(`http://localhost:8000/course/content/${courseId}`, formData, {
        withCredentials: true,
      });
      if (response.data.status === 201) {
        const data = response.data; // Assuming backend returns JSON with section details

          toast.success('All sections saved successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
          // Optionally, redirect to the course preview page after a short delay
          setTimeout(() => {
            navigate(`/Instructor/Courses/View/${courseId}`); // Adjust the path as per your routing
          }, 3000);
         
      } else {
        // Note: axios does not have response.json(), use response.data instead
        const errorData = response.data;
        toast.error(`Failed to save section: ${errorData.message || response.statusText}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('An error occurred while saving the section.', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Optional: Function to reset the form after submission
  const resetForm = () => {
    setCourseDetails({
      name: '',
      description: '',
      category: '',
      image: [],
    });
    setCurrentSection({
      video_title: '',
      videoDescription: '',
      videoFile: [],
    });
    setSectionErrors({
      video_title: '',
      videoDescription: '',
      videoFile: '',
    });
    setStep(1);
    setCourseId(null);
    setSectionCount(0);
  };

  // Dynamically generate stepsArray based on sectionCount
  const stepsArray = ['Course Details', ...Array(sectionCount).fill().map((_, i) => `Section ${i + 1}`)];

  return (
    <DashboardLayout>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <main className=" md:ml-64 h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="my-5">
          <Breadcrumb pageTitle="Create Courses" />
        </div>
        <div className="flex flex-col md:flex-row">
          {/* Form Section */}
          <div className="w-full md:w-3/4 p-6 bg-white dark:bg-gray-800 rounded shadow">
            {/* Step 1: Course Details */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#051941] mb-4">Course Details</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    value={courseDetails.name}
                    onChange={handleCourseDetailsChange}
                    className={`w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#051941] dark:bg-gray-700 dark:text-white ${courseErrors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter course name"
                  />
                  {courseErrors.name && <p className="text-red-500 text-sm mt-1">{courseErrors.name}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Course Description</label>
                  <textarea
                    // theme="snow"
                    value={courseDetails.description}
                    onChange={handleCourseDescriptionChange}
                    placeholder="Enter course description"
                    className={`w-full rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#051941] dark:bg-gray-700 dark:text-white ${courseErrors.description ? 'border border-red-500' : ''}`}
                  >
                  {courseErrors.description}
                  </textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Category</label>
                  <select
                    name="category"
                    value={courseDetails.category}
                    onChange={handleCourseDetailsChange}
                    className={`w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#051941] dark:bg-gray-700 dark:text-white ${courseErrors.category ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select category</option>
                    {categories.map((option) => (
                      <option key={option.category_id} value={option.category_id}>
                        {option.category_name}
                      </option>
                    ))}
                  </select>
                  {courseErrors.category && <p className="text-red-500 text-sm mt-1">{courseErrors.category}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Thumbnail Image</label>
                  <FilePond
                    files={courseDetails.image}
                    allowMultiple={false}
                    onupdatefiles={handleImageFileUpdate}
                    maxFiles={1}
                    name="image"
                    labelIdle='Drag & Drop your thumbnail or <span class="filepond--label-action">Browse</span>'
                    acceptedFileTypes={['image/*']}
                    className={`dark:bg-gray-700 ${courseErrors.image ? 'border border-red-500' : ''}`}
                  />
                  {courseErrors.image && <p className="text-red-500 text-sm mt-1">{courseErrors.image}</p>}
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleCourseSubmit}
                    className="bg-gradient-to-r from-[#152c5a] to-[#1e4d8b] text-white px-5 py-2 rounded hover:bg-[#0d3656] transition duration-200"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Steps for Sections */}
            {step > 1 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#051941] mb-4">{`Add Section ${step - 1}`}</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Video Title</label>
                  <input
                    type="text"
                    name="video_title"
                    value={currentSection.video_title}
                    onChange={handleSectionChange}
                    className={`w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#051941] dark:bg-gray-700 dark:text-white ${sectionErrors.video_title ? 'border-red-500' : ''}`}
                    placeholder="Enter video title"
                  />
                  {sectionErrors.video_title && <p className="text-red-500 text-sm mt-1">{sectionErrors.video_title}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Video Description</label>
                  <ReactQuill
                    theme="snow"
                    value={currentSection.videoDescription}
                    onChange={handleVideoDescriptionChange}
                    placeholder="Enter video description"
                    className={`w-full rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#051941] dark:bg-gray-700 dark:text-white ${sectionErrors.videoDescription ? 'border border-red-500' : ''}`}
                  />
                  {sectionErrors.videoDescription && <p className="text-red-500 text-sm mt-1">{sectionErrors.videoDescription}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Upload Video</label>
                  <FilePond
                    files={currentSection.videoFile}
                    allowMultiple={false}
                    onupdatefiles={handleVideoFileUpdate}
                    maxFiles={1}
                    name="video"
                    labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
                    acceptedFileTypes={['video/*']}
                    className={`dark:bg-gray-700 ${sectionErrors.videoFile ? 'border border-red-500' : ''}`}
                  />
                  {sectionErrors.videoFile && <p className="text-red-500 text-sm mt-1">{sectionErrors.videoFile}</p>}
                </div>
                <div className="flex justify-end mt-6">
                  <div className="flex space-x-4">
                    <button
                      onClick={saveAndAddNewSection}
                      className="bg-gradient-to-r from-[#152c5a] to-[#1e4d8b] text-white px-5 py-2 rounded hover:bg-[#0d3656] transition duration-200"
                    >
                      Save and Add New Section
                    </button>
                    <button
                      onClick={handleSaveAndPreview}
                      className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition duration-200"
                    >
                      Save and Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Progress Bar */}
          <div className="w-full md:w-1/4 flex flex-col items-center mt-8 md:mt-0 md:ml-4">
            <ul className="w-full">
              {stepsArray.map((label, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < step;
                const isCurrent = stepNumber === step;
                return (
                  <li key={index} className="relative mb-8">
                    {/* Connector Line */}
                    {index !== stepsArray.length - 1 && (
                      <div className="absolute top-6 left-2.5 w-0.5 h-full bg-gray-300 dark:bg-gray-600"></div>
                    )}

                    {/* Icon */}
                    <div className="absolute top-0 left-0 flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 dark:bg-gray-700 dark:border-gray-600">
                      {isCompleted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-[#051941] dark:text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : isCurrent ? (
                        <div className="w-3 h-3 bg-[#051941] rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 rounded-full dark:bg-gray-600"></div>
                      )}
                    </div>

                    {/* Label */}
                    <div
                      className={`ml-8 ${
                        isCompleted
                          ? 'text-gray-700 dark:text-gray-300'
                          : isCurrent
                          ? 'text-[#051941] dark:text-blue-400 font-semibold'
                          : 'text-gray-500 dark:text-gray-500'
                      }`}
                    >
                      {label}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

export default Create;

// EditCourses.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FilePond, registerPlugin } from 'react-filepond';
import ReactQuill from 'react-quill';
import {
  ChevronRight,
  Edit,
  X,
  Video,
  BookOpen,
  Plus,
  Trash2, // Added Trash2 icon for delete
} from 'lucide-react';
import 'filepond/dist/filepond.min.css';
import 'react-quill/dist/quill.snow.css';
import './edit.css'; // Your custom styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import and register FilePond plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugins without FilePondPluginFilePoster
registerPlugin(FilePondPluginFileValidateType);

function EditCourses({ courseId }) {
//   console.log('Editing Course ID:', courseId);

  // State Variables
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Adding New Section
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSection, setNewSection] = useState({
    videoTitle: '',
    description: '',
    videoFiles: [],
  });
  const [newSectionErrors, setNewSectionErrors] = useState({
    videoTitle: '',
    description: '',
    videoFiles: '',
  });

  // Fetch course data when courseId changes
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/course/coursePage/${courseId}`,
          {
            withCredentials: true, // Include credentials if using cookies
            // If using token-based auth, include headers:
            // headers: { Authorization: `Bearer YOUR_TOKEN_HERE` }
          }
        );
        const data = response.data;

        console.log('Fetched Course Data:', data);

        setCourse({
          ...data.course,
          thumbnailFiles: [], // For handling thumbnail uploads
        });

        setSections(
          data.content.map((video, index) => ({
            video_id: video.video_id,
            title: `Section ${index + 1}`, // Set title based on index
            videoTitle: video.video_title,
            description: video.video_description,
            videoUrl: video.video_url,
            isEditing: false,
            videoFiles: [], // Initialize as empty for new uploads
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data.');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    } else {
      setError('No course ID provided.');
      setLoading(false);
    }
  }, [courseId]);

  // Toggle Course Edit Mode
  const toggleCourseEdit = () => {
    setIsEditingCourse(!isEditingCourse);
  };

  // Toggle Section Edit Mode
  const toggleSectionEdit = (index) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, isEditing: !section.isEditing } : section
      )
    );
  };

  // Update Section Data
  const updateSection = (index, updates) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, ...updates } : section))
    );
  };

  // Handle Course Detail Changes
  const handleCourseChange = (field, value) => {
    setCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save Course Details
  const handleSaveCourse = async () => {
    try {
      const formData = new FormData();
      formData.append('course_name', course.course_name);
      formData.append('course_description', course.course_description);

      // Append thumbnail file if a new one is uploaded
      if (course.thumbnailFiles && course.thumbnailFiles.length > 0) {
        formData.append('file', course.thumbnailFiles[0]); // Ensure the field name matches backend
      }

      // Add other course fields as needed

      const response = await axios.put(
        `http://localhost:8000/course/update/${course.course_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Include Authorization header if using token-based auth
            // Authorization: `Bearer YOUR_TOKEN_HERE`,
          },
          withCredentials: true, // Include credentials if using cookies
        }
      );

      console.log('Course Update Response:', response.data);

      if (response.data.course_id) {
        setCourse({
          ...response.data,
          thumbnailFiles: [],
        });
        setIsEditingCourse(false);
        toast.success('Course updated successfully!');
      } else {
        console.error('Unexpected response structure:', response.data);
        toast.error('Failed to update course. Please try again.');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      toast.error('Failed to update course.');
    }
  };

  // Save Section Details
  const handleSaveSection = async (index) => {
    try {
      const section = sections[index];
      const formData = new FormData();
      formData.append('video_title', section.videoTitle);
      formData.append('video_description', section.description);

      // Append video file if a new one is uploaded
      if (section.videoFiles && section.videoFiles.length > 0) {
        formData.append('file', section.videoFiles[0]); // Ensure the field name matches backend
      }

      // Add other section fields as needed

      const response = await axios.put(
        `http://localhost:8000/course/content/${courseId}/${section.video_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Include Authorization header if using token-based auth
            // Authorization: `Bearer YOUR_TOKEN_HERE`,
          },
          withCredentials: true, // Include credentials if using cookies
        }
      );

      console.log('Section Update Response:', response.data);

      if (response.data.video_id) {
        const updatedSection = response.data;

        setSections((prev) =>
          prev.map((sec, i) =>
            i === index
              ? {
                  ...sec,
                  videoTitle: updatedSection.video_title,
                  description: updatedSection.video_description,
                  videoUrl: updatedSection.video_url,
                  isEditing: false,
                  videoFiles: [], // Reset videoFiles after upload
                }
              : sec
          )
        );

        toast.success('Section updated successfully!');
      } else {
        console.error('Unexpected response structure:', response.data);
        toast.error('Failed to update section. Please try again.');
      }
    } catch (err) {
      console.error('Error updating section:', err);
      toast.error('Failed to update section.');
    }
  };

  // Handle Changes for New Section
  const handleNewSectionChange = (field, value) => {
    setNewSection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate New Section
  const validateNewSection = () => {
    const errors = {
      videoTitle: '',
      description: '',
      videoFiles: '',
    };
    let isValid = true;

    if (!newSection.videoTitle.trim()) {
      errors.videoTitle = 'Video title is required';
      isValid = false;
    }

    if (newSection.description.replace(/<(.|\n)*?>/g, '').trim() === '') {
      errors.description = 'Video description is required';
      isValid = false;
    }

    if (newSection.videoFiles.length === 0) {
      errors.videoFiles = 'Please upload a video';
      isValid = false;
    }

    setNewSectionErrors(errors);
    return isValid;
  };

  // Handle Adding New Section
  const handleAddSection = async () => {
    if (!validateNewSection()) {
      toast.error('Please fix the errors in the new section form.');
      return;
    }

    const formData = new FormData();
    formData.append('video_title', newSection.videoTitle);
    formData.append('video_description', newSection.description);

    if (newSection.videoFiles.length > 0) {
      formData.append('file', newSection.videoFiles[0]); // Ensure the field name matches backend
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/course/content/${courseId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Include Authorization header if using token-based auth
            // Authorization: `Bearer YOUR_TOKEN_HERE`,
          },
          withCredentials: true, // Include credentials if using cookies
        }
      );

      console.log('Add Section Response:', response.data);

      if (response.data.newContent.video_id) {
        const addedSection = response.data;

        setSections((prev) => [
          ...prev,
          {
            video_id: addedSection.video_id,
            title: `Section ${prev.length + 1}`, // Set title based on new index
            videoTitle: addedSection.video_title,
            description: addedSection.video_description,
            videoUrl: addedSection.video_url,
            isEditing: false,
            videoFiles: [],
          },
        ]);

        setNewSection({
          videoTitle: '',
          description: '',
          videoFiles: [],
        });

        setNewSectionErrors({
          videoTitle: '',
          description: '',
          videoFiles: '',
        });

        setIsAddingSection(false);
        toast.success('New section added successfully!');
      } else {
        console.error('Unexpected response structure:', response.data);
        toast.error('Failed to add section. Please try again.');
      }
    } catch (err) {
      console.error('Error adding section:', err);
      toast.error('Failed to add section.');
    }
  };

  // Handle Deleting a Section (Soft Delete using PUT request)
// Handle Deleting a Section (Soft Delete using PUT request)
const handleDeleteSection = async (index) => {
  const section = sections[index];
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${section.videoTitle}"? This action cannot be undone.`
  );

  if (!confirmDelete) return;

  try {
    const response = await axios.put(
      `http://localhost:8000/course/deleteContent/${courseId}/${section.video_id}`,
      {}, // Assuming the backend interprets an empty body as a soft delete
      {
        withCredentials: true, // Include credentials if using cookies
        // If using token-based auth, include headers:
        // headers: { Authorization: `Bearer YOUR_TOKEN_HERE` }
      }
    );

    console.log('Delete Section Response:', response.data, 'Status:', response.status);

    // Check if the response status indicates success
    if (response.status === 200 || response.status === 201 || response.data.status === 201) {
      // Remove the section from the state
      const updatedSections = sections.filter((_, i) => i !== index);

      // Reindex the titles
      const reindexedSections = updatedSections.map((sec, idx) => ({
        ...sec,
        title: `Section ${idx + 1}`,
      }));

      setSections(reindexedSections);

      // Adjust the activeSectionIndex if necessary
      if (reindexedSections.length === 0) {
        setActiveSectionIndex(null); // No active section
      } else if (activeSectionIndex >= reindexedSections.length) {
        setActiveSectionIndex(reindexedSections.length - 1);
      }

      toast.success('Section deleted successfully!');
    } else {
      console.error('Unexpected response structure:', response.data);
      toast.error('Failed to delete section. Please try again.');
    }
  } catch (err) {
    console.error('Error deleting section:', err);
    toast.error('Failed to delete section.');
  }
};

  // Render Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-800 dark:text-white">Loading course data...</p>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Determine if there are any sections
  const hasSections = sections.length > 0;

  // Ensure activeSectionIndex is valid
  const isActiveIndexValid =
    activeSectionIndex !== null &&
    activeSectionIndex >= 0 &&
    activeSectionIndex < sections.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-700 shadow-2xl overflow-hidden">
        {/* Toast Notifications */}
        <ToastContainer />

        {/* Header */}
        <div className="bg-gradient-to-r from-[#152c5a] to-[#1e4d8b] p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BookOpen className="text-white w-10 h-10" />
            <h1 className="text-3xl font-bold text-white">Course Editor</h1>
          </div>
          <button
            onClick={toggleCourseEdit}
            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition"
          >
            {isEditingCourse ? <X className="mr-2" /> : <Edit className="mr-2" />}
            {isEditingCourse ? 'Cancel' : 'Edit Course'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Course Details Column */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-600 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Course Details</h2>

            <div className="space-y-4">
              {/* Course Name */}
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                  Course Name
                </label>
                {isEditingCourse ? (
                  <input
                    type="text"
                    value={course.course_name}
                    onChange={(e) => handleCourseChange('course_name', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-500 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter course name"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-white text-sm">{course.course_name}</p>
                )}
              </div>

              {/* Course Description */}
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                  Description
                </label>
                {isEditingCourse ? (
                  <ReactQuill
                    theme="snow"
                    value={course.course_description}
                    onChange={(content) => handleCourseChange('course_description', content)}
                    placeholder="Enter course description"
                    className="bg-white dark:bg-gray-500 rounded-lg"
                  />
                ) : (
                  <div
                    className="text-gray-800 dark:text-white text-sm"
                    dangerouslySetInnerHTML={{ __html: course.course_description }}
                  ></div>
                )}
              </div>

              {/* Course Thumbnail */}
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                  Thumbnail
                </label>
                {isEditingCourse ? (
                  <FilePond
                    allowMultiple={false}
                    files={course.thumbnailFiles}
                    onupdatefiles={(fileItems) => {
                      handleCourseChange(
                        'thumbnailFiles',
                        fileItems.map((fileItem) => fileItem.file)
                      );
                    }}
                    name="file" // Ensure this matches the backend's FileInterceptor field name
                    labelIdle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
                    acceptedFileTypes={['image/*']}
                    className="dark:bg-gray-500"
                  />
                ) : (
                  <img
                    src={course.course_img}
                    alt="Course Thumbnail"
                    className="rounded-lg shadow-md w-full h-48 object-cover"
                  />
                )}
              </div>
            </div>

            {/* Save Course Button */}
            {isEditingCourse && (
              <button
                onClick={handleSaveCourse}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Course
              </button>
            )}
          </div>

          {/* Sections Column */}
          <div className="md:col-span-2 bg-white dark:bg-gray-700 rounded-xl">
            {/* Sections Header */}
            <div className="border-b dark:border-gray-600 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Course Sections</h2>
              <button
                onClick={() => setIsAddingSection(!isAddingSection)}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              >
                <Plus className="mr-2" />
                {isAddingSection ? 'Cancel' : 'Add Section'}
              </button>
            </div>

            {/* Sections Tabs */}
            <div className="flex overflow-x-auto px-6 py-4">
              {sections.map((section, index) => (
                <button
                  key={section.video_id}
                  onClick={() => setActiveSectionIndex(index)}
                  className={`
                    px-6 py-4 flex items-center space-x-2 
                    ${activeSectionIndex === index
                      ? 'bg-blue-100 dark:bg-blue-900 text-[#051941] dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }
                    transition-colors
                  `}
                >
                  <Video className="w-5 h-5" />
                  <span className="w-20 truncate">{section.title}</span>
                  {activeSectionIndex === index && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Active Section Content */}
            <div className="p-6">
              {isActiveIndexValid ? (
                <div className="space-y-4">
                  {/* Existing Video Display */}
                  {!sections[activeSectionIndex].isEditing && sections[activeSectionIndex].videoUrl && (
                    <video
                      src={sections[activeSectionIndex].videoUrl}
                      controls
                      className="w-full h-48 object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Edit Section Button */}
                  <button
                    onClick={() => toggleSectionEdit(activeSectionIndex)}
                    className="flex items-center bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-300 px-4 py-2 rounded transition"
                  >
                    {sections[activeSectionIndex].isEditing ? <X className="mr-2" /> : <Edit className="mr-2" />}
                    {sections[activeSectionIndex].isEditing ? 'Cancel Edit' : 'Edit Section'}
                  </button>

                  {/* Video Title */}
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                      Video Title
                    </label>
                    {sections[activeSectionIndex].isEditing ? (
                      <input
                        type="text"
                        value={sections[activeSectionIndex].videoTitle}
                        onChange={(e) =>
                          updateSection(activeSectionIndex, { videoTitle: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-white dark:bg-gray-500 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter video title"
                      />
                    ) : (
                      <p className="text-gray-800 dark:text-white text-sm">
                        {sections[activeSectionIndex].videoTitle || 'No title provided'}
                      </p>
                    )}
                  </div>

                  {/* Video Description */}
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                      Video Description
                    </label>
                    {sections[activeSectionIndex].isEditing ? (
                      <ReactQuill
                        theme="snow"
                        value={sections[activeSectionIndex].description}
                        onChange={(content) =>
                          updateSection(activeSectionIndex, { description: content })
                        }
                        placeholder="Enter video description"
                        className="bg-white dark:bg-gray-500 rounded-lg"
                      />
                    ) : (
                      <div
                        className="text-gray-800 dark:text-white text-sm"
                        dangerouslySetInnerHTML={{ __html: sections[activeSectionIndex].description }}
                      ></div>
                    )}
                  </div>

                  {/* Video Upload */}
                  {sections[activeSectionIndex].isEditing && (
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                        Video Upload
                      </label>
                      <FilePond
                        allowMultiple={false}
                        files={sections[activeSectionIndex].videoFiles}
                        onupdatefiles={(fileItems) => {
                          updateSection(
                            activeSectionIndex,
                            { videoFiles: fileItems.map((fileItem) => fileItem.file) }
                          );
                        }}
                        name="file" // Ensure this matches the backend's FileInterceptor field name
                        labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
                        acceptedFileTypes={['video/*']}
                        className="dark:bg-gray-500"
                      />
                    </div>
                  )}

                  {/* Save Section Button */}
                  {sections[activeSectionIndex].isEditing && (
                    <button
                      onClick={() => handleSaveSection(activeSectionIndex)}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save Section
                    </button>
                  )}

                  {/* Delete Section Button */}
                  {!sections[activeSectionIndex].isEditing && (
                    <button
                      onClick={() => handleDeleteSection(activeSectionIndex)}
                      className="mt-4 flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      <Trash2 className="mr-2" />
                      Delete Section
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-300">
                  <p>No sections available. Please add a new section.</p>
                </div>
              )}
            </div>

            {/* Add New Section Form */}
            {isAddingSection && (
              <div className="p-6 border-t dark:border-gray-600">
                <h2 className="text-2xl font-semibold text-[#051941] mb-4">Add New Section</h2>
                <div className="space-y-4">
                  {/* Video Title */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={newSection.videoTitle}
                      onChange={(e) => handleNewSectionChange('videoTitle', e.target.value)}
                      className={`w-full px-4 py-2 bg-white dark:bg-gray-500 rounded-lg border dark:border-gray-600 focus:ring-2 focus:ring-blue-500 ${
                        newSectionErrors.videoTitle ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter video title"
                    />
                    {newSectionErrors.videoTitle && (
                      <p className="text-red-500 text-sm mt-1">{newSectionErrors.videoTitle}</p>
                    )}
                  </div>

                  {/* Video Description */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                      Video Description
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={newSection.description}
                      onChange={(content) => handleNewSectionChange('description', content)}
                      placeholder="Enter video description"
                      className={`w-full rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                        newSectionErrors.description ? 'border border-red-500' : ''
                      }`}
                    />
                    {newSectionErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{newSectionErrors.description}</p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                      Upload Video
                    </label>
                    <FilePond
                      allowMultiple={false}
                      files={newSection.videoFiles}
                      onupdatefiles={(fileItems) => {
                        setNewSection((prev) => ({
                          ...prev,
                          videoFiles: fileItems.map((fileItem) => fileItem.file),
                        }));
                      }}
                      name="file" // Ensure this matches the backend's FileInterceptor field name
                      labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
                      acceptedFileTypes={['video/*']}
                      className={`dark:bg-gray-700 ${
                        newSectionErrors.videoFiles ? 'border border-red-500' : ''
                      }`}
                    />
                    {newSectionErrors.videoFiles && (
                      <p className="text-red-500 text-sm mt-1">{newSectionErrors.videoFiles}</p>
                    )}
                  </div>

                  {/* Save New Section Button */}
                  <div className="flex justify-end mt-6 space-x-4">
                    <button
                      onClick={() => setIsAddingSection(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSection}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Add Section
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    );
  }

export default EditCourses;
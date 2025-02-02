import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import DashboardLayout from '../DashboadLayouts/DashbordLayout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateInstructorProfile() {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkURL, setNewLinkURL] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [newData, setNewData] = useState({
        user_name: '',
        user_email: '',
        phone_number: '',
        major: '',
        about_me: '',
        skills: [],
        links: [],
        file: null,
    });

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(`http://localhost:8000/user/profilePage`, { withCredentials: true });
                console.log(response.data);
                setUserData(response.data.user);
                setNewData({
                    user_name: response.data.user.user.user_name,
                    user_email: response.data.user.user_email,
                    phone_number: response.data.user.user.phone_number,
                    major: response.data.user.major,
                    about_me: response.data.user.about_me,
                    skills: response.data.user.skills || [],
                    links: response.data.user.user_link || [],
                    file: null,
                });
                console.log(response.data.user.skills);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [id]);

    const addSkill = () => {
        if (newSkill.trim()) {
            setNewData((prevData) => ({
                ...prevData,
                skills: [...prevData.skills, { skill_name: newSkill }],
            }));
            setNewSkill("");
        }
    };

    const updateSkill = (index, value) => {
        setNewData((prevData) => {
            const updatedSkills = [...prevData.skills];
            updatedSkills[index].skill_name = value;
            return { ...prevData, skills: updatedSkills };
        });
    };

    const removeSkill = (index) => {
        setNewData((prevData) => ({
            ...prevData,
            skills: prevData.skills.filter((_, i) => i !== index),
        }));
    };

    const addLink = () => {
        if (newLinkName.trim() && newLinkURL.trim()) {
            const newLinkObj = {
                link_name: newLinkName,
                link: newLinkURL,
            };
            setNewData((prevData) => ({
                ...prevData,
                links: [...prevData.links, newLinkObj],
            }));
            setNewLinkName('');
            setNewLinkURL('');
            toast.success('Link added successfully!', {
                position: 'top-right',
                autoClose: 5000,
            });
        } else {
            toast.error('Please fill out both fields.', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };
    
    const removeLink = (index) => {
        setNewData((prevData) => ({
            ...prevData,
            links: prevData.links.filter((_, i) => i !== index),
        }));
    };

    const handleLinkChange = (index, field, value) => {
        setNewData((prevData) => {
            const updatedLinks = [...prevData.links];
            updatedLinks[index] = {
                ...updatedLinks[index],
                [field]: value,
            };
            return {
                ...prevData,
                links: updatedLinks,
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(newData).forEach((key) => {
            if (key === 'file' && newData.file) {
                formData.append(key, newData.file);
            } else if (Array.isArray(newData[key])) {
                formData.append(key, JSON.stringify(newData[key]));
            } else {
                formData.append(key, newData[key]);
            }
        });
    
        try {
            const response = await axios.put(
                `http://localhost:8000/user/instructor/info`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            toast.success('Profile updated successfully!');
            // window.location.href = 'http://localhost:3000/profile'
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user data', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setNewData((prevData) => ({
            ...prevData,
            file: e.target.files[0],
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <DashboardLayout>
            <main className="md:ml-64">
                <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        pauseOnHover
                        draggable
                        pauseOnFocusLoss
                      />
                <form onSubmit={handleSubmit} className="p-6 bg-gray-100 flex items-center justify-center">
                    <div className="container max-w-screen-lg mx-auto">
                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                <div className="text-gray-600">
                                    <p className="font-medium text-lg">Personal Details</p>
                                    <p>Make sure to include all your information and make sure it is correct because it affects your evaluation process on the site.</p>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                        <div className="md:col-span-5">
                                            <label htmlFor="user_name">Full Name</label>
                                            <input
                                                type="text"
                                                name="user_name"
                                                id="user_name"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                value={newData.user_name}
                                                onChange={handleInputChange}
                                                placeholder={userData.user.user_name || ''}
                                            />
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="user_email">Email Address</label>
                                            <input
                                                type="text"
                                                name="user_email"
                                                id="user_email"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                value={newData.user_email}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label htmlFor="phone_number">Phone Number</label>
                                            <input
                                                type="text"
                                                name="phone_number"
                                                id="phone_number"
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                value={newData.phone_number}
                                                onChange={handleInputChange}
                                                placeholder={userData.user.phone_number || ''}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                                Profile Image
                                            </label>
                                            <input
                                                type="file"
                                                name="file"
                                                id="file"
                                                className="block w-full text-sm text-gray-500 
                                                    file:mr-4 file:py-2 file:px-4 
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-100 file:text-blue-700
                                                    hover:file:bg-blue-200
                                                    h-10 border rounded-lg px-4 mt-1 bg-gray-50"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="about_me">About me</label>
                                            <textarea 
                                                name="about_me" 
                                                id="about_me" 
                                                className="h-32 border mt-1 rounded px-4 w-full bg-gray-50" 
                                                value={newData.about_me} 
                                                onChange={handleInputChange}
                                                placeholder={userData.about_me || ''}
                                            ></textarea>
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="major">Major</label>
                                            <input 
                                                type="text" 
                                                name="major" 
                                                id="major" 
                                                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" 
                                                value={newData.major} 
                                                onChange={handleInputChange}
                                                placeholder={userData.major || ''} 
                                            />
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="skills">Skills</label>
                                            {newData.skills.map((skill, index) => (
                                                <div key={index} className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="text"
                                                        name={`skills-${index}`}
                                                        id={`skills-${index}`}
                                                        className="h-10 border rounded px-4 w-full bg-gray-50"
                                                        value={skill.skill_name}
                                                        onChange={(e) => updateSkill(index, e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add new skill"
                                                    className="h-10 border rounded px-4 w-full bg-gray-50"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addSkill}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        {/* <div className="md:col-span-5">
                                            <label htmlFor="links">Links</label>
                                            {newData.links.map((link, index) => (
                                                <div key={index} className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Link Name"
                                                        className="h-10 border rounded px-4 w-full bg-gray-50"
                                                        value={link.link_name}
                                                        onChange={(e) => handleLinkChange(index, 'link_name', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Link URL"
                                                        className="h-10 border rounded px-4 w-full bg-gray-50"
                                                        value={link.link}
                                                        onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLink(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Link Name"
                                                    className="h-10 border rounded px-4 w-full bg-gray-50"
                                                    value={newLinkName}
                                                    onChange={(e) => setNewLinkName(e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Link URL"
                                                    className="h-10 border rounded px-4 w-full bg-gray-50"
                                                    value={newLinkURL}
                                                    onChange={(e) => setNewLinkURL(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addLink}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div> */}
                                        {/* Add more form fields as necessary */}
                                        <div className="md:col-span-5 text-right">
                                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </DashboardLayout>
    );
}

export default UpdateInstructorProfile;
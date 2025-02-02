import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import DashboardLayout from '../DashboadLayouts/DashbordLayout';
import axios from 'axios';
import { toast } from 'react-toastify';

function UpdateAdminProfile() {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSkill, setNewSkill] = useState('');
    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkURL, setNewLinkURL] = useState('');

    const addSkill = () => {
        if (newSkill.trim()) {
            const newSkillObj = {
                skill_id: Date.now(), // Temporary unique ID
                skill_name: newSkill,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            // Add new skill to userData.skills array
            setUserData({
                ...userData,
                skills: [...userData.skills, newSkillObj],
            });
            setNewSkill(''); // Clear the input field
        }
    };

    const handleSkillChange = (e) => {
        setNewSkill(e.target.value);
    };

    const addLink = () => {
        if (newLinkName.trim() && newLinkURL.trim()) {
            const newLinkObj = {
                link_id: Date.now(), // Temporary unique ID
                link_name: newLinkName,
                link: newLinkURL,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            // Add new link to userData.user_link array
            setUserData({
                ...userData,
                user_link: [...userData.user_link, newLinkObj],
            });
            setNewLinkName(''); // Clear the link name input
            setNewLinkURL(''); // Clear the link URL input
        }
    };

    const handleLinkChange = (e, field) => {
        const value = e.target.value;
        if (field === 'link_name') {
            setNewLinkName(value);
        } else if (field === 'link') {
            setNewLinkURL(value);
        }
    };


    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(`http://localhost:8000/user/profilePage`, { withCredentials: true });
                console.log(response.data);
                setUserData(response.data.user);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [id]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(
                'http://localhost:8000/user/profilePage', 
                userData, 
                {
                    withCredentials: true,
                }
            );
            toast.success('Profile updated successfully!', {
                position: 'top-right',
                autoClose: 5000,
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user data', {
                position: 'top-right',
                autoClose: 5000,
            });
        }
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <DashboardLayout>
            <main className="md:ml-64">
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
                                                    value={userData.user_name || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="md:col-span-5">
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={userData.user_email || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label htmlFor="phone_number">Phone Number</label>
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    id="phone_number"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={userData.phone_number || ''}
                                                    onChange={(e) => setUserData({ ...userData.user, phone_number: e.target.value })}
                                                />
                                            </div>
                                            <div class="md:col-span-2">
                                                <label for="user_img" class="block text-sm font-medium text-gray-700 mb-1">
                                                    Profile Image
                                                </label>
                                                <input
                                                    type="file"
                                                    name="user_img"
                                                    id="user_img"
                                                    class="block w-full text-sm text-gray-500 
                                                        file:mr-4 file:py-2 file:px-4 
                                                        file:rounded-lg file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-blue-100 file:text-blue-700
                                                        hover:file:bg-blue-200
                                                        h-10 border rounded-lg px-4 mt-1 bg-gray-50"
                                                />
                            
                                            </div>
                                            <div class="md:col-span-5">
                                                <label for="major">Department</label>
                                                <input onChange={(e) => setUserData({ ...userData, major: e.target.value })} type="text" name="major" id="major" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={userData.major || ''} />
                                            </div>
                                            {/* Add more form fields as necessary */}
                                            <div className="md:col-span-5 text-right">
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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

export default UpdateAdminProfile;

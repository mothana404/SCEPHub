import React, { useState, useEffect } from 'react';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router';
import axios from 'axios';

function HomeProjectDetails() {
    const { id } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [projectNumber, setProjectNumber] = useState(0);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProjectDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/project/homeProjectDetails/${id}`);
                setProjectDetails(response.data); // Assuming the project details are in response.data.project
                setProjectNumber(response.data.participants?.length || 0);

                // let parsedSkills = response.data.project.required_skills || null;
                // if (parsedSkills) {
                //     try {
                //         if (typeof parsedSkills === 'string') {
                //             parsedSkills = parsedSkills.replace(/^"(.+)"$/, '$1');
                //             parsedSkills = parsedSkills.replace(/'/g, '"');
                //             parsedSkills = JSON.parse(parsedSkills);
                //         }
                //         if (Array.isArray(parsedSkills)) {
                //             setSkills(parsedSkills);
                //         }
                //     } catch (error) {
                //         console.error('Error parsing skills:', error);
                //         setSkills([]);
                //     }
                // }
            } catch (err) {
                console.error('Error fetching project details:', err);
                setError('Failed to fetch project details');
            } finally {
                setLoading(false);
            }
        };
        fetchProjectDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !projectDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">{error || 'Project not found'}</div>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
                <article className="pt-28 pb-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-2xl bg-white p-8 shadow-lg mb-12">
                            {/* Category Badge */}
                            <div className="mb-6">
                                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                    {projectDetails.category?.category_name || 'Uncategorized'}
                                </span>
                            </div>

                            {/* Project Title */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {projectDetails.project_name}
                            </h1>

                            {/* Project Timeline */}
                            <div className="flex items-center space-x-4 text-gray-600 mb-6">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        {new Date(projectDetails.start_date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })} - {new Date(projectDetails.end_date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Skills Tags */}
                            {/* {skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )} */}

                            {/* Project Image */}
                            {projectDetails.project_img && (
                                <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-8">
                                    <img
                                        className="w-full h-[250px] object-cover"
                                        src={projectDetails.project_img}
                                        alt={projectDetails.project_name}
                                    />
                                </div>
                            )}

                            {/* Project Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Description */}
                                <div className="md:col-span-2 prose prose-lg">
                                    <div
                                        className="text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: projectDetails.project_description }}
                                    />
                                </div>

                                {/* Sidebar Info */}
                                <div className="space-y-6">
                                    {/* Instructor Info */}
                                    {projectDetails.instructor && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Instructor</h3>
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={projectDetails.instructor.user?.user_img || '/default-avatar.png'}
                                                        alt={projectDetails.instructor.user?.user_name || 'Instructor'}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {projectDetails.instructor.user?.user_name || 'Instructor'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{projectDetails.instructor.major || 'No major specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Project Stats */}
                                    <div className="bg-gray-50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="text-gray-600">{projectNumber} Participants</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-600">
                                                    {Math.ceil((new Date(projectDetails.end_date) - new Date(projectDetails.start_date)) / (1000 * 60 * 60 * 24))} Days Duration
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    );
}

export default HomeProjectDetails;
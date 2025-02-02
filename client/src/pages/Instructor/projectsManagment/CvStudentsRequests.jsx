import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboadLayouts/DashbordLayout';

function CvStudentsRequests() {
    const { id, projectID } = useParams(); // Get student ID from route params
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/user/profileCV/${id}`,
                    { withCredentials: true }
                );
                const { user, projects } = response.data;
                setStudent(user);
                setProjects(projects || []);
            } catch (error) {
                console.error('Error fetching student data:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id]);

    const handleDecision = async (decision) => {
        try {
            await axios.put(
                `http://localhost:8000/project/acceptStudent/${projectID}/${id}`,
                { student_id: id, status: decision },
                { withCredentials: true }
            );
            alert(`Student request ${decision === 2 ? 'Accepted' : 'Rejected'}!`);
            navigate(-1); // Go back to the previous page
        } catch (error) {
            console.error('Error updating decision:', error.message);
            alert('Failed to process the decision. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!student) {
        return <div>No student data available.</div>;
    }

    return (
        <DashboardLayout>
            <main className="p-4 md:ml-64 h-auto bg-gray-100">
                <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-10 text-center">
                        <img
                            src={student.user?.user_img || ''}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                            onError={(e) => {
                                e.target.src =
                                    'https://static.vecteezy.com/system/resources/thumbnails/002/227/543/small/programmer-computer-expert-linear-icon-vector.jpg';
                            }}
                        />
                        <h1 className="text-2xl font-bold text-white">{student.user?.user_name || 'Student'}</h1>
                        <p className="text-lg text-blue-100">{student.major || 'Major not provided'}</p>
                    </div>

                    {/* About Me Section */}
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">About Me</h2>
                        <p className="text-gray-600">
                            {student.about_me || 'The student has not provided any information about themselves.'}
                        </p>
                        <p className="text-gray-600 mt-2">
                            University: {student.university_name || 'No university information provided.'}
                        </p>
                    </div>

                    {/* Projects Section */}
                    <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Projects</h2>
                        {projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.map((project) => (
                                    <div
                                        key={project.project_id}
                                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                                    >
                                        <img
                                            src={project.project_img || ''}
                                            alt={project.project_name}
                                            className="w-full h-32 object-cover"
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://via.placeholder.com/200x100?text=Project+Image';
                                            }}
                                        />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold">{project.project_name}</h3>
                                            <p className="text-gray-600 text-sm">
                                                {project.project_description?.replace(/<\/?[^>]+(>|$)/g, '') ||
                                                    'No description available.'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">The student has not been involved in any projects.</p>
                        )}
                    </div>

                    {/* Accept/Reject Buttons */}
                    <div className="px-6 py-4 bg-gray-50 text-center">
                        <button
                            onClick={() => handleDecision(2)}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg mr-4"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleDecision(3)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            </main>
        </DashboardLayout>
    );
}

export default CvStudentsRequests;
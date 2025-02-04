import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaExternalLinkAlt, FaGithub, FaLinkedin, FaEnvelope, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaStackOverflow, FaReddit } from 'react-icons/fa';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

function MemberCVHome() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:8000/user/profileCV/${id}`);
        setUser(userResponse.data.user);
        setProjects(userResponse.data.projects);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-10 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-16 text-center">
              <img
                src={user.user.user_img || ''}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                onError={(e) => {
                  e.target.src =
                    'https://static.vecteezy.com/system/resources/thumbnails/002/227/543/small/programmer-computer-expert-linear-icon-vector.jpg';
                }}
              />
              <h1 className="text-3xl font-bold text-white">{user.user.user_name}</h1>
              <p className="text-xl text-blue-100">{user.major || 'Programmer'}</p>
            </div>

            {/* About Me Section */}
            <div className="px-6 py-8 border-b">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
              <p className="text-gray-600 leading-relaxed">{user.about_me || 'No information available'}</p>
              <p className="text-gray-600 leading-relaxed">University: {user.university_name || 'No information available'}</p>
              <p className="text-gray-600 leading-relaxed">
                Start From: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'No information available'}
              </p>
            </div>

            {/* Skills Section */}
            <div className="px-6 py-8 border-b">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={project.project_img || ''}
                      alt={project.project_name}
                      className="w-full h-36 object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://media.licdn.com/dms/image/C4D12AQFKlRdSpv8M8g/article-cover_image-shrink_600_2000/0/1653218685163?e=2147483647&v=beta&t=q3B958IcOpVvr7Vu8z4ob_hbSooxmvJWVRjQ25d2Kxc';
                      }}
                    />
                    <div className="p-4 flex flex-col justify-between">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.project_name}</h3>
                      {/* <p className="text-gray-600 mb-4 text-sm">
                        {project.project_description.length > 80
                            ? `${project.project_description.substring(0, 80)}...`
                            : project.project_description}
                      </p> */}
                      <p class="text-gray-500"
                         dangerouslySetInnerHTML={{ __html: project.project_description.length > 80
                            ? project.project_description.slice(0, 80) + '...'
                            : project.project_description }}
                        ></p>
                      {/* <a
                        href={project.project_link}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project <FaExternalLinkAlt className="ml-1" />
                      </a> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Links */}
            <div className="bg-gray-50 px-6 py-8">
            <div className="flex justify-center">
                {user.user_link?.map((link, index) => (
                    <Link
                    key={index}
                    to={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label={`${link.link_name} Profile`}
                    >
                    {link.link_name.toLowerCase() === 'github' && <FaGithub className="w-8 h-8 mr-8" />}
                    {link.link_name.toLowerCase() === 'linkedin' && <FaLinkedin className="w-8 h-8 mr-8" />}
                    {link.link_name.toLowerCase() === 'twitter' && <FaTwitter className="w-8 h-8 mr-8" />}
                    {link.link_name.toLowerCase() === 'facebook' && <FaFacebook className="w-8 h-8 mr-8" />}
                    {link.link_name.toLowerCase() === 'instagram' && <FaInstagram className="w-8 h-8 mr-8" />}
                    {link.link_name.toLowerCase() === 'youtube' && <FaYoutube className="w-8 h-8 mr-8" />}
                    </Link>
                ))}

            {/* Check if phone_number exists and show the WhatsApp icon */}
            {user.user.phone_number && (
                <Link
                to={`https://wa.me/${user.user.phone_number}`} // WhatsApp link format
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="WhatsApp Profile"
                >
                <FaWhatsapp className="w-8 h-8 mr-8" />
                </Link>
            )}
            {user.user.user_email && (
                <Link
                    to={`mailto:${user.user.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Email Profile"
                >
                <FaEnvelope className="w-8 h-8" />
                </Link>
            )}
            </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MemberCVHome;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import HomeTopCourses from '../components/HomeTopCourses';

function Developers() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get('http://localhost:8000/user/popularStudents')
        .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the user data!', error);
        });
    }, []);
    if (!user) {
        return <p>Loading...</p>;
    }

  return (
<>
    <NavBar />
    {/* Technologies Section */}
    <section className="pt-20 pb-16 overflow-hidden bg-gradient-to-b from-gray-50 to-white mt-10 font-sans relative">
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)`,
            backgroundSize: `32px 32px`
        }}></div>
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl relative">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
                    Learn all the most used technologies
                </h2>
                <p className="max-w-xl mx-auto mt-6 text-lg leading-relaxed text-gray-600">
                    you will learn to work in all the technologies and libraries
                </p>
            </div>
        </div>
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative mt-16"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform -rotate-1"></div>
            <img className="w-full min-w-full mx-auto mt-12 scale-150 max-w-7xl lg:min-w-0 lg:mt-0 lg:scale-100 relative" 
                 src="https://cdn.rareblocks.xyz/collection/celebration/images/integration/1/services-icons.png" 
                 alt="" />
        </motion.div>
    </section>

    <HomeTopCourses/>

    {/* Top Performers Section */}
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 mb-16 flex flex-col items-center py-20">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-16">
            Meet Our Top Performers
        </h1>
        <div className="w-full flex flex-wrap justify-center items-center gap-8 lg:gap-12 px-4">
            {user.map((user) => (
                <div
                    key={user.user_id}
                    className="w-[20rem] group hover:transform hover:scale-105 transition-all duration-300"
                >
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                        <div className="relative">
                            <div className="w-full flex justify-center">
                                <img
                                    className="w-32 h-32 rounded-full ring-4 ring-blue-100 dark:ring-blue-900 shadow-lg transform -translate-y-16 group-hover:-translate-y-20 transition-transform duration-300"
                                    src={user.user.user_img}
                                    alt="ProfileImage"
                                />
                            </div>
                            <div className="mt--12 text-center space-y-4">
                                <h1 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                                    {user.major}
                                </h1>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    {user.user.user_name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                    {user.about_me && user.about_me.length > 100
                                        ? `${user.about_me.slice(0, 100)}...`
                                        : user.about_me}
                                </p>
                                <Link
                                    to={`/MemberCV/${user.user_id}`}
                                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    See profile
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>

    {/* Expertise Section */}
    <div className="container relative max-w-6xl px-8 mx-auto mb-20">
        <div className="mb-16">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Our Expertise
            </h2>
            <p className="mt-4 text-xl text-gray-600">
                At ScepHub, we provide comprehensive learning experiences that empower students to master in-demand technologies.
            </p>
        </div>

        {/* Keep your existing expertise cards structure but add these classes for enhanced styling */}
        <div className="relative">
            {/* Add the same card styling pattern to your existing cards */}
            <div className="group hover:transform hover:scale-[1.02] transition-all duration-300">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl transform -rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
                    <div class="p-6 container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-5 mb-10">
        {/* <h2 class="mb-1 text-3xl font-extrabold leading-tight text-gray-900">Our Expertise</h2>
        <p class="mb-12 text-lg text-gray-500">At ScepHub, we provide comprehensive learning experiences that empower students to master in-demand technologies. Our curriculum covers:</p> */}
        <div class="w-full">
            <div class="flex flex-col w-full mb-10 sm:flex-row">
                <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    >
                    <div class="relative h-full ml-0 mr-0 sm:mr-10">
                        <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>
                        <div class="relative h-full p-5 bg-white border-2 border-indigo-500 rounded-lg">
                            <div class="flex items-center -mt-1">
                                <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">MERN Stack</h3>
                            </div>
                            <p class="mt-3 mb-1 text-xs font-medium text-indigo-500 uppercase">------------</p>
                            <p class="mb-2 text-gray-600">Students dive deep into the MERN Stack (MongoDB, Express.js, React.js, Node.js), learning to build full-stack web applications. From backend server management to frontend user interfaces, they get hands-on experience in creating scalable, dynamic, and responsive web applications.</p>
                        </div>
                    </div>
                    </motion.div>
                </div>
                <div class="w-full sm:w-1/2">
                <motion.div
                                initial={{ opacity: 0, x: 150 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 2.0 }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                    <div class="relative h-full ml-0 md:mr-10">
                        <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-purple-500 rounded-lg"></span>
                        <div class="relative h-full p-5 bg-white border-2 border-purple-500 rounded-lg">
                            <div class="flex items-center -mt-1">
                                <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">PHP with Laravel</h3>
                            </div>
                            <p class="mt-3 mb-1 text-xs font-medium text-purple-500 uppercase">------------</p>
                            <p class="mb-2 text-gray-600">Our PHP with Laravel course teaches students how to develop robust and secure web applications using the popular Laravel framework. Students learn to build RESTful APIs, integrate database systems, and implement advanced security features to deliver high-quality solutions.</p>
                        </div>
                    </div>
                    </motion.div>
                </div>
            </div>
            <div class="flex flex-col w-full mb-5 sm:flex-row">
                <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
                <motion.div
                                initial={{ opacity: 0, x: -150 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 2.0 }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                    <div class="relative h-full ml-0 mr-0 sm:mr-10">
                        <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-blue-400 rounded-lg"></span>
                        <div class="relative h-full p-5 bg-white border-2 border-blue-400 rounded-lg">
                            <div class="flex items-center -mt-1">
                                <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">Python</h3>
                            </div>
                            <p class="mt-3 mb-1 text-xs font-medium text-blue-400 uppercase">------------</p>
                            <p class="mb-2 text-gray-600">We offer an in-depth exploration of Python with Django, where students develop powerful web applications using Python’s Django framework. They learn how to create scalable backends, build RESTful services, and implement a secure user authentication system, all while mastering Python’s syntax and libraries.</p>
                        </div>
                    </div>
                    </motion.div>
                </div>
                <div class="w-full mb-10 sm:mb-0 sm:w-1/2">
                <motion.div
                                initial={{ opacity: 0, y: 150 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 2.0 }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                    <div class="relative h-full ml-0 mr-0 sm:mr-10">
                        <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-yellow-400 rounded-lg"></span>
                        <div class="relative h-full p-5 bg-white border-2 border-yellow-400 rounded-lg">
                            <div class="flex items-center -mt-1">
                                <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">Flutter and React Native</h3>
                            </div>
                            <p class="mt-3 mb-1 text-xs font-medium text-yellow-400 uppercase">------------</p>
                            <p class="mb-2 text-gray-600">Students gain expertise in mobile app development with Flutter and React Native. They learn to build cross-platform mobile applications, ensuring they can deliver apps on both iOS and Android with a single codebase, enhancing their versatility in mobile development.</p>
                        </div>
                    </div>
                    </motion.div>
                </div>
                <div class="w-full sm:w-1/2">
                <motion.div
                                initial={{ opacity: 0, y: 150 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 2.0 }}
                                viewport={{ once: true, amount: 0.2 }}
                            >
                    <div class="relative h-full ml-0 md:mr-10">
                        <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"></span>
                        <div class="relative h-full p-5 bg-white border-2 border-green-500 rounded-lg">
                            <div class="flex items-center -mt-1">
                                <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">Databases like MongoDB and PostgreSQL</h3>
                            </div>
                            <p class="mt-3 mb-1 text-xs font-medium text-green-500 uppercase">------------</p>
                            <p class="mb-2 text-gray-600">We provide students with hands-on experience in MongoDB and PostgreSQL, teaching them how to design, manage, and optimize both NoSQL and relational databases. Students understand the best practices for data modeling, query optimization, and data integrity to build efficient and reliable backends.</p>
                        </div>
                    </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer/>
</>
  )
}

export default Developers;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function OurProjectsHome() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/project/topProjects');
        setProjects(response.data); 
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
        <section class="bg-white py-6 sm:py-8 lg:py-12 font-sans">
            <div class="mx-auto max-w-screen-xl px-4 md:px-8"> 
                <div class="mb-10 md:mb-16">
                <h2 class="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Most Recent Projects</h2>
                <p class="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">Explore the latest real-world projects crafted to challenge your skills and enhance your expertise in the tech industry.</p>
                </div>
                <div class="grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-2 xl:grid-cols-2 xl:gap-16">
                {projects.map((project) => (
                    <article key={project.id} class="flex flex-col items-center gap-4 md:flex-row lg:gap-6">
                        <Link to={`/projectDetails/${project.id}`} class="group relative block h-56 w-full shrink-0 self-start overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-24 md:w-24 lg:h-40 lg:w-40">
                        <img src={project.project_img} loading="lazy" alt={project.project_name} class="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                        </Link>
                        <div class="flex flex-col gap-2">
                        <span class="text-sm text-gray-400">Start Date: {new Date(project.start_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</span>
                        <h2 class="text-xl font-bold text-gray-800">
                            <Link to={`/projectDetails/${project.project_id}`} class="transition duration-100 hover:text-blue-600 active:text-blue-800">{project.project_name}</Link>
                        </h2>
                        <p class="text-gray-500"
                         dangerouslySetInnerHTML={{ __html: project.project_description.length > 120
                            ? project.project_description.slice(0, 120) + '...'
                            : project.project_description }}
                        >
                            {/* {project.project_description.length > 120
                            ? project.project_description.slice(0, 120) + '...'
                            : project.project_description} */}
                        </p>
                        <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">{project.category}</span>
                        <div>
                            <Link to={`/projectDetails/${project.project_id}`} class="font-semibold text-blue-600 transition duration-100 hover:text-blue-800 active:text-blue-800">Read more</Link>
                        </div>
                        </div>
                    </article>
                ))}
                </div>
            </div>
        </section>


      {/* <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-end justify-between">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Latest Projects</h2>
              <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600 lg:mx-0">Check out our latest projects and gain insights from our work.</p>
            </div>
          </div>
          <div className="grid max-w-md grid-cols-1 gap-6 mx-auto mt-8 lg:mt-16 lg:grid-cols-3 lg:max-w-full">
            {projects.map((project) => (
              <div key={project.id} className="overflow-hidden bg-white rounded shadow">
                <div className="p-4">
                  <div className="relative">
                    <Link to={`/projects/${project.id}`} className="block aspect-w-4 aspect-h-3">
                      <img className="object-cover w-96 h-64" src={project.project_img} alt={project.project_name} />
                    </Link>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 uppercase bg-white rounded-full">{project.category}</span>
                    </div>
                  </div>
                  <span className="block mt-6 text-xs font-semibold tracking-widest text-gray-500">Start Date: {new Date(project.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}</span>
                  <p className="mt-5 text-2xl font-semibold">
                    <Link to={`/projects/${project.id}`} className="text-black text-lg">{project.project_name}</Link>
                    <span>{project.category}</span>
                  </p>
                  <p className="mt-4 text-sm text-gray-600">{project.project_description.length > 120
                    ? project.project_description.slice(0, 120) + '...'
                    : project.project_description}</p>
                  <Link to={`/projects/${project.id}`} className="inline-flex items-center justify-center pb-0.5 mt-5 text-sm font-semibold text-blue-600 transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 focus:border-blue-600">
                        Continue Reading
                        <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-8 space-x-3 lg:hidden">
            <button type="button" className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button type="button" className="flex items-center justify-center text-gray-400 transition-all duration-200 bg-transparent border border-gray-300 rounded w-9 h-9 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section> */}
      {/* <hr className="mb-10" /> */}
    </motion.div>
  );
}

export default OurProjectsHome;

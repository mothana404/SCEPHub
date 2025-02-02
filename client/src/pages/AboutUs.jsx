import { useEffect } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/Navbar";
import { motion } from 'framer-motion';

function AboutUs() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-sans">
            <NavBar />
            <div className="bg-white py-12 mt-20 font-sans">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl lg:text-center flex flex-col justify-center items-center">
                        <h2 className="text-base font-semibold leading-7 text-blue-100 bg-blue-600 px-3 rounded-lg uppercase mb-4 lg:mb-8">
                            Why choose us?</h2>
                        <h1 className="lg:text-7xl text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-center">Creative, 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900"> Affordable, Managed</span>
                        </h1>
                        <p className="mt-6 text-md text-gray-600 max-w-xxl text-center">At ScepHub, we are dedicated to empowering individuals with real-world development skills through hands-on projects and structured courses. Our platform is designed to bridge the gap between theory and practice, ensuring that you not only learn the concepts but also apply them in real-life scenarios. Here’s why choosing us can accelerate your growth:</p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        className=""
                    >
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-12 lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700"><svg
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-white">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path>
                                        </svg></div>Creative and Innovative Solutions
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">We believe that every great project starts with a creative idea. Our platform is designed to bring fresh and innovative solutions to life. If you have a unique or creative project idea, we can help turn it into reality.</dd>
                                </div>
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700"><svg
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-white">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"></path>
                                        </svg></div>Professional Project Management
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">very project we take on is managed by a professional project manager. Our managers are experts in handling development projects, ensuring that they are completed on time, within budget, and to the highest standards.
                                    </dd>
                                </div>
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700"><svg
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-white">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                            </path>
                                        </svg></div>Affordable and Cost-Effective for Big Projects
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">Big projects don’t have to come with a big price tag. At ScepHub, we provide high-quality project development at a fraction of the cost. Whether it's a small feature or a large-scale project, we offer affordable rates without compromising on quality.</dd>
                                </div>
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700"><svg
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                            stroke="currentColor" aria-hidden="true" className="h-6 w-6 text-white">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z">
                                            </path>
                                        </svg></div>From Basic Idea to Fully Developed Project
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">At ScepHub, we specialize in taking projects from their most basic idea and developing them into fully functional products. Whether you have a rough concept or a fully fleshed-out vision, we work with you to refine the idea and create a detailed plan.</dd>
                                </div>
                            </dl>
                        </div>
                    </motion.div>
                </div>
            </div>
            {/* ===============================================================>> */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0 }}
                viewport={{ once: true, amount: 0.2 }}
                className=""
            >
                <section class="py-10 bg-gray-100 sm:py-16 lg:py-24">
                    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div class="max-w-2xl mx-auto text-center">
                            <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">How do we create success</h2>
                            <p class="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">At ScepHub, we believe that success is built through a combination of practical experience, continuous learning, and strong community support. By providing access to real-world projects and courses, we ensure that every user has the tools and resources they need to thrive.</p>
                        </div>
                        <ul class="max-w-md mx-auto mt-16 space-y-12">
                            <li class="relative flex items-start">
                                <div class="-ml-0.5 absolute mt-0.5 top-14 left-8 w-px border-l-4 border-dotted border-gray-300 h-full" aria-hidden="true"></div>
                                <div class="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                                    <svg class="w-10 h-10 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div class="ml-6">
                                    <h3 class="text-lg font-semibold text-black">Create a free account</h3>
                                    <p class="mt-4 text-base text-gray-600">Getting started is easy. Simply sign up on our platform, create your personal profile, and start exploring the wide range of projects and courses we offer.</p>
                                </div>
                            </li>
                            <li class="relative flex items-start">
                                <div class="-ml-0.5 absolute mt-0.5 top-14 left-8 w-px border-l-4 border-dotted border-gray-300 h-full" aria-hidden="true"></div>
                                <div class="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                                    <svg class="w-10 h-10 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                </div>
                                <div class="ml-6">
                                    <h3 class="text-lg font-semibold text-black">Select Your Projects and Courses</h3>
                                    <p class="mt-4 text-base text-gray-600">Browse through various project categories and choose the ones that match your interests and skill level. You can work on projects across different fields like web development, app development, and more. Choose your preferred instructors and select courses designed to improve your skills and knowledge.</p>
                                </div>
                            </li>
                            <li class="relative flex items-start">
                                <div class="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                                    <svg class="w-10 h-10 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div class="ml-6">
                                    <h3 class="text-lg font-semibold text-black">Hands-on Learning</h3>
                                    <p class="mt-4 text-base text-gray-600">Learning by doing is at the core of our approach. As you start working on projects, you will tackle real-world challenges that help you build practical, marketable skills. Instructors provide guidance, feedback, and support throughout the project lifecycle.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>
            </motion.div>
            {/* ===============================================================>> */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0 }}
                viewport={{ once: true, amount: 0.2 }}
                className=""
            >
                <section class="py-10 bg-gray-50 sm:py-16 lg:py-24">
                    <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                        <div class="max-w-2xl mx-auto text-center">
                            <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Integrate with apps</h2>
                            <p class="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">At scebHub, we leverage top-tier tools to enhance your project experience, ensuring everything runs smoothly from start to finish:</p>
                        </div>
                        <div class="grid grid-cols-1 gap-6 mt-12 lg:mt-16 xl:gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            <div class="overflow-hidden bg-white rounded shadow">
                                <div class="p-8">
                                    <div class="flex items-center">
                                        <img class="flex-shrink-0 w-12 h-auto" src="https://cdn.rareblocks.xyz/collection/celebration/images/integration/3/gmail-logo.png" alt="" />
                                        <div class="ml-5 mr-auto">
                                            <p class="text-xl font-semibold text-black">Gmail</p>
                                            <p class="mt-px text-sm text-gray-600">Direct Integration</p>
                                        </div>
                                        <svg class="hidden w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                    <p class="text-base leading-relaxed text-gray-600 mt-7">Stay informed and connected. Receive important project updates, assignments, and communications directly in your inbox.</p>
                                </div>
                            </div>
                            <div class="overflow-hidden bg-white rounded shadow">
                                <div class="p-8">
                                    <div class="flex items-center">
                                        <img class="flex-shrink-0 w-12 h-auto" src="https://static-00.iconduck.com/assets.00/github-repo-git-octocat-icon-2048x1997-568mf3yi.png" alt="" />
                                        <div class="ml-5 mr-auto">
                                            <p class="text-xl font-semibold text-black">GitHub</p>
                                            <p class="mt-px text-sm text-gray-600">Direct Integration</p>
                                        </div>
                                    </div>
                                    <p class="text-base leading-relaxed text-gray-600 mt-7">Manage your project repositories and branches seamlessly. Whether you’re collaborating on code, reviewing pull requests, or tracking changes.</p>
                                </div>
                            </div>
                            <div class="overflow-hidden bg-white rounded shadow">
                                <div class="p-8">
                                    <div class="flex items-center">
                                        <img class="flex-shrink-0 w-12 h-auto" src="https://www.gstatic.com/devrel-devsite/prod/va0674a8db96513470826a6ecbe1af5bc068cadff9b5aed0477a70013be17d6e8/firebase/images/touchicon-180.png" alt="" />
                                        <div class="ml-5 mr-auto">
                                            <p class="text-xl font-semibold text-black">Firebase Admin</p>
                                            <p class="mt-px text-sm text-gray-600">Direct Integration</p>
                                        </div>
                                    </div>
                                    <p class="text-base leading-relaxed text-gray-600 mt-7">Handle project assets securely and efficiently. From storing important files to managing real-time data, Firebase ensures a reliable backend infrastructure to support your projects.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </motion.div>
            {/* ============================================== */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0 }}
                viewport={{ once: true, amount: 0.2 }}
                className=""
            >
                <section class="py-10 bg-gray-100 sm:py-16 lg:py-24">
                    <div class="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                        <div class="max-w-2xl mx-auto text-center">
                            <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Numbers tell our story</h2>
                            <p class="mt-3 text-xl leading-relaxed text-gray-600 md:mt-8">At ScepHub, our impact is measured by the success of our community. With hundreds of completed projects, thousands of hours of hands-on learning, and a growing network of skilled developers.</p>
                        </div>
                        <div class="grid grid-cols-1 gap-8 mt-10 text-center lg:mt-24 sm:gap-x-8 md:grid-cols-3">
                            <div>
                                <h3 class="font-bold text-7xl">
                                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600"> 7+ </span>
                                </h3>
                                <p class="mt-4 text-xl font-medium text-gray-900">Years in business</p>
                                <p class="text-base mt-0.5 text-gray-500">Creating the successful path</p>
                            </div>
                            <div>
                                <h3 class="font-bold text-7xl">
                                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600"> 360 </span>
                                </h3>
                                <p class="mt-4 text-xl font-medium text-gray-900">Projects delivered</p>
                                <p class="text-base mt-0.5 text-gray-500">In last 6 years</p>
                            </div>
                            <div>
                                <h3 class="font-bold text-7xl">
                                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600"> 1000+ </span>
                                </h3>
                                <p class="mt-4 text-xl font-medium text-gray-900">Team members</p>
                                <p class="text-base mt-0.5 text-gray-500">Working for your success</p>
                            </div>
                        </div>
                    </div>
                </section>
            </motion.div>
            <hr className="h-10" />
            <Footer />
        </div>
    );
}

export default AboutUs;
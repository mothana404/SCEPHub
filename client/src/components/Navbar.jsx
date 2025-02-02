import React from 'react'
import { Link } from 'react-router-dom';
// import logo from '../assets/logo.png';

function NavBar() {
    return (
        <div className="font-sans">
  <nav className="fixed top-0 left-0 right-0 z-50">
    {/* Blur Background */}
    <div className="absolute inset-0 bg-white/70 backdrop-blur-lg"></div>

    {/* Nav Content */}
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="flex items-center space-x-3">
            {/* You can add your logo image here */}
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Scep
              </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hub
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <Link
            to={'/'}
            className="group relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
          >
            <span>Home</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          
          <Link
            to={'/Developers'}
            className="group relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
          >
            <span>Developers</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          
          <Link
            to={'/ContactUs'}
            className="group relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
          >
            <span>Contact Us</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          
          <Link
            to={'/AboutUs'}
            className="group relative px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 hover:text-blue-600"
          >
            <span>About Us</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
        </div>

        {/* Login Button */}
        <div className="flex items-center">
          <Link
            to={'/SignIn'}
            className="group relative inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-blue-500/25"
          >
            <span className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
            <svg
              className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z" />
            </svg>
            Login
          </Link>
        </div>

        {/* Mobile Menu Button (You'll need to implement the mobile menu functionality) */}
        <div className="lg:hidden">
          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</div>
    )
}

export default NavBar;




















// <header className="text-slate-700 container relative mx-auto flex flex-col overflow-hidden px-4 py-4 lg:flex-row lg:items-center">
//     <Link to="/HomePage" className="flex items-center whitespace-nowrap text-2xl font-black">
//         <span className="mr-2 w-8">
//             <img src="https://png.pngtree.com/png-vector/20220926/ourmid/pngtree-company-logo-png-image_6145477.png" alt="company logo" />
//         </span>
//         ScepHub
//     </Link>
//     <input type="checkbox" className="peer hidden" id="navbar-open" />
//     <label className="absolute top-5 right-5 cursor-pointer lg:hidden" for="navbar-open">
//         <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
//         </svg>
//     </label>
//     <nav aria-label="Header Navigation" className="peer-checked:pt-8 peer-checked:max-h-60 flex max-h-0 w-full flex-col items-center overflow-hidden transition-all lg:ml-24 lg:max-h-full lg:flex-row">
//         <ul className="flex w-full flex-col items-center space-y-2 lg:flex-row lg:justify-center lg:space-y-0">
//             <li className="lg:mr-12"><Link className="rounded text-gray-700 transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2" to="/HomePage">Home</Link></li>
//             <li className="lg:mr-12"><Link className="rounded text-gray-700 transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2" to="/Services">Services</Link></li>
//             <li className="lg:mr-12"><Link className="rounded text-gray-700 transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2" to="/ContactUs">Contact</Link></li>
//             <li className="lg:mr-12"><Link className="rounded text-gray-700 transition focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2" to="/AboutUs">About Us</Link></li>
//         </ul>
//         <hr className="mt-4 w-full lg:hidden" />
//         <div className="my-4 flex items-center space-x-6 space-y-2 lg:my-0 lg:ml-auto lg:space-x-8 lg:space-y-0">
//             <a href="#" title="" className="whitespace-nowrap rounded font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-2 hover:text-opacity-50"> Log in </a>
//             <a href="#" title="" className="whitespace-nowrap rounded-xl bg-blue-700 px-5 py-3 font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 hover:bg-blue-600">Get free trial</a>
//         </div>
//     </nav>
// </header>
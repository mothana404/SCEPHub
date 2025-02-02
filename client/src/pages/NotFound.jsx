import React from 'react'

function NotFound() {
    return (
        <div className="h-screen bg-gray-50 flex items-center font-sans">
            <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
                <div className="w-full lg:w-1/2 ml-20">
                    <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">404</div>
                    <p className="text-2xl md:text-3xl font-light leading-normal mb-8">Sorry we couldn't find the page you're looking for</p>
                </div>
                <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
                    <img src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg" className="" alt="Page not found" />
                </div>
            </div>
        </div>
    );
}

export default NotFound;
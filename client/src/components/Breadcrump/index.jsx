// src/components/Breadcrump/Breadcrumb.js

import React from 'react';
import { Link } from 'react-router-dom';
import breadcrumbsImg from "../../assets/breadcrumbs/1.jpg";

const Breadcrumb = ({ pageTitle }) => {
    return (
        <div className="react-breadcrumbs bg-gray-800 text-white">
            <div className="relative overflow-hidden h-40 sm:h-48 md:h-56">
                <img
                    className="w-full h-full object-cover"
                    src={breadcrumbsImg}
                    alt="Breadcrumbs"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                {pageTitle || 'Breadcrumbs'}
                            </h1>
                            <div className="back-nav text-gray-300 text-xs sm:text-sm">
                                <ul className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-2">
                                    <li>
                                        <Link to="/dashboard" className="hover:text-indigo-500 transition-colors duration-300">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <span>/</span>
                                    </li>
                                    <li>{pageTitle || 'Breadcrumbs'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;

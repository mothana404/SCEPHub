import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

function HeroSection() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-900 font-sans">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-gray-900/90 to-purple-900/90 z-10"></div>
                
                {/* Animated Dots */}
                <div className="absolute inset-0 z-0" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: `32px 32px`
                    }}>
                </div>

                {/* Background Image */}
                <img
                    className="object-cover w-full h-full transform scale-105 animate-slow-zoom"
                    src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop"
                    alt=""
                />
            </div>

            {/* Content */}
            <div className="relative z-20 px-6 py-24 mx-auto max-w-7xl sm:px-8 lg:px-12 min-h-screen flex items-center">
                <div className="w-full lg:w-3/4">
                    {/* Subtitle with animated border */}
                    <div className="inline-block">
                        <span className="relative inline-flex px-4 py-2 text-sm text-blue-300 tracking-wider uppercase">
                            <span className="relative z-10">Master the fundamentals of coding</span>
                            <span className="absolute inset-0 border border-blue-500/30 animate-border-glow"></span>
                        </span>
                    </div>

                    {/* Main Heading */}
                    <div className="mt-8 space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                            The road to
                        </h1>
                        <div className="h-20"> {/* Fixed height container for animation */}
                            <TypeAnimation
                                sequence={[
                                    'Real-World Projects',
                                    2000,
                                    'Master Skills',
                                    2000,
                                    'Your Future',
                                    2000,
                                ]}
                                wrapper="span"
                                cursor={true}
                                repeat={Infinity}
                                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <p className="mt-8 text-lg text-gray-300 leading-relaxed max-w-2xl backdrop-blur-sm bg-gray-900/10 p-6 rounded-lg border border-white/10">
                        At ScepHub, we empower individuals and teams to master new skills, work on real-world projects, and grow professionally. Whether you're learning to build or building to learn, our platform is designed to help you thrive in the ever-evolving tech industry.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/AboutUs"
                            className="group relative px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-in-out"
                        >
                            <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out transform translate-x-1 translate-y-1 bg-purple-600 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                            <span className="absolute inset-0 w-full h-full border-2 border-white"></span>
                            <span className="relative">Read About Us</span>
                        </Link>

                        <Link
                            to="/SignUp"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-in-out"
                        >
                            <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-in-out transform translate-x-1 translate-y-1 bg-blue-600 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                            <span className="absolute inset-0 w-full h-full border-2 border-white"></span>
                            <span className="relative">Create New Account</span>
                        </Link>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute bottom-0 right-0 -mb-40 -mr-40 hidden lg:block">
                        <div className="transform rotate-45">
                            <div className="w-64 h-64 border border-white/10 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection
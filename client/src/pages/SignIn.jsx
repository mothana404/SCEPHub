// src/pages/SignIn.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../redux/authSlice';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user, accessToken, role } = useSelector((state) => state.auth);

    const [user_email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');

    const validate = (fieldName, value) => {
        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            case 'password':
                return value.length >= 8;
            default:
                return false;
        }
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        if (!validate('email', user_email) || !validate('password', password) ) {
            Swal.fire({
                title: 'Invalid Input',
                text: 'Please provide a valid email, password (minimum 8 characters), and select a role.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        dispatch(signIn({ user_email, password}));
    };

    useEffect(() => {
        if (accessToken) {
            navigate('/dashboard');
        }
        if (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }, [accessToken, error, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/30 animate-pulse"></div>
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                        backgroundSize: `20px 20px`
                    }}
                ></div>
            </div>

            {/* Card Container */}
            <div className="relative w-full max-w-md mx-auto">
                <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex p-3 rounded-full bg-blue-50 mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Welcome Back
                        </h2>
                        <p className="mt-3 text-gray-500">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignIn} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                    />
                                </svg>
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    type="email"
                                    value={user_email}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                                {validate('email', user_email) && (
                                    <div className="absolute right-3 top-3 text-green-500">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                    />
                                </svg>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                {validate('password', password) && (
                                    <div className="absolute right-3 top-3 text-green-500">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full inline-flex items-center justify-center px-8 py-3 overflow-hidden text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg group focus:ring-4 focus:ring-blue-300 focus:outline-none hover:shadow-lg transition-all duration-300"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                            <span className="relative flex items-center justify-center">
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {loading ? 'Signing In...' : 'Sign in'}
                            </span>
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center mt-6">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link
                                to="/SignUp"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;

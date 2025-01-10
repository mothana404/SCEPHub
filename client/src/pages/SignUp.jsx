// src/pages/SignUp.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../redux/authSlice';

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: 'Student',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setRole = (selectedRole) => {
    setFormData({
      ...formData,
      role: selectedRole,
    });
  };

  const validateForm = () => {
    const { user_name, user_email, phone_number, password, confirm_password } = formData;
    if (!user_name || !user_email || !phone_number || !password || !confirm_password) {
      Swal.fire({
        title: 'Incomplete Data',
        text: 'Please fill in all the fields',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }
    if (password !== confirm_password) {
      Swal.fire({
        title: 'Password Mismatch',
        text: 'Please make sure the password matches the confirm password',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return false;
    }
    // Additional validations can be added here (e.g., email format, password strength)
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(signUp(formData))
      .unwrap()
      .then(() => {
        navigate('/SignIn');
      })
      .catch((err) => {
        // Errors are already handled in the slice via Swal
      });
  };

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
    <div className="relative w-full max-w-xl mx-auto">
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl p-10">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-blue-50 mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Create Account
                </h2>
                <p className="mt-3 text-gray-500">Choose your role</p>
            </div>

            {/* Role Selection */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    name="Instructor"
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        formData.role === 'Instructor'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setRole('Instructor')}
                    aria-pressed={formData.role === 'Instructor'}
                >
                    Instructor
                </button>
                <button
                    name="Student"
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        formData.role === 'Student'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => setRole('Student')}
                    aria-pressed={formData.role === 'Student'}
                >
                    Student
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields */}
                {[
                    { label: 'User Name', name: 'user_name', type: 'text', placeholder: 'Your name', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                    { label: 'Email', name: 'user_email', type: 'email', placeholder: 'you@example.com', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'Phone Number', name: 'phone_number', type: 'text', placeholder: '07 *778 7***', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                    { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                    { label: 'Confirm Password', name: 'confirm_password', type: 'password', placeholder: '••••••••', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
                ].map((field) => (
                    <div key={field.name} className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={field.icon} />
                            </svg>
                            {field.label}
                        </label>
                        <input
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </span>
                </button>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link
                        to="/SignIn"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    >
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    </div>
</div>
  );
}

export default SignUp;

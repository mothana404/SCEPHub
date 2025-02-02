import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  HiOutlineMenuAlt2, 
  HiOutlineBell, 
  HiOutlineCog, 
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineUserCircle
} from 'react-icons/hi';

function Header({ toggleDrawer }) {
    const [userAccount, SetUserAccount] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Fetch user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8000/user/info', { 
                    withCredentials: true 
                });
                SetUserAccount(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error.message);
            }
        };

        fetchUserInfo();
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        Cookies.remove('refresh_token');
        Cookies.remove('access_token');
        dispatch(logout());
        navigate('/SignIn');
    };

    // Get profile update URL based on role
    const getUpdateProfileUrl = () => {
        const roleUrls = {
            1: `/updateStudentProfile/${userAccount.user_id}`,
            2: `/updateInstructorProfile/${userAccount.user_id}`,
            3: `/updateAdminProfile/${userAccount.user_id}`,
        };
        return roleUrls[userAccount.role] || '/profile';
    };

    if (!userAccount) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 font-sans">
            <div className="bg-white border-b border-gray-200 px-4 py-1">
                <div className="flex items-center justify-between">
                    {/* Left Section: Logo and Toggle */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDrawer}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
                        >
                            <HiOutlineMenuAlt2 className="w-6 h-6" />
                        </button>

                        <div className="flex items-center space-x-3">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/7509/7509527.png" 
                                alt="Logo" 
                                className="w-10 h-10"
                            />
                            <span className="text-xl font-bold text-[#041643]">
                                SCEPHUB
                            </span>
                        </div>
                    </div>

                    {/* Right Section: User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Notification Bell */}
                        {/* <button className="p-2 text-gray-500 rounded-lg hover:bg-gray-100">
                            <HiOutlineBell className="w-6 h-6" />
                        </button> */}

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <img
                                    src={userAccount.user_img || 'https://via.placeholder.com/40'}
                                    alt="User"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-700">
                                        {userAccount.user_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {userAccount.user_email}
                                    </p>
                                </div>
                            </button>

                            {/* User Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                                    {/* User Info Section */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-700">
                                            Signed in as
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {userAccount.user_email}
                                        </p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <NavLink
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <HiOutlineUser className="w-5 h-5 mr-3" />
                                            My Profile
                                        </NavLink>

                                        <Link
                                            to={getUpdateProfileUrl()}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <HiOutlineCog className="w-5 h-5 mr-3" />
                                            Settings
                                        </Link>

                                        <div className="border-t border-gray-100 my-2"></div>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <HiOutlineLogout className="w-5 h-5 mr-3" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className='bg-white shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/' className='flex items-center'>
          <h1 className='text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors'>
            Auth App
          </h1>
        </Link>

        <div className='flex items-center space-x-6'>
          <nav className='hidden md:flex space-x-6'>
            <Link 
              to='/home' 
              className='text-gray-700 hover:text-indigo-600 font-medium transition-colors'
            >
              Home
            </Link>
            <Link 
              to='/about' 
              className='text-gray-700 hover:text-indigo-600 font-medium transition-colors'
            >
              About
            </Link>
          </nav>

          <div className='relative'>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className='flex items-center space-x-1 focus:outline-none'
            >
              <FaUserCircle className='w-8 h-8 text-gray-600 hover:text-indigo-600 transition-colors' />
            </button>

            {isProfileOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
                <Link
                  to='/profile'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  onClick={() => setIsProfileOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to='/settings'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to='/signout'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border-t border-gray-100'
                  onClick={() => setIsProfileOpen(false)}
                >
                  Sign Out
                </Link>
              </div>
            )}
          </div>

          <Link 
            to='/signin'
            className='md:hidden text-gray-700 hover:text-indigo-600 font-medium transition-colors'
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
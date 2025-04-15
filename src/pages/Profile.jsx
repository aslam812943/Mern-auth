import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserSuccess } from '../redux/User/userSlice.js';

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempImage, setTempImage] = useState(null); 

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (tempImage) {
        URL.revokeObjectURL(tempImage);
      }
    };
  }, [tempImage]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
  
    setLoading(true);
    setError('');
    
    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setTempImage(previewUrl);

      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${currentUser?.token || ''}`
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      // Update Redux store with the new profile picture
      dispatch(updateUserSuccess({
        profilePicture: data.imageUrl || data.user?.profilePicture
      }));

      // Clear temp image after successful upload
      setTempImage(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload image');
      setTempImage(null); // Clear failed preview
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Profile Settings</h1>
      
      <div className="flex flex-col items-center mb-8">
        <input 
          type="file" 
          ref={fileRef} 
          hidden 
          accept='image/*'
          onChange={handleImageChange}
          disabled={loading}
        />
        
        <div className="relative w-40 h-40 mb-4">
          <img 
            src={tempImage || currentUser?.profilePicture || '/default-profile.png'}
            alt="profile" 
            onClick={() => !loading && fileRef.current.click()}
            className={`w-full h-full rounded-full object-cover border-4 border-gray-200 cursor-pointer transition-opacity duration-300 ${
              loading ? 'opacity-60' : 'hover:opacity-80'
            }`}
          />
          
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin mb-2"></div>
              <p className="text-white text-sm">Uploading...</p>
            </div>
          )}
        </div>
        
        <button 
          type="button" 
          onClick={() => fileRef.current.click()}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
          disabled={loading}
        >
          Change Photo
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-center mb-6">{error}</p>
      )}

      <form className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input 
            type="text" 
            id="username" 
            defaultValue={currentUser?.username || ''} 
            placeholder="Enter your username" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input 
            type="email" 
            id="email" 
            defaultValue={currentUser?.email || ''} 
            placeholder="Enter your email" 
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        
        <div className="mb-8">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            New Password
          </label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter new password" 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          type="submit" 
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import perosonol from '../assets/persononlaptop.webp';
import { FiCamera } from 'react-icons/fi';
import Navbar from '../Components/Navbar';
import { logOut } from '../services/authService';
import { useAuth } from "../context/useAuth";
import { getProfile, updateProfile, uploadAvatar } from '../services/profileService';
import UserImage from '../assets/user.png';

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    postalCode: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load the profile row created when the Supabase account was registered.
  useEffect(() => {
    let active = true;
    async function fetchProfile() {
      if (!currentUser) return;
      try {
        const profile = await getProfile(currentUser.id);
        if (active) setProfileData(profile);
      } catch (error) {
        console.error('Could not load profile:', error);
        if (active) setProfileData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phone: '', location: '', postalCode: '', photoURL: currentUser.photoURL || '',
        });
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchProfile();
    return () => { active = false; };
  }, [currentUser]);

  useEffect(() => {
    if (!userProfile) return;
    setProfileData({
      displayName: userProfile.displayName || '',
      email: userProfile.email || currentUser?.email || '',
      phone: userProfile.phone || '',
      location: userProfile.location || '',
      postalCode: userProfile.postalCode || '',
      photoURL: userProfile.photoURL || '',
    });
  }, [userProfile, currentUser?.email]);

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  // Save profile changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await updateProfile(currentUser.id, profileData);
      alert('Profile updated!');
    } catch (error) {
      console.error('Could not update profile:', error);
      alert(error.message || 'Could not update profile.');
    }
  };

  // Handle profile picture upload
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      alert('Choose an image smaller than 5 MB.');
      return;
    }
    try {
      const url = await uploadAvatar(currentUser.id, file);
      setProfileData((prev) => ({ ...prev, photoURL: url }));
    } catch (error) {
      console.error('Could not upload avatar:', error);
      alert(error.message || 'Could not upload your photo.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar userPhoto={userProfile?.photoURL || profileData?.photoURL || UserImage} />
      <div className="min-h-screen bg-transparent mt-4">
        <div className="lg:hidden fixed top-4 left-4 z-20">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className={`
            fixed lg:static inset-0 z-10 transform
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300 ease-in-out
            w-64 min-h-screen bg-white border-r border-gray-200 px-4 py-6
          `}>
            <h1 className="text-xl font-bold mb-8">User Profile</h1>
            <nav className="space-y-4">
              <div className="flex items-center text-gray-700 hover:text-red-500 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>User info</span>
              </div>
              <div className="flex items-center text-red-500 hover:text-red-600 cursor-pointer mt-auto pt-8" onClick={handleLogout}>
                <span>Log out</span>
              </div>
            </nav>
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center mb-8">
                <div className="relative mb-4 sm:mb-0">
                  <img
                    src={userProfile?.photoURL || profileData?.photoURL || perosonol}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <label className="absolute bottom-0 right-0 bg-red-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center cursor-pointer">
                    <FiCamera size={14} color="#fff" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div className="ml-0 sm:ml-4 text-center sm:text-left">
                  <h2 className="text-2xl font-semibold">{profileData?.displayName || profileData?.email}</h2>
                  <p className="text-gray-500">{profileData?.location}</p>
                </div>
              </div>

              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      placeholder="Enter display name"
                      value={profileData?.displayName || ''}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={profileData?.email || ''}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={profileData?.phone || ''}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. New York, USA"
                      value={profileData?.location || ''}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      placeholder="Enter postal code"
                      value={profileData?.postalCode || ''}
                      onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

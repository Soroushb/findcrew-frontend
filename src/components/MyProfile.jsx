import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { updateUserProfile } from '../frontend/firebase/firebase'; // Import the update function

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState(null);
  const [location, setLocation] = useState(user?.location || '');
  const [skills, setSkills] = useState(user?.skills || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let profilePicUrl = user?.photoURL;

      if (profilePic) {
        // Call the function to upload the new profile picture and get the download URL
        profilePicUrl = await updateUserProfile(profilePic);
      }

      // Update the user's profile (location, skills, etc.)
      const updatedUser = {
        displayName: user?.displayName,
        email: user?.email,
        location,
        skills,
        bio,
        photoURL: profilePicUrl, // Add the new profile picture URL
      };
      setUser(updatedUser);

      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    }
  };

  return (
    <div className='flex justify-center items-center'>
      <div className='m-20 bg-gray-300 p-12 rounded-lg flex flex-col justify-start'>
        <h2 className='text-2xl m-2 font-semibold mb-10'>Update Profile</h2>
        <form className='flex flex-col items-start' onSubmit={handleSubmit}>
          <label className='pl-2'>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="mb-4"
          />
          <label className='pl-2'>Location</label>
          <input
            className='rounded-md p-2 m-2'
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label className='pl-2'>Skills</label>
          <input
            className='rounded-md p-2 m-2'
            type="text"
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <label className='pl-2'>Bio</label>
          <textarea
            className='rounded-md p-2 m-2'
            placeholder="Write your bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div></div>
          <div className='flex self-center mt-4'>
            <button className='text-white bg-black p-2 rounded-lg' type="submit">Update Profile</button>
          </div>
        </form>
        {error && <p className='bg-red-500 p-2 rounded-lg'>{error}</p>}
        {success && <p className='bg-green-500 p-2 rounded-lg'>Profile Updated!</p>}
      </div>
    </div>
  );
};

export default MyProfile;
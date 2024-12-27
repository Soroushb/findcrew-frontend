import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { updateUserInfo, getUserInfo } from '../frontend/firebase/firebase';

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch user info on component mount
  useEffect(() => {
    if (user?.uid) {
      const fetchUserInfo = async () => {
        const userData = await getUserInfo(user.uid);
        if (userData) {
          setLocation(userData.location);
          setSkills(userData.skills);
          setBio(userData.bio);
        }
      };

      fetchUserInfo();
    }
  }, [user]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const updatedUser = {
      location,
      skills,
      bio,
    };

    await updateUserInfo(user?.uid, updatedUser);

    // Preserving user state with all necessary properties
    setUser((prevUser) => ({
      ...prevUser, // keep the existing user data
      location,
      skills,
      bio,
    }));

    setSuccess(true);
    setError('');
  } catch (err) {
    setError('Failed to update profile: ' + err.message);
  }
};

  return (
    <div className="flex justify-center items-center">
      <div className="m-20 bg-gray-300 p-12 rounded-lg flex flex-col justify-start">
        <h2 className="text-2xl m-2 font-semibold mb-10">Update Profile</h2>
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <label className="pl-2">Location</label>
          <input
            className="rounded-md p-2 m-2"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <label className="pl-2">Skills</label>
          <input
            className="rounded-md p-2 m-2"
            type="text"
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <label className="pl-2">Bio</label>
          <textarea
            className="rounded-md p-2 m-2"
            placeholder="Write your bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div className="flex self-center mt-4">
            <button className="text-white bg-black p-2 rounded-lg" type="submit">
              Update Profile
            </button>
          </div>
        </form>
        {error && <p className="bg-red-500 p-2 rounded-lg">{error}</p>}
        {success && <p className="bg-green-500 p-2 rounded-lg">Profile Updated!</p>}
      </div>
    </div>
  );
};

export default MyProfile;

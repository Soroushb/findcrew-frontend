import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { updateUserInfo, getUserInfo, sendConnectionRequest, fetchConnectionRequests } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { useParams } from 'react-router-dom';

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState([]); 
  const [name, setName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selfProfile, setSelfProfile] = useState(false);
  const { id } = useParams();
  console.log(`${id} and ${user?.uid}`);

  const fetchUserInfo = async () => {
    try {
      const userData = await getUserInfo(id);
      if (userData) {
        setLocation(userData.updatedData.location);
        setSkills(userData.updatedData.skills);
        setBio(userData.updatedData.bio);
        setName(userData.displayName);
        setRole(userData.updatedData.role);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (id && user?.uid) {
      setSelfProfile(id === user?.uid);
    } else {
      setSelfProfile(false);
    }
    console.log("Self Profile:", id === user?.uid);
    fetchUserInfo();
  }, [id, user]); 

  useEffect(() => {
    const fetchRequests = async () => {
      if (user?.uid) {
        try {
          const requests = await fetchConnectionRequests(user.uid);
          console.log(requests); // Log the fetched data
          setConnectionRequests(requests);
        } catch (error) {
          console.error("Error fetching connection requests:", error);
        }
      }
    };
  
    fetchRequests();
  }, [user]);

  const handleConnect = async () => {
    try {
      if (user?.uid && id) {
        await sendConnectionRequest(user.uid, id);
        alert("Connection request sent!");
      } else {
        alert("Unable to send connection request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        location,
        skills,
        bio, 
        role
      };

      await updateUserInfo(user?.uid, updatedUser);

      setUser((prevUser) => ({
        ...prevUser,
        location,
        skills,
        bio,
        role
      }));

      setSuccess(true);
      setEditMode(false);
      setError('');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {!editMode && (
        <div className='flex flex-col'>
          <div className='flex w-screen p-20 justify-between'>
            <h1 className='text-2xl font-semibold px-14'>My Profile</h1>
            {selfProfile ? (
              <div className='flex'>
                <div onClick={() => setEditMode(true)} className='bg-black hover:scale-110 hover:cursor-pointer text-white p-2 h-full rounded-lg'>
                  Edit Profile
                </div>
              </div>
            ) : (
              <div className='flex'>
                <div onClick={handleConnect} className='bg-black hover:scale-110 hover:cursor-pointer text-white p-2 h-full rounded-lg'>
                  Connect
                </div>
              </div>
            )}
          </div>
          <div className='flex p-10 mx-20 justify-between w-full'>
            <img src={images?.profile} alt="profile-pic" />
            <div className='w-2/3 mr-10'>
              <h1 className='text-2xl font-semibold'>Bio:</h1>
              <h2>{bio.substring(0, 250)}...</h2>
            </div>
          </div>
          <div className='flex flex-col justify-start items-start px-20 py-10'>
            <h2 className='bg-gray-300 text-start p-3 rounded-lg w-1/3 m-2 flex'>
              <p className='mx-2 font-semibold'>Name:</p> {name}
            </h2>
            <h2 className='bg-gray-300 text-start p-3 rounded-lg w-1/3 m-2 flex'>
              <p className='mx-2 font-semibold'>Role:</p> {role}
            </h2>
            <h2 className='bg-gray-300 text-start p-3 rounded-lg w-1/3 m-2 flex'>
              <p className='mx-2 font-semibold'>Location:</p> {location}
            </h2>
          </div>
        </div>
      )}
      
      {editMode && (
        <div className="m-20 bg-gray-300 p-12 rounded-lg relative flex flex-col justify-start">
          <div onClick={() => setEditMode(false)} className="absolute top-2 right-2 bg-black hover:scale-110 font-semibold w-fit text-white rounded-full px-3 pb-1 cursor-pointer">
            x
          </div>
          <div className='flex'>
            <h2 className="text-2xl m-2 font-semibold mb-10">Update Profile</h2>
          </div>
          <form className="flex flex-col items-start" onSubmit={handleSubmit}>
            <label className="pl-2">Role</label>
            <input className="rounded-md p-2 m-2" type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
            <label className="pl-2">Location</label>
            <input className="rounded-md p-2 m-2" type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <label className="pl-2">Skills</label>
            <input className="rounded-md p-2 m-2" type="text" placeholder="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
            <label className="pl-2">Bio</label>
            <textarea className="rounded-md p-2 m-2" placeholder="Write your bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            <div className="flex self-center mt-4">
              <button className="text-white bg-black p-2 rounded-lg" type="submit">Update Profile</button>
            </div>
          </form>
          {error && <p className="bg-red-500 p-2 rounded-lg">{error}</p>}
          {success && <p className="bg-green-500 p-2 rounded-lg">Profile Updated!</p>}
        </div>
      )}
      {selfProfile && (
        <div>
        <h2>Connection Requests</h2>
        {connectionRequests.length > 0 ? (
          <ul>
            {connectionRequests.map((request, index) => (
              <li key={index}>
                Request from: {request.senderUid} at {new Date(request.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No connection requests yet.</p>
        )}
      </div>
      )}
    </div>
  );
};

export default MyProfile;

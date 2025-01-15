import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { updateUserInfo, getUserInfo, updateUserField, sendConnectionRequest, fetchConnectionRequests, updateUserBio } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { useParams } from 'react-router-dom';

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [editBio, setEditBio] = useState(false)
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
        setLocation(userData?.location);
        setSkills(userData?.skills);
        setBio(userData?.bio);
        setName(userData?.displayName);
        setRole(userData?.role);
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
  

  const handleSaveBio = async () => {
    try {
      
      await updateUserField(user?.uid, "bio" ,bio);

      setUser((prevUser) => ({
        ...prevUser,
        bio,
      }));

      setEditBio(false); // Exit edit mode
    } catch (err) {
      console.error('Failed to update bio:', err.message);
    }
  };


  const handleConnect = async () => {
    try {
      if (user?.uid && id) {
        await sendConnectionRequest(user?.uid, id);
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
            {selfProfile ? (<h1 className='text-2xl font-semibold px-14'>My Profile</h1>
            ) : (<h1 className='text-2xl font-semibold px-14'>{name?.toUpperCase()}</h1>)}
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
            <div className='w-2/3 mr-10 flex flex-col items-start'>
              <h1 className='text-2xl font-semibold my-2 bg-yellow-300 p-2 px-4 rounded-lg'>Bio:</h1>

              <div className='border border-yellow-500 w-5/6 rounded-lg p-4'>
              {editBio ? (
                <div>
                <textarea
                  className="w-full border p-2 rounded-md"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="text-white bg-green-500 px-4 py-1 rounded-lg mr-2"
                    onClick={handleSaveBio}
                  >
                    Save
                  </button>
                  <button
                    className="text-white bg-gray-500 px-4 py-1 rounded-lg"
                    onClick={() => setEditBio(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              ) : (

              <div className="flex justify-between items-center">
                  <h2 className="text-sm">{bio?.substring(0,250) || 'No bio available.'}</h2>
                  {selfProfile && (
                    <button
                      className="text-blue-500 underline ml-4"
                      onClick={() => setEditBio(true)}
                    >
                      Edit
                    </button>
                  )}
                </div>)}
              <h2 className='text-sm'>{bio?.substring(0, 250)}...</h2>
              </div>
          </div>
          </div>
          <div className='grid grid-cols-2 w-full'>
          <div className='flex flex-col justify-start items-start px-20 py-10'>
            <h2 className='bg-gray-300 w-full text-start p-3 rounded-lg m-2 flex'>
              <p className='mx-2 font-semibold'>Name:</p> {name ? name : ""}
            </h2>
            <h2 className='bg-gray-300 text-start p-3 rounded-lg w-full m-2 flex'>
              <p className='mx-2 font-semibold'>Role:</p> {role ? role : ""}
            </h2>
            <h2 className='bg-gray-300 text-start p-3 rounded-lg w-full m-2 flex'>
              <p className='mx-2 font-semibold'>Location:</p> {location ? location : ""}
            </h2>
          </div>
        <div className='p-10'>
        {selfProfile && (
        <div className='bg-gray-900 p-4 w-fit text-white rounded-md'>
        <h2 className='text-xl'>Connection Requests</h2>
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
            <input className="rounded-md p-2 m-2" type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value.toLowerCase())} />
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
      
    </div>
  );
};

export default MyProfile;

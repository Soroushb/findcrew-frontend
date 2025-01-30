import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { updateUserInfo, getUserInfo, updateUserField, sendConnectionRequest, fetchConnectionRequests } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { MdModeEdit } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth, storage } from "../frontend/firebase/firebase"; // Adjust the import path based on your directory structure
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage utilities

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [editBio, setEditBio] = useState(false)
  const [filter, setFilter] = useState("")
  const [picture, setPicture] = useState("")
  const [editName, setEditName] = useState(false)
  const [editRole, setEditRole] = useState(false)
  const [editLocation, setEditLocation] = useState(false)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState([]); 
  const [name, setName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selfProfile, setSelfProfile] = useState(false);
  const { id } = useParams();
  const [requestNames, setRequestNames] = useState([]);
  const navigate = useNavigate()

  const filmIndustryRoles = [
    "Director",
    "Producer",
    "Executive Producer",
    "Screenwriter",
    "Actor/Actress",
    "Casting Director",
    "Cinematographer",
    "Camera Operator",
    "Gaffer",
    "Best Boy Electric",
    "Lighting Technician",
    "Boom Operator",
    "Sound Mixer",
    "Sound Designer",
    "Foley Artist",
    "Music Composer",
    "Production Designer",
    "Art Director",
    "Set Decorator",
    "Prop Master",
    "Costume Designer",
    "Wardrobe Supervisor",
    "Hair Stylist",
    "Makeup Artist",
    "Special Effects Makeup Artist",
    "Line Producer",
    "Production Coordinator",
    "1st Assistant Director",
    "2nd Assistant Director",
    "Production Assistant (PA)",
    "Film Editor",
    "Colorist",
    "VFX Supervisor",
    "VFX Artist",
    "Motion Graphics Artist",
    "Sound Editor",
    "Music Editor",
    "Special Effects Supervisor",
    "Stunt Coordinator",
    "Stunt Performer",
    "Script Supervisor",
    "Location Manager",
    "Location Scout",
    "Storyboard Artist",
    "Unit Production Manager",
    "Publicist",
    "Marketing Coordinator",
    "Studio Executive",
    "Set Photographer",
    "Choreographer"
  ];

  const fetchUserInfo = async () => {
    try {
      const userData = await getUserInfo(id);
      if (userData) {
        setLocation(userData?.location);
        setSkills(userData?.skills);
        setBio(userData?.bio);
        setName(userData?.displayName);
        setRole(userData?.role);
        setPicture(userData?.profilePicture)
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {

    const fetchAllRequestUsernames = async () => {
      try {
        const names = await Promise.all(
          connectionRequests.map((request) => getUserInfo(request?.senderUid))
        );
        setRequestNames(names.map((user) => user?.displayName));
      } catch (err) {
        console.error("Error fetching usernames:", err);
      }
    };
  
    if (connectionRequests.length > 0) {
      fetchAllRequestUsernames();
      console.log(requestNames)
    }

  }, [connectionRequests]);

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
          console.log(requests); 
          setConnectionRequests(requests);
        } catch (error) {
          console.error("Error fetching connection requests:", error);
        }
      }
    };
  
    fetchRequests();
  }, [user]);
  


  const handleSaveField = async (field, value) => {
    try { 
      await updateUserField(user?.uid, field ,value);
      setUser((prevUser) => ({
        ...prevUser,
        bio,
      }));
      setEditBio(false);
      setEditName(false);
      setEditRole(false);
      setEditLocation(false);
    } catch (err) {
      console.error('Failed to update bio:', err.message);
    }
  };



  const handleConnect = async  () => {
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

  
  const uploadProfilePicture = async (file) => {
    if (!auth.currentUser) {
      setError("User is not authenticated.");
      return;
    }
  
    const uid = auth.currentUser.uid;
  
    try {
      setError(null);
      setSuccess(false);
  
      // Upload profile picture
      const fileRef = ref(storage, `profilePictures/${uid}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const profilePictureURL = await getDownloadURL(snapshot.ref);
  
      // Update Firestore with the new profile picture URL
      await updateUserField(uid, "profilePicture", profilePictureURL);
  
      // Update the local state
      setPicture(profilePictureURL);
      setSuccess(true);
    } catch (err) {
      setError("Failed to update profile picture. Please try again.");
      console.error(err);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!auth.currentUser) {
      setError("User is not authenticated.");
      return;
    }
  
    const uid = auth.currentUser.uid;
  
    try {
      setError(null);
      setSuccess(false);
  
      // Upload profile picture if a file is selected
      let profilePictureURL = null;
      if (profilePicture) {
        const fileRef = ref(storage, `profilePictures/${uid}/${profilePicture.name}`);
        const snapshot = await uploadBytes(fileRef, profilePicture);
        profilePictureURL = await getDownloadURL(snapshot.ref);
      }
  
      // Update Firestore with profile details
      const updatedData = {
        role,
        location,
        skills,
        bio,
        ...(profilePictureURL && { profilePicture: profilePictureURL }), // Add picture URL if it exists
      };
  
      await updateUserInfo(uid, updatedData);
  
      setSuccess(true);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center">
     
      {!editMode && (
        <div className='flex flex-col'>
          <div className='flex flex-col lg:flex-row w-screen items-center lg:px-20 lg:py-10 p-10 justify-between'>
            {selfProfile ? (<h1 className='text-4xl font-semibold my-2 px-14'>My Profile</h1>
            ) : (<h1 className='text-4xl font-semibold my-2 px-14'>{name?.toUpperCase()}</h1>)}
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

          <div className='flex overflow-hidden lg:flex-row flex-col p-10 lg:mx-20 justify-between'>
            <div className='w-72 h-72 relative'>
            {selfProfile && <>
              <input 
              id='fileInput'
              className="rounded-md p-2 m-2 hidden" 
              type="file" 
              accept="image/*" 
             onChange={(e) => {
              const file = e.target.files[0];
              if(file){
                setProfilePicture(file)
                uploadProfilePicture(file)
              }
        
            }} 
              />
              <MdModeEdit onClick={() => document.getElementById('fileInput').click()} className='absolute right-2 top-2 scale-150 text-2xl text-white bg-black p-2 rounded-full cursor-pointer'/>
              </>}
            <img className='rounded-full object-cover w-full h-full' src={picture ? picture : images?.profile} width={300} height={300} alt="profile-pic" />
            </div>
            <div className='lg:w-2/3 lg:h-72 lg:mr-10 flex flex-col lg:items-start justify-center'>
              <h1 className='lg:text-2xl text-lg font-semibold my-2 bg-yellow-300 p-2 lg:px-4 rounded-lg'>Bio:</h1>

              <div className='border container border-yellow-500 lg:w-5/6 h-full rounded-lg p-4'>
  {editBio ? (
    <div className="w-full">
      <textarea
        className="w-full border p-2 rounded-md"
        value={bio}
        maxLength={800}
        rows={5}
        placeholder="Write your bio here..."
        onChange={(e) => setBio(e.target.value)}
        required
      />
      <div className="text-right text-sm text-gray-500 mt-1">
        {bio.length}/800 characters
      </div>
      <div className="flex justify-end mt-2">
        <button
          className="text-white bg-green-500 px-4 py-1 rounded-lg mr-2"
          onClick={() => handleSaveField("bio", bio)}
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
    <div className="flex justify-between w-full p-6 items-center">
      <h2 className="text-sm break-words w-full">{bio?.substring(0, 800) || 'No bio available.'}</h2>
      {selfProfile && (
        <button className="ml-4" onClick={() => setEditBio(true)}>
          <MdModeEdit className="scale-150" />
        </button>
      )}
    </div>
  )}
  <h2 className='text-sm hidden'>{bio?.substring(0, 250)}...</h2>
</div>
          </div>
          </div>
          <div className='grid lg:grid-cols-2 w-full'>
          <div className='flex flex-col justify-start items-start px-20 py-10'>
            <h2 className='bg-gray-300 w-full text-start p-3 rounded-lg m-2 flex'>
              {!editName ? (
               <div className='flex justify-between w-full'> 
                <div className='flex  mx-2'><span className='font-semibold mx-2'>Name: </span> {name ? name : ""}</div>  
                {selfProfile && (<p onClick={() => setEditName(true)} className='flex scale-125 mt-1'><MdModeEdit/></p>)}
                </div>
              ) : (
               <>
                <div className='w-full'>
                <input
                  className="w-full border p-2 rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="text-white bg-green-500 px-4 py-1 rounded-lg mr-2"
                    onClick={() => handleSaveField("displayName", name)}
                  >
                    Save
                  </button>
                  <button
                    className="text-white bg-gray-500 px-4 py-1 rounded-lg"
                    onClick={() => setEditName(false)}
                  >
                    Cancel
                  </button>
                </div>
                </div>
               </>
              )}

            </h2>
            <h2 className='bg-gray-300 text-start p-3 rounded-lg w-full m-2 flex'>
            
            {!editRole ? (
              
               <div className='flex justify-between w-full'> 
                <div className='flex text-small mx-2'><span className='font-semibold mx-2'>Role: </span> {role ? role : ""}</div>  
                {selfProfile && (<p onClick={() => setEditRole(true)} className='flex scale-125 mt-1'><MdModeEdit/></p>)}
                </div>
              ) : (
               <>
                <div className='w-full'>
                <select
              className="rounded-xl bg-gray-200 p-2 m-4 lg:w-1/2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select a role...
              </option>
              {filmIndustryRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select> 
                <div className="flex justify-end mt-2">
                  <button
                    className="text-white bg-green-500 px-4 py-1 rounded-lg mr-2"
                    onClick={() => handleSaveField("role", role)}
                  >
                    Save
                  </button>
                  <button
                    className="text-white bg-gray-500 px-4 py-1 rounded-lg"
                    onClick={() => setEditRole(false)}
                  >
                    Cancel
                  </button>
                </div>
                </div>
               </>
              )}

            </h2>
            <h2 className='bg-gray-300 text-start p-3 rounded-lg w-full m-2 flex'>
              
            {!editLocation ? (
               <div className='flex justify-between w-full'> 
                <div className='flex mx-2'><span className='font-semibold mx-2'>Location: </span> {location ? location : ""}</div>  
                {selfProfile && (<p onClick={() => setEditLocation(true)} className='flex scale-125 mt-1'><MdModeEdit/></p>)}
                </div>
              ) : (
               <>
                <div className='w-full'>
                <input
                  className="w-full border p-2 rounded-md"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="text-white bg-green-500 px-4 py-1 rounded-lg mr-2"
                    onClick={() => handleSaveField("location", location)}
                  >
                    Save
                  </button>
                  <button
                    className="text-white bg-gray-500 px-4 py-1 rounded-lg"
                    onClick={() => setEditLocation(false)}
                  >
                    Cancel
                  </button>
                </div>
                </div>
               </>
              )}

            </h2>
          </div>
        <div className='p-10'>
        {selfProfile && (
        <div className='bg-gray-900 p-4 w-fit text-white rounded-md'>
        <h2 className='text-xl'>Connection Requests</h2>
        {requestNames?.map((user, index) => (
        <div
          key={index}
          className="hover:cursor-pointer hover:underline"
          onClick={() => navigate(`/profile/${connectionRequests[index]?.senderUid}`)}
        >
        {user}
      </div>
      ))}
      </div>
      )}
          </div>
        </div>
        </div>
      )}
      
      {editMode && (
  <div className="m-20 bg-gray-300 p-12 rounded-lg relative flex flex-col justify-start">
    <div 
      onClick={() => setEditMode(false)} 
      className="absolute top-2 right-2 bg-black hover:scale-110 font-semibold w-fit text-white rounded-full px-3 pb-1 cursor-pointer"
    >
      x
    </div>
    <div className="flex">
      <h2 className="text-2xl m-2 font-semibold mb-10">Update Profile</h2>
    </div>
    <form 
      className="flex flex-col items-start" 
      onSubmit={handleSubmit}
    >
      <label className="pl-2">Role</label>
      <select
              className="rounded-xl bg-gray-200 p-2 m-4 lg:w-1/2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select a role...
              </option>
              {filmIndustryRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
      
      <label className="pl-2">Profile Picture</label>
      <input 
        className="rounded-md p-2 m-2" 
        type="file" 
        accept="image/*" 
        onChange={(e) => setProfilePicture(e.target.files[0])} 
      />
      
      <div className="flex self-center mt-4">
        <button 
          className="text-white bg-black p-2 rounded-lg" 
          type="submit"
        >
          Update Profile
        </button>
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

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { updateUserInfo, getUserInfo, updateUserField, sendConnectionRequest, fetchConnectionRequests, acceptConnectionRequest, rejectConnectionRequest, fetchConnections } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { MdModeEdit } from "react-icons/md";
import { useParams } from 'react-router-dom';
import ChatBox from './ChatBox';
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
  const [openChat, setOpenChat] = useState(false);
  const [filter, setFilter] = useState("")
  const [picture, setPicture] = useState("")
  const [editName, setEditName] = useState(false)
  const [editRole, setEditRole] = useState(false)
  const [editLocation, setEditLocation] = useState(false)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState([]); 
  const [connections, setConnections] = useState([])
  const [connectionNames, setConnectionNames] = useState([])
  const [connectionPics, setConnectionPics] = useState([])
  const [requestPics, setRequestPics] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [isRequestSend, setIsRequestSent] = useState(false)
  const [name, setName] = useState('');
  const [connectionRequestOpen, setConnectionRequestOpen] = useState(false)
  const [connectionOpen, setConnectionOpen] = useState(false)
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


  useEffect(() => {
    console.log("Checking connection with ID:", id);
    console.log("Connections list:", connections);
    const checkIfConnected = () => {
      const connected = connections.some(
        (connection) => connection.uid === id
      );
      setIsConnected(connected);
    };
  
    if (connections.length > 0) {
      checkIfConnected();
    }

    console.log(isConnected)
  }, [connections, id]);
  

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
    console.log("Connections:", connections); // Check the structure before mapping
  }, [connections]);

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
    const fetchAllConnectionUsernames = async () => {
      try {
          if (connections.length === 0) return;
          
          const users = await Promise.all(
              connections.map((connection) => getUserInfo(connection.uid))
          );
  
          console.log("Fetched user data:", users); // Check if displayName is available
  
          setConnectionNames(users.map((user) => user?.displayName || "Unknown"));
      } catch (err) {
          console.error("Error fetching usernames:", err);
      }
  };
  
    fetchAllConnectionUsernames();
    console.log(connectionNames)
  }, [connections]);

  useEffect(() => {
    const fetchAllConnectionPictures = async () => {
      try {
          if (connections.length === 0) return;
          
          const users = await Promise.all(
              connections.map((connection) => getUserInfo(connection.uid))
          );
  
          console.log("Fetched user data:", users); // Check if displayName is available
  
          setConnectionPics(users.map((user) => user?.profilePicture || "Unknown"));
          console.log(connectionPics)
      } catch (err) {
          console.error("Error fetching usernames:", err);
      }
  };
  
    fetchAllConnectionPictures();
    console.log(connectionNames)
  }, [connections]);


  useEffect(() => {
    const fetchAllRequestPictures = async () => {
      try {
          if (connectionRequests.length === 0) return;
          
          const users = await Promise.all(
              connectionRequests.map((request) => getUserInfo(request.uid))
          );
  
          setRequestPics(users.map((user) => user?.profilePicture || "Unknown"));
      } catch (err) {
          console.error("Error fetching usernames:", err);
      }
  };
  
    fetchAllRequestPictures();
  }, [connectionRequests]);

  useEffect(() => {
    if (id && user?.uid) {
      setSelfProfile(id === user?.uid);
    } else {
      setSelfProfile(false);
    }
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
  

  useEffect(() => {
    
    
    const getConnections = async () => {
      if (user?.uid) {
        try {
          const connections = await fetchConnections(user.uid);
          console.log(connections); 
          setConnections(connections);
        } catch (error) {
          console.error("Error fetching connection requests:", error);
        }
      }
    };
  
    getConnections();
    console.log(connections)
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
        setIsRequestSent(true)
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
            {selfProfile ? (<h1 className='text-4xl font-semibold lg:my-2 my-5 px-14'>My Profile</h1>
            ) : (<h1 className='text-4xl font-semibold my-2 px-14'>{name?.toUpperCase()}</h1>)}
            {selfProfile && (
              <div className='flex mb-4 lg:mb-0'>
              <div onClick={() => {setConnectionRequestOpen(!connectionRequestOpen); setConnectionOpen(false)}} className='bg-black relative p-5 mx-1 hover:cursor-pointer rounded-lg text-white'>
                Requests
               {connectionRequests.length >= 0 && ( <div className='absolute top-0 right-0 w-6 h-6  rounded-full bg-red-500'>
                {connectionRequests.length}
              </div> )}            
              </div>
              <div onClick={() => {setConnectionOpen(!connectionOpen); setConnectionRequestOpen(false)}} className='bg-white border relative p-5 mx-1 hover:cursor-pointer rounded-lg'>
                Connections
                {connectionNames.length >= 0 && ( <div className='absolute top-0 right-0 w-6 h-6 rounded-full hover:scale-125 bg-blue-500 text-white'>
                {connectionNames.length}
              </div> )}  
              </div>
            </div>)}
            {selfProfile ? (
              <div className='flex justify-between'>
                {/* <div onClick={() => setEditMode(true)} className='bg-black hover:scale-110 hover:cursor-pointer text-white p-2 h-full rounded-lg'>
                  Edit Profile
                </div> */}
              </div>
            ) : (
              <div className='flex'>
                {user && (
  <div className='flex'>
    {isConnected ? (
      <div className='bg-green-500 text-white p-2 h-full rounded-lg'>
        Connected
      </div>
    ) : (
      <div
        onClick={!isRequestSend ? handleConnect : null}
        className='bg-black hover:scale-110 hover:cursor-pointer text-white p-2 h-full rounded-lg'
      >
        {!isRequestSend ? <>Connect</> : <>Connection Request Sent</>}
      </div>
    )}
    <div
      onClick={() => {
        setOpenChat(!openChat);
      }}
      className='bg-black mx-2 hover:scale-110 hover:cursor-pointer text-white p-2 h-full rounded-lg'
    >
      Chat
    </div>
  </div>
)}

            </div>
            )}
          </div>
          <div className='items-center justify-center self-center'>
          {!selfProfile && openChat && <ChatBox  openChat={setOpenChat} receiver={{ uid: id }}/> }
          </div>
          
          {selfProfile && connectionRequestOpen && !connectionOpen && requestNames.length > 0 && (
          <div className='flex items-center justify-center'>
          <div className='flex flex-col w-1/3 bg-gray-900 rounded-lg p-6'>
          {requestNames.map((request, index) => (
            <div className='flex justify-between'>
            <div className='flex w-full'>
            <div onClick={() => navigate(`/profile/${connectionRequests[index]?.uid}`)} className='flex hover:cursor-pointer items-center'>
            <img  src={requestPics[index] ? requestPics[index] : images?.set} width={60} height={60} alt="pic" className='rounded-full hover:scale-110 object-cover'/>
            <div className='flex flex-col text-white hover:scale-110 text-lg p-4'>
            {request}
            </div>
            </div>
            </div>
            <div className='flex m-2'>
            <div onClick={() => acceptConnectionRequest(id , connectionRequests[index]?.senderUid )} className=' bg-black text-white rounded-md hover:cursor-pointer m-1 p-1'>Accept</div>
            <div className=' bg-white text-black rounded-md  hover:cursor-pointer m-1 p-1'>Reject</div>
            </div>
            </div>
          ))}
          <div>
          </div>
          </div>
          </div>)}
          {selfProfile && connectionOpen && connectionNames.length > 0 && (
          <div className='flex items-center justify-center'>
          <div className='flex flex-col w-1/3 bg-gray-900 rounded-lg p-6'>
          {connectionNames.map((connection, index) => (
            <div onClick={() => navigate(`/profile/${connections[index]?.uid}`)} className='flex hover:cursor-pointer items-center'>
            <img  src={connectionPics[index] ? connectionPics[index] : images?.profile} width={40} height={40} className={`${!connectionPics[index] ? 'invisible' : ''} rounded-full h-14 w-14 hover:scale-110 object-cover`}  alt=''/>
            <div className='flex flex-col text-white hover:scale-110 text-lg p-4'>
            {connection}
            </div>
            </div>
          ))}
          <div>
          </div>
          </div>
          </div>)}
          <div className='flex overflow-hidden lg:flex-row flex-col p-10 items-center lg:mx-14 justify-between'>
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
              
            <img className='rounded-full object-cover w-full h-full' src={picture ? picture : images?.pic} width={300} height={300} alt="profile-pic" />
            </div>
            <div className='lg:w-2/3 lg:h-72 lg:mr-10 flex flex-col lg:items-start justify-center'>
              <h1 className='lg:text-2xl text-lg font-semibold my-2  p-2 lg:px-4 rounded-lg'>Bio:</h1>

              <div className='border container border-gray-300 lg:w-5/6 h-full rounded-lg p-4'>
  {editBio ? (
    <div className="w-full">
      <textarea
        className="w-full border p-2 rounded-md"
        value={bio ? bio : ""}
        maxLength={800}
        rows={5}
        placeholder="Write your bio here..."
        onChange={(e) => setBio(e.target.value)}
        required
      />
      <div className="text-right text-sm text-gray-500 mt-1">
        {bio?.length}/800 characters
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

        {/* <div className='p-10'>
        {selfProfile && (
          <div className='flex'>
        <div className='bg-gray-900 p-4 w-fit text-white rounded-md'>
        <h2 className='text-xl'>Connection Requests</h2>
        
        
        {requestNames.length > 0 ? (requestNames?.map((user, index) => (
        <div className='flex justify-between'>
        <div
          key={index}
          className="hover:cursor-pointer hover:underline mt-2"
          onClick={() => navigate(`/profile/${connectionRequests[index]?.senderUid}`)}
        >
        {user}
      </div>
      <div className='flex m-2'>
        <div onClick={() => acceptConnectionRequest(id , connectionRequests[index]?.senderUid )} className='text-xs bg-black rounded-md hover:cursor-pointer m-1 p-1'>Accept</div>
        <div className='text-xs bg-white text-black rounded-md  hover:cursor-pointer m-1 p-1'>Reject</div>
      </div>
      </div>
      ))):(
      <div className='text-sm'>
        No Connection Requests
      </div>)}
      </div>
      <div className='bg-gray-900 p-4 w-fit mx-2 text-white rounded-md'>
      <h2 className='text-xl'>Connections</h2>
      {connectionNames.length > 0 ? (connectionNames?.map((user, index) => { 
                
       return (
      <div className='flex justify-between'>
      <div
        key={index}
        className="hover:cursor-pointer hover:underline mt-2"
        onClick={() => navigate(`/profile/${connections[index]?.uid}`)}
      >
      {user}
    </div>
        
    </div>
    )})):(
    <div className='text-sm'>
      No Connections
    </div>)}
    </div>
    </div>
      )}
          </div> */}


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
    {success && <p className="bg-green-500 p-2 rounded-lg">Profile Updated!</p> && setEditMode(false)}
  </div>
)}

    </div>
  );
};

export default MyProfile;

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import { getUsers } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { useNavigate } from 'react-router-dom';
import { FaCircle } from "react-icons/fa";
import { motion } from 'framer-motion';

const Search = () => {
  const { user, setUser } = useContext(UserContext);
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState([]);
  const [category, setCategory] = useState("role");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

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

  const navigate = useNavigate();

  useEffect(() => {
    getUsers(filter, "role")
  }, [filter])

  const handleFilterRole = async (e) => {
    e.preventDefault();

    try {
      const users = await getUsers(filter, "role");
      setResults(users);
    } catch (err) {
      console.error("Error getting users:", err.message);
    }
  };

  const handleFilterName = async (e) => {
    e.preventDefault();

    try {
      const users = await getUsers(name, "displayName");
      setResults(users);
    } catch (err) {
      console.error("Error getting users:", err.message);
    }
  };

  const handleFilterLocation = async (e) => {
    e.preventDefault();

    try {
      const users = await getUsers(location, "location");
      setResults(users);
    } catch (err) {
      console.error("Error getting users:", err.message);
    }
  };

  return (
    <div className="flex bg-slate-900 flex-col p-10 min-h-screen">
      <div className="flex justify-center ">
        <h1 className="lg:text-3xl text-xl text-white p-8">Search for a Role</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className='flex flex-col'>
          <div className='flex self-center'>
            <div onClick={() => setCategory("role")} className='flex flex-col items-center justify-center cursor-pointer'> 
            <p className={`${category === "role" ? "" : "invisible"} scale-50 text-yellow-500`}><FaCircle/></p>
            <p className='mx-4 text-white'>Role</p>
            </div>
            <div onClick={() => setCategory("name")} className='flex flex-col items-center justify-center cursor-pointer'> 
            <p className={`${category === "name" ? "" : "invisible"} scale-50 text-yellow-500`}><FaCircle/></p>
            <p className='mx-4 text-white'>Name</p>
            </div>
            <div onClick={() => setCategory("location")} className='flex flex-col items-center justify-center cursor-pointer'> 
            <p className={`${category === "location" ? "" : "invisible"} scale-50 text-yellow-500`}><FaCircle/></p>
            <p className='mx-4 text-white'>Location</p>
            </div>
          </div>
          {category === "role" && (<form onSubmit={handleFilterRole}>
            <select
              className="rounded-xl border border-gray-200 p-2 m-4 lg:w-1/6"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="" disabled>
                Select a Role...
              </option>
              {filmIndustryRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              className="bg-black text-white p-2 rounded-lg mx-2"
              type="submit"
        
            >
              Search
            </button>
          </form>)}

          {category === "name" && (<form onSubmit={handleFilterName}>
            
            <input 
            placeholder='Search by Name...'
            className='m-4 p-2 lg:w-1/6 rounded-xl border-2 border-gray-300'
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            <button
              className="bg-black text-white p-2 rounded-lg mx-2"
              type="submit"
            >
              Search
            </button>
          </form>)}

          {category === "location" && (<form onSubmit={handleFilterLocation}>

            <input 
            placeholder='Search by Location...'
            className='m-4 p-2 lg:w-1/6 rounded-xl border-2 border-gray-300'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            />
            <button
              className="bg-black text-white p-2 rounded-lg mx-2"
              type="submit"
            >
              Search
            </button>
          </form>)}
          
          <div className="flex items-center justify-center">
            {results.length > 0 ? (
              <div className="grid lg:grid-cols-3 gird-cols-1 lg:w-2/3 items-center justify-center p-10 mb-4 gap-4">
                {results.map((user, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    key={index}
                    className="m-2 hover:bg-yellow-400 p-4 h-full flex flex-col bg-blue-950 rounded-lg text-white cursor-pointer"
                    onClick={() => navigate(`/profile/${user?.uid}`)}
                  >
                    <div className="flex justify-center w-48 h-48 mb-4 overflow-hidden">
                      <img
                        className="rounded-full w-full h-full object-cover"
                        src={
                          user?.profilePicture
                            ? user?.profilePicture
                            : images?.pic
                        }
                        alt="profile-pic"
                      />
                    </div>
                    <div className="flex items-center flex-col">
                      <p className="font-semibold text-lg">{user.displayName}</p>
                      
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-gray-500">No users found for this role...</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Search;

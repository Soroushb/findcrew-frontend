import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { getUsers } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Search = () => {
  const { user, setUser } = useContext(UserContext);
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState([]);

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

  const handleFilter = async (e) => {
    e.preventDefault();

    try {
      const users = await getUsers(filter);
      setResults(users);
    } catch (err) {
      console.error("Error getting users:", err.message);
    }
  };

  return (
    <div className="flex flex-col p-10 min-h-screen">
      <div className="flex justify-center ">
        <h1 className="lg:text-3xl text-xl p-8">Search for a Role</h1>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div>
          <form onSubmit={handleFilter}>
            <select
              className="rounded-xl bg-gray-200 p-2 m-4 lg:w-1/6"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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
            <button
              className="bg-black text-white p-2 rounded-lg mx-2"
              type="submit"
            >
              Search
            </button>
          </form>
          
          <div className="flex items-center justify-center">
            {results.length > 0 ? (
              <div className="grid lg:grid-cols-3 gird-cols-1 lg:w-2/3 items-center justify-center p-10 mb-4 gap-4">
                {results.map((user, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    key={index}
                    className="m-2 hover:bg-yellow-300 p-4 h-full flex flex-col bg-yellow-200 rounded-lg text-gray-800 cursor-pointer"
                    onClick={() => navigate(`/profile/${user?.uid}`)}
                  >
                    <div className="flex justify-center w-48 h-48 mb-4 overflow-hidden">
                      <img
                        className="rounded-full w-full h-full object-cover"
                        src={
                          user?.profilePicture
                            ? user?.profilePicture
                            : images?.profile
                        }
                        alt="profile-pic"
                      />
                    </div>
                    <div className="flex items-center flex-col">
                      <p className="font-semibold text-lg">{user.displayName}</p>
                      <p className="text-sm text-gray-700">
                        {user?.updatedData?.location}
                      </p>
                      <p className="text-sm text-gray-700">
                        {user?.updatedData?.skills}
                      </p>
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

import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { getUsers } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion'

const Search = () => {
  const { user, setUser } = useContext(UserContext);
  const [filter, setFilter] = useState("");  
  const [results, setResults] = useState([]);  
  const navigate = useNavigate()

  const handleFilter = async (e) => {
    e.preventDefault();
  
    try {
      const users = await getUsers(filter.trim().toLowerCase()); 
      setResults(users);
    } catch (err) {
      console.error("Error getting users:", err.message);
    }
  };

  return (
    <div className='flex flex-col p-10 min-h-screen'>
      
      <div className='flex'>
        <h1 className='text-3xl p-8'>Search for a Role</h1>
      </div>
       <motion.div
              initial={{opacity: 0, y: -50}}
              animate={{opacity: 1, y: 0}}
              transition={{ duration: 1}}>
      <div>
      <form onSubmit={handleFilter}>
        <input 
          className='rounded-xl bg-gray-200 p-2 '
          placeholder='Role'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}  
        />
        <button className='bg-black text-white p-2 rounded-lg mx-2' type="submit">Search</button>
      </form>

      <div className="flex items-center justify-center">
  {results.length > 0 ? (
    <div className="grid lg:grid-cols-3 gird-cols-1  lg:w-2/3 items-center justify-center p-10 mb-4 gap-4">
      
      {results.map((user, index) => (
        
        <motion.div
        initial={{opacity: 0, y: -50}}
        animate={{opacity: 1, y: 0}}
        transition={{ duration: 1}}
          key={index} 
          className="m-2 p-4 h-full flex flex-col bg-yellow-300 rounded-lg text-white cursor-pointer" 
          onClick={() => navigate(`/profile/${user?.uid}`)}
        >
          <div className="flex justify-center w-52 h-52 mb-4 overflow-hidden">
            <img 
              className="rounded-full w-full h-full object-cover" 
              src={user?.profilePicture ? user?.profilePicture : images?.profile} 
              alt="profile-pic" 
            
      
            />
          </div>
          <div className="flex items-center flex-col">
            <p className="font-semibold text-lg">{user.displayName}</p>
            <p className="text-sm text-gray-700">{user.updatedData.location}</p>
            <p className="text-sm text-gray-700">{user.updatedData.skills}</p> 
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

import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { getUsers } from '../frontend/firebase/firebase';
import images from '../constants/images';
import { useNavigate } from 'react-router-dom';

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
    <div className='flex flex-col p-10 h-screen'>

      <div className='flex'>
        <h1 className='text-3xl p-8'>Search for a Role</h1>
      </div>
      <div>
      <form onSubmit={handleFilter}>
        <input 
          className='rounded-xl bg-gray-200 p-2 '
          placeholder='Location'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}  
        />
        <button className='bg-black text-white p-2 rounded-lg mx-2' type="submit">Search</button>
      </form>

      <div className='flex items-center justify-center'>
    
        {results.length > 0 ? (
          <div className='grid grid-cols-3 w-2/3 items-center justify-center p-10'>
            {results.map((user, index) => (
              <div onClick={() => {console.log(user?.uid); navigate(`/profile/${user?.uid}`)}} className='m-2 p-2 flex flex-col bg-yellow-400 rounded-lg' key={index}>
                <div className='flex justify-center'><img className='rounded-lg' src={images?.profile} alt='profile-pic'/></div>
                <div className='flex items-center flex-col'>
                <p>{user.displayName}</p>
                <p>{user.updatedData.location}</p>
                <p>{user.updatedData.skills}</p> 
                </div>
              </div> 
            ))}
          </div>
        ) : (
          <p className='p-4'>No users found for this location.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Search;

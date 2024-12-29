import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { getUsers } from '../frontend/firebase/firebase';
import images from '../constants/images';

const Search = () => {
  const { user, setUser } = useContext(UserContext);
  const [filter, setFilter] = useState("");  
  const [results, setResults] = useState([]);  

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
    <div className='flex flex-col p-10'>

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
        <button type="submit">Search</button>
      </form>

      <div>
    
        {results.length > 0 ? (
          <div className='flex items-center justify-center p-10'>
            {results.map((user, index) => (
              <div className='m-2 p-2 flex flex-col bg-yellow-400 rounded-lg' key={index}>
                <div><img src={images?.profile} alt='profile-pic'/></div>
                <div className='flex items-start flex-col'>
                <p>{user.displayName}</p>
                <p>{user.updatedData.location}</p>
                <p>{user.updatedData.skills}</p> 
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No users found for this location.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Search;

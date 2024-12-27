import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { getUsers } from '../frontend/firebase/firebase';

const Search = () => {
  const { user, setUser } = useContext(UserContext);
  const [filter, setFilter] = useState("");  
  const [results, setResults] = useState([]);  

  const handleFilter = async (e) => {
    e.preventDefault();  

    try {
      const users = await getUsers(filter);  
      setResults(users);  
      console.log(results)
     
    } catch (err) {
      console.error("Error getting users:", err.message);
    }
  };

  return (
    <div className='flex flex-col p-10'>
      <form onSubmit={handleFilter}>
        <label>Location</label>
        <input 
          placeholder='Location'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}  
        />
        <button type="submit">Search</button>
      </form>

      <div>
    
        {results.length > 0 ? (
          <ul>
            {results.map((user, index) => (
              <li key={index}>
                {user.location} - {user.skills}  - {user.displayName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found for this location.</p>
        )}
      </div>
    </div>
  );
};

export default Search;

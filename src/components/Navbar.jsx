import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { user } = useContext(UserContext);
  
  const handleLogout = () => {
    localStorage.clear(); 
  }

  return (
    <div className='flex flex-row justify-between bg-yellow-400 p-9'>
      <div className='flex flex-row justify-center items-center'>
        <Link to="/">
          <div className='flex hover:cursor-pointer font-semibold text-2xl'>
            CrewFind
          </div>
        </Link>
        <div className='bg-black p-3 min-w-28 rounded-md text-lg hover:cursor-pointer text-white ml-10'>
          Search
        </div>
      </div>
      <div className='flex flex-row justify-between'>
        {!user ? (
          <>
            <Link to="/signup">
              <div className='bg-white p-3 min-w-20 rounded-md text-lg hover:cursor-pointer text-black'>
                Register
              </div>
            </Link>
            <Link to="/signin">
              <div className='bg-black p-3 min-w-20 rounded-md text-lg hover:cursor-pointer text-white ml-4'>
                Login
              </div>
            </Link>
          </>
        ) : (
          <div className='flex flex-row'>
          <div className='p-2'>
          <LogoutButton/>
          </div>
          <Link to="/my-profile">
          <div className='text-white bg-black text-2xl rounded-full w-12 h-12 mr-10 p-2 hover:cursor-pointer'>
            {user?.displayName.charAt(0)}
            
          </div>
          </Link>

          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

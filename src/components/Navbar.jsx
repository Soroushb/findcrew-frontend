import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';
import { IoIosMenu } from "react-icons/io";
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Motion variants for menu animation
  const menuVariants = {
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { opacity: 0, x: 100, transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex justify-between bg-yellow-400 p-6">
        <div className="flex items-center space-x-10">
          <Link to="/" className="font-semibold text-2xl text-black hover:text-white">
            CrewFind
          </Link>
          <Link to="/search" className="bg-black text-white py-2 px-4 rounded-md hover:bg-white hover:text-black transition-colors">
            Search
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <div onClick={() => navigate("/signup")} className="bg-black hover:cursor-pointer text-white py-2 px-4 rounded-md hover:scale-110 transition-colors">
                Register
              </div>
              <div onClick={() => navigate("/signin")} className="bg-white hover:cursor-pointer text-black py-2 px-4 rounded-md hover:scale-110 transition-colors">
                Login
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* <div className='bg-white p-2 rounded-md hover:cursor-pointer'>
              <Link to="/chats">Chats</Link>
              </div> */}
              <LogoutButton />
              <div 
                onClick={() => navigate(`profile/${user.uid}`)} 
                className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-700 cursor-pointer">
                {user?.displayName ? user?.displayName.charAt(0).toUpperCase() : ""}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden bg-yellow-400">
        <div className="flex justify-between items-center p-5">
          <div onClick={() => {setMenuOpen(false); navigate("/")}} className="font-semibold text-2xl text-gray-800 hover:text-gray-600">
            CrewFind
          </div>
          <div className="relative">
            <IoIosMenu 
              className="text-3xl text-black hover:text-white cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)} 
            />
            <motion.div
              className="absolute z-50 right-0 mt-2 bg-black text-white p-4 rounded-lg shadow-lg space-y-4"
              initial="closed"
              animate={menuOpen ? "open" : "closed"}
              variants={menuVariants}
            >
              <div  onClick={() => {setMenuOpen(false); navigate("/")}}  className="block text-lg hover:text-yellow-400 transition-colors">Home</div>
              <div onClick={() => {setMenuOpen(false); navigate("/search")}} className="block text-lg hover:text-yellow-400 transition-colors">Search</div>
              <div onClick={() => {setMenuOpen(false); navigate("/about-us")}}  className="block text-lg hover:text-yellow-400 transition-colors">About Us</div>
              {!user ? (
                <>
                  <div onClick={() => {setMenuOpen(false); navigate("/signin")}}  className="block text-lg hover:text-yellow-400 transition-colors">Login</div>
                  <div onClick={() => {setMenuOpen(false); navigate("/signup")}}  className="block text-lg hover:text-yellow-400 transition-colors">Create Account</div>
                </>
              ) : (
                <div onClick={() => {setMenuOpen(false); navigate(`profile/${user.uid}`)}} className="block text-lg hover:text-yellow-400 transition-colors">Profile</div>
              )}
              <LogoutButton />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;

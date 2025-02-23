import React, { useContext } from 'react';
import images from '../constants/images';
import { UserContext } from '../UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="lg:min-h-screen flex items-center justify-center"
    >
      <div className="lg:flex hidden flex-col lg:flex-row-reverse items-center justify-center lg:justify-between p-8 lg:p-20 space-y-8 lg:space-y-0 max-w-screen-xl w-full">
        
        {/* Left Section: Image */}
        <motion.div
          className="flex w-full lg:w-2/3 justify-center mb-8 lg:mb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            className="rounded-lg"
            height={350}
            src={images.filmset}
            alt="Film Set"
            style={{ objectFit: 'cover' }}
          />
        </motion.div>

        {/* Right Section: Text */}
        <motion.div
          className="flex flex-col w-full lg:w-1/3 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">Find Your Dream Crew</h1>
          <p className="text-lg p-4 my-4 bg-white border-2 border-gray-300 rounded-xl text-gray-700">
            CrewFind connects talented individuals with exciting opportunities. Join a platform that helps you network, find collaborators, and build incredible teams across industries.
          </p>
          
      
              <motion.div
                className=" p-2 rounded-lg text-white text-centercursor-pointer transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
            <div className='flex justify-center'>
            <div onClick={() => navigate('/search')} className='bg-black hover:cursor-pointer text-xl hover:scale-110 mx-2 rounded-md text-white p-3'>Search</div>
            <div onClick={() => navigate('/signin')} className='bg-yellow-400 hover:cursor-pointer text-xl hover:scale-110 mx-2 rounded-md text-black  p-3'>Login</div>
          </div>
              </motion.div>
          
        </motion.div>
      </div>


      {/* Mobile */}
      <div className="lg:hidden h-screen flex flex-1 flex-col items-center lg:justify-between p-8 max-w-screen-xl w-full">
        
        <motion.div
          className="flex flex-1 flex-col w-full lg:w-1/3 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Find Your Dream Crew</h1>
          <div className='flex justify-center mt-4'>
            <div onClick={() => navigate('/Search')} className='bg-black mx-2 rounded-md text-white p-2'>Search</div>
            <div onClick={() => navigate('/Signin')} className='bg-yellow-400 mx-2 rounded-md text-black  p-2'>Login</div>
          </div>
          <motion.div
          className="flex w-full lg:w-2/3 justify-center mb-8 lg:mb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          
          <img
            className="rounded-lg"
            height={350}
            src={images.filmset}
            alt="Film Set"
            style={{ objectFit: 'cover' }}
          />
        </motion.div>
         
        
          
          {user?.displayName ? (
            <Link to="/dashboard">
              <motion.div
                className="bg-black p-2 rounded-lg text-white text-center hover:bg-gray-800 cursor-pointer transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Go to Dashboard
              </motion.div>
            </Link>
          ) : (
            <Link to="/signup">
              <motion.div
                className="bg-black p-2 rounded-lg text-white text-center hover:bg-gray-800 cursor-pointer transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Create Account
              </motion.div>
            </Link>
          )}
        </motion.div>
      </div>
    </motion.div>
    
  );
};

export default Home;

import React from 'react';
import images from '../constants/images';
import { Link, useNavigate } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaGlobe  } from "react-icons/fa";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-12">
      <div className="flex lg:flex-row flex-col w-full max-w-6xl gap-10">
        {/* Left Section: Text Content */}
        <div className="flex flex-1 flex-col items-center lg:items-start justify-center">
        <h1 className="text-3xl font-semibold my-4">About Us</h1>


          <div className="flex flex-col text-gray-800 items-center text-md py-8">
            At CrewFind, we are passionate about creating a platform that connects talented individuals with exciting opportunities, bridging the gap between creatives, professionals, and organizations. 
            Our mission is to empower individuals and teams by providing a seamless, user-friendly platform that fosters connections, collaboration, and creativity.
            <div 
            onClick={() => navigate("/signup")} 
            className="bg-black w-fit self-center text-white text-lg font-semibold px-6 py-3 rounded-md mt-6  cursor-pointer hover:scale-105 transition"
            >
            Create Account
          </div>
          </div>
        </div>

        {/* Right Section: Images */}
        <div className="flex flex-1 flex-col items-center lg:items-start justify-end">

          <div className="flex flex-col items-center lg:items-start mt-8">
            <h2 className="text-xl font-semibold">Created by:</h2>
            <h2 className="text-lg">Soroush Bahrami</h2>
            <div className='my-5 flex'>
              <Link target="_blank" to="https://www.linkedin.com/in/soroush-bahrami/">
              <div className='scale-150 m-2  hover:text-blue-800'><FaLinkedin/></div>
              </Link>
              <Link target="_blank" to="https://www.linkedin.com/in/soroush-bahrami/">
              <div className='scale-150 m-2 hover:text-green-900'><FaGithub/></div>
              </Link>
              <Link target="_blank" to="https://www.linkedin.com/in/soroush-bahrami/">
              <div className='scale-150 m-2 hover:text-orange-800'><FaGlobe/></div>
              </Link>
            </div>
            <img className="rounded-full w-24 h-24 object-cover hover:scale-110 transition" src={images.me} alt="Me" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

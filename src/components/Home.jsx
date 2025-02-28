import React, { useContext, useRef, useState, useEffect } from 'react';
import images from '../constants/images';
import { UserContext } from '../UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Search from "../components/Search";
import AboutUs from "../components/AboutUs"
import Dashboard from './Dashboard';

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Refs for sections
  const homeRef = useRef(null);
  const homeRefMobile = useRef(null);
  const searchRef = useRef(null);
  const aboutRef = useRef(null);
  const dashboardRef = useRef(null);


  // State to track the active section
  const [activeSection, setActiveSection] = useState('home');

  // Effect to track section visibility
  useEffect(() => {
    const sections = [
      { id: 'home', ref: homeRef },
      { id: 'homeMobile', ref: homeRefMobile },
      { id: 'search', ref: searchRef },
      { id: 'aboutUs', ref: aboutRef}
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, []);

  // Scroll to section
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Floating Dots Navigation */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 flex flex-col gap-2 z-50">
        <button
          onClick={() => scrollToSection(homeRef)}
          className={`w-3 h-3 rounded-full transition-all ${
            activeSection === 'home' || activeSection === 'homeMobile' ? 'bg-yellow-400' : 'bg-gray-400'
          } hover:bg-gray-800`}
        />
        <button
          onClick={() => scrollToSection(searchRef)}
          className={`w-3 h-3 rounded-full transition-all ${
            activeSection === 'search' ? 'bg-yellow-400' : 'bg-gray-400'
          } hover:bg-gray-800`}
        />
        <button
          onClick={() => scrollToSection(aboutRef)}
          className={`w-3 h-3 rounded-full transition-all ${
            activeSection === 'aboutUs' ? 'bg-yellow-400' : 'bg-gray-400'
          } hover:bg-gray-800`}
        />
      </div>

      {/* Desktop Home Section */}
      <motion.div
        ref={homeRef}
        id="home"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex min-h-screen flex-col items-center justify-center"
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
              className="rounded-lg hover:scale-105"
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
            <h1 className="text-4xl font-semibold text-gray-900 mb-4 hover:scale-105">Find Your Dream Crew</h1>
            <p className="text-lg p-4 my-4 bg-white rounded-xl text-gray-700 hover:scale-105">
            CrewFind connects talented individuals with exciting opportunities, making collaboration easier than ever. Whether you're a creative professional, a tech expert, or an entrepreneur, our platform helps you network, discover like-minded collaborators, and build incredible teams across various industries. Find the right people for your next big project and take your career to new heights with CrewFind.
            </p>
            
            <motion.div
              className="p-2 rounded-lg text-white text-center cursor-pointer transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className='flex justify-center'>
                <div onClick={() => navigate('/search')} className='bg-black hover:cursor-pointer text-lg hover:scale-110 mx-2 rounded-md text-white p-3'>Search</div>
                <div onClick={() => navigate('/signin')} className='bg-yellow-400 hover:cursor-pointer text-lg hover:scale-110 mx-2 rounded-md text-black p-3'>Login</div>
              </div>
            </motion.div>
            
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Home Section */}
      <motion.div
        ref={homeRefMobile}
        id="homeMobile"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="lg:hidden flex flex-col items-center justify-center min-h-screen p-6"
      >
        <h1 className="text-3xl font-semibold text-gray-900 p-4 text-center">Find Your Dream Crew</h1>

        
        <div className="flex gap-4">
          <button onClick={() => navigate('/search')} className="bg-black text-white px-4 py-2 rounded-md text-lg">Search</button>
          <button onClick={() => navigate('/signin')} className="bg-yellow-400 text-black px-4 py-2 rounded-md text-lg">Login</button>
        </div>
        
        <img
          className="rounded-lg mb-6 w-full"
          src={images.filmset}
          alt="Film Set"
          style={{ objectFit: 'cover' }}
        />
        <p className="text-lg p-4 my-4 bg-white border-2 border-gray-300 rounded-xl text-gray-700 text-center">
          CrewFind connects talented individuals with exciting opportunities. Join a platform that helps you network, find collaborators, and build incredible teams across industries.
        </p>

      </motion.div>

      <div ref={searchRef} id="search">
        <Dashboard/>
      </div>

      <div ref={aboutRef} id="aboutUs">
        <AboutUs/>
      </div>
      

      {/* Search Section */}
      {/* <div ref={searchRef} id="search">
        <Search />
      </div> */}
    </div>
  );
};

export default Home;

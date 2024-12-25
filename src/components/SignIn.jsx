import React, { useState } from 'react';
import { auth } from "../frontend/firebase/firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); 
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully logged in
        const user = userCredential.user;
        console.log("User logged in:", user);
        setError(''); // Clear any previous errors
      })
      .catch((error) => {
        // Handle login errors
        setError(error.message); // Display error message
        console.error("Error logging in:", error.message);
      });
  };

  return (
    <div className='flex justify-center items-center'>

      <div className='m-20 bg-gray-300 p-12 rounded-lg flex flex-col justify-start'>
      <h2 className='text-2xl m-2 font-semibold mb-10'>Sign In</h2>
      <form className='flex flex-col items-start' onSubmit={handleLogin}>
        <label className='pl-2'>Email</label>
        <input
          className='rounded-md p-2 m-2'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className='pl-2'>Password</label>
        <input
         className='rounded-md p-2 m-2'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div></div>
        <div className='flex self-center mt-4'>
        <button className='text-white bg-black p-2 rounded-lg' type="submit">Sign In</button>
        </div>
      </form>
      <div className='m-2 text-white'>
      {error && <p className='bg-red-500 p-2 rounded-lg'>{error}</p>}
      </div>
      <div>
            <div className='text-md'>
                Don't have an account?
            </div>
            <Link to="/signup">
            <button className='text-white bg-gray-500 p-1 min-w-20 mt-2 rounded-lg' type="submit">Sign Up</button>
            </Link>
        </div>

      </div>
      
    </div>
  );
}

export default SignIn;

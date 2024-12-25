import React, { useState } from 'react';
import { auth } from "../frontend/firebase/firebase"   
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSignUp = (e) => {
      e.preventDefault(); // Prevent form from refreshing the page
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Successfully created user
          const user = userCredential.user;
          console.log("User created:", user);
          setError(''); // Clear any previous errors
        })
        .catch((error) => {
          // Handle errors
          setError(error.message); // Display the error message
          console.error("Error signing up:", error.message);
        });
    };
  
    return (
      <div className='flex justify-center items-center'>

        <div className='m-20 bg-gray-300 p-12 rounded-lg flex flex-col justify-start'>
        <h2 className='text-2xl m-2 font-semibold mb-10'>Sign Up</h2>
        <form className='flex flex-col items-start' onSubmit={handleSignUp}>
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
          <label className='pl-2'>Repeat Password</label>
          <input
           className='rounded-md p-2 m-2'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        
      </div>
    );
  }
  
  export default SignUp;
import React, { useState, useContext } from 'react';
import { auth } from "../frontend/firebase/firebase";   
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext'; // Import UserContext

function SignUp() {
    const { setUser } = useContext(UserContext); // Access the setUser function from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [created, setCreated] = useState(false);
  
    const handleSignUp = (e) => {
      e.preventDefault(); // Prevent form from refreshing the page
      setCreated(false);
      
      // Check if passwords match
      if (password !== passwordRepeat) { 
        setError("Passwords do not match."); 
      } else {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Successfully created user
          const user = userCredential.user;

          // Update the user's profile with displayName
          updateProfile(user, { displayName: displayName })
            .then(() => {
              console.log("User created and profile updated:", user);
              setCreated(true);
              // Set user in context
              setUser({ displayName: displayName, email: user.email, uid: user.uid });
              setError(''); // Clear any previous errors
            })
            .catch((profileError) => {
              console.error("Error updating profile:", profileError.message);
              setError(profileError.message);
            });
        })
        .catch((error) => {
          // Handle errors
          setError(error.message); // Display the error message
          console.error("Error signing up:", error.message);
        });
      }
    };
  
    return (
      <div className='flex justify-center items-center'>
        <div className='m-20 bg-gray-300 p-12 rounded-lg flex flex-col justify-start'>
          <h2 className='text-2xl m-2 font-semibold mb-10'>Sign Up</h2>
          <form className='flex flex-col items-start' onSubmit={handleSignUp}>
            <label className='pl-2'>Display Name</label>
            <input
              className='rounded-md p-2 m-2'
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
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
              placeholder="Repeat Password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
            <div></div>
            <div className='flex self-center mt-4'>
              <button className='text-white bg-black p-2 rounded-lg' type="submit">Sign Up</button>
            </div>
          </form>
          <div className='m-2 text-white'>
            {error && <p className='bg-red-500 p-2 rounded-lg'>{error}</p>}
            {created && <p className='bg-green-500 p-2 rounded-lg'>User Created!</p>}
          </div>
          <div>
            <div className='text-md'>
              Already have an account?
            </div>
            <Link to="/signin">
              <button className='text-white bg-gray-500 p-1 min-w-20 mt-2 rounded-lg' type="submit">Sign In</button>
            </Link>
          </div>
        </div>
      </div>
    );
}

export default SignUp;

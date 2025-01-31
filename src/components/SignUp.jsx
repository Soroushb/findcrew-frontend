import React, { useState, useContext } from 'react';
import { auth } from "../frontend/firebase/firebase";   
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { updateUserInfo, getUserInfo, updateUserField } from '../frontend/firebase/firebase';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext'; 
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom';


function SignUp() {
    const { setUser } = useContext(UserContext); // Access the setUser function from context
    const [newUser, setNewUser] = useState("")
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [role, setRole] = useState("")
    const [displayName, setDisplayName] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [bio, setBio] = useState('')
    const [location, setLocation] = useState("")
    const [username, setUsername] = useState("")
  
    const filmIndustryRoles = [
      "Director",
      "Producer",
      "Executive Producer",
      "Screenwriter",
      "Actor/Actress",
      "Casting Director",
      "Cinematographer",
      "Camera Operator",
      "Gaffer",
      "Best Boy Electric",
      "Lighting Technician",
      "Boom Operator",
      "Sound Mixer",
      "Sound Designer",
      "Foley Artist",
      "Music Composer",
      "Production Designer",
      "Art Director",
      "Set Decorator",
      "Prop Master",
      "Costume Designer",
      "Wardrobe Supervisor",
      "Hair Stylist",
      "Makeup Artist",
      "Special Effects Makeup Artist",
      "Line Producer",
      "Production Coordinator",
      "1st Assistant Director",
      "2nd Assistant Director",
      "Production Assistant (PA)",
      "Film Editor",
      "Colorist",
      "VFX Supervisor",
      "VFX Artist",
      "Motion Graphics Artist",
      "Sound Editor",
      "Music Editor",
      "Special Effects Supervisor",
      "Stunt Coordinator",
      "Stunt Performer",
      "Script Supervisor",
      "Location Manager",
      "Location Scout",
      "Storyboard Artist",
      "Unit Production Manager",
      "Publicist",
      "Marketing Coordinator",
      "Studio Executive",
      "Set Photographer",
      "Choreographer"
    ];

    const navigate = useNavigate()
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

            signInWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                    // Successfully logged in
                    const user = userCredential.user;
                    setNewUser(user)
                    console.log("User logged in:", user);
                    setUser({
                      displayName: user.displayName,
                      email: user.email,
                      uid: user.uid,
                    });
                    setUsername(displayName)
                    setError(''); 
                    setStep(2)
                  })
                  .catch((error) => {
                    // Handle login errors
                    setError(error.message); // Display error message
                    console.error("Error logging in:", error.message);
                  });
                  
           
        })
        .catch((error) => {
          // Handle errors
          setError(error.message); // Display the error message
          console.error("Error signing up:", error.message);
        });
      }
    };

    const handleSaveField = async (field, value) => {
        try { 
          await updateUserField(newUser?.uid, field ,value);
          setUser((prevUser) => ({
            ...prevUser,
            bio,
          }));
          
        } catch (err) {
          console.error('Failed to update bio:', err.message);
        }
      };

    const handleStepTwo = (e) => {

      e.preventDefault();
      handleSaveField("role", role)
      handleSaveField("displayName", username)
      setStep(3)
    }

    const handleStepThree = (e) => {
      e.preventDefault();
      handleSaveField("bio", bio)
      handleSaveField("location", location)
      setError("")
      navigate(`/profile/${newUser?.uid}`)
      
    }
  
    return (
      <div className='flex justify-center items-center'>
        <motion.div
        initial={{opacity: 0, y: -50}}
        animate={{opacity: 1, y: 0}}
        transition={{ duration: 1}}>
        <div className='m-20 border-gray-300 border-2 p-12 rounded-lg flex flex-col justify-start'>
        <div className='text-6xl bottom-0'>
          <span className={`hover:cursor-pointer ${step === 1 || step === 2 || step === 3 ? 'text-yellow-600' : ''}`}>.</span>
          <span className={`${step === 2 || step === 3 ? 'text-yellow-600' : ''}`}>.</span>
          <span className={`${step === 3 ? 'text-yellow-600' : ''}`}>.</span>
          </div>
          <h2 className='text-2xl m-2 font-semibold mb-10'>Sign Up</h2>

          {step === 1 && (
            <form className='flex flex-col items-start' onSubmit={handleSignUp}>
            <label className='pl-2'>Display Name</label>
            <input
              className='rounded-md p-2 m-2'
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <label className='pl-2'>Email</label>
            <input
              className='rounded-md p-2 m-2'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className='pl-2'>Password</label>
            <input
              className='rounded-md p-2 m-2'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className='pl-2'>Repeat Password</label>
            <input
              className='rounded-md p-2 m-2'
              type="password"
              placeholder="Repeat Password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              required
            />
            <div></div>
            <div className='flex self-center mt-4'>
              <button className='text-white bg-black p-2 rounded-lg' type="submit">Sign Up</button>
            </div>
          </form>
          )}

          {step === 2 && (
            <form className='flex flex-col items-center' onSubmit={handleStepTwo}>
            <label className='pl-2'>What is Your Role:</label>
            <select
              className="rounded-xl bg-gray-200 p-2 m-4 lg:w-1/2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select a role...
              </option>
              {filmIndustryRoles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div></div>
            <div className='flex self-center mt-4'>
              <button className='text-white bg-black p-2 rounded-lg' type="submit">Next</button>
            </div>
          </form>
          )}

          {step === 3 && (
            <form className='flex flex-col items-center' onSubmit={handleStepThree}>
            <label className='pl-2'>Where do you live?</label>
            <input
              className="p-2 rounded-md m-2 border-2 border-gray-200"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div>
            <label className='pl-2'>Write your Bio</label>
            <textarea
             className="w-full border-2 border-gray-200 p-2 m-2 rounded-md"
             value={bio}
            maxLength={800}
             rows={5}
              placeholder="Write your bio here..."
              onChange={(e) => setBio(e.target.value)}
            required
            />

            </div>
            <div className='flex self-center mt-4'>
              <button className='text-white bg-black p-2 rounded-lg' type="submit">Next</button>
            </div>
          </form>
          )}
          
          <div className='m-2 text-white'>
            {error && <p className='bg-red-500 p-2 rounded-lg'>{error}</p>}
            {/* {created && <p className='bg-green-500 p-2 rounded-lg'>User Created!</p>} */}
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
        </motion.div>
      </div>
    );
}

export default SignUp;

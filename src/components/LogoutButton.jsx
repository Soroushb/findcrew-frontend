import React, {useContext} from 'react'
import { UserContext } from '../UserContext'
import { signOut } from 'firebase/auth'
import { auth } from '../frontend/firebase/firebase'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {

    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleLogout = async () => {

        try{

            await signOut(auth);
            setUser(null)
            console.log("User logged out");
            navigate("/")

        }catch(error){
            console.error("Error logging out:", error);
        }
    }
  return (
    <div onClick={()=> handleLogout()} className='text-white mx-4 p-2 rounded-lg bg-black hover:cursor-pointer'>
        Logout
    </div>
  )
}

export default LogoutButton
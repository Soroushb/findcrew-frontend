import React, {useContext} from 'react'
import images from '../constants/images'
import { UserContext } from '../UserContext'

const Home = () => {

    const {user} = useContext(UserContext)

  return (

    <div className='flex flex-row'>

        <div className='flex flex-col p-20 w-1/3 '>
            <h1 className='text-4xl font-semibold'>Find Your<br/>Dream Crew</h1>
            <p className='text-mx p-8'>
            At CrewFind, we are passionate about creating a platform that connects talented individuals with exciting opportunities, bridging the gap between creatives, professionals, and organizations. Born out of the realization that collaboration is key to achieving great things, CrewFind aims to revolutionize the way people network, find collaborators, and assemble teams for projects across a wide range of industries.
            </p>
            {user?.displayName ? (<>
        <div className='bg-black p-2 rounded-lg hover:cursor-pointer text-white'>Go to Dashboard</div>
        </>) :
         (<>
        <div className='bg-black p-2 rounded-lg hover:cursor-pointer text-white'>Create Account</div>
         </>)}

        </div>
        
        <div className='flex w-2/3 '>
            <img className=' rounded-lg ' height={30} src={images.filmset} alt='filmset' />
        </div>

       
    </div>
     
  )
}

export default Home
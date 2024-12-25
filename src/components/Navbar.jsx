import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {


  return (
    <div className='flex flex-row justify-between bg-yellow-400 p-9'>

        <div className='flex flex-row justify-center items-center'>
        <div className='flex hover:cursor-pointer font-semibold text-2xl'>
            CrewFind
        </div>
        <div className='bg-black p-3 min-w-28 rounded-md text-lg hover:cursor-pointer text-white ml-10'>
        Search
        </div>
        </div>
        <div className='flex flex-row justify-between'>
        <Link to="signup">
        <div  className='bg-white p-3 min-w-20 rounded-md text-lg hover:cursor-pointer text-black'>
            Register
        </div>
        </Link>
        <Link to="signin">
        <div className='bg-black p-3 min-w-20 rounded-md text-lg hover:cursor-pointer text-white ml-4'>
            Login
        </div>
        </Link>
        </div>
    </div>
  )
}

export default Navbar
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex bg-yellow-400 px-4  justify-between text-xl font-semibold'>

        <div className='p-4 text-md hover:cursor-pointer'>CrewFind</div>
        <Link to='/about-us'>
        <div className='p-4 hover:cursor-pointer'>About Us</div>
        </Link>

    </div>
  )
}

export default Footer
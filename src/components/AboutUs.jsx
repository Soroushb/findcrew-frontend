import React from 'react'
import images from '../constants/images'

const AboutUs = () => {
  return (
    <div className='flex flex-1  p-8 flex-row'>
        <div className='flex w-1/2 flex-col'>
        <h1 className='text-2xl'>About Us</h1>
        <div className='p-10'>
        At CrewFind, we are passionate about creating a platform that connects talented individuals with exciting opportunities, bridging the gap between creatives, professionals, and organizations. Born out of the realization that collaboration is key to achieving great things, CrewFind aims to revolutionize the way people network, find collaborators, and assemble teams for projects across a wide range of industries.
Our Mission

Our mission is to empower individuals and teams by providing a seamless, user-friendly platform that fosters connections, collaboration, and creativity. We strive to build a community where professionals and enthusiasts alike can come together to share their skills, ideas, and passions, creating something greater than the sum of its parts.
What We Offer

At CrewFind, we understand that finding the right people for a project can be challenging. Whether you’re a filmmaker in search of a cinematographer, a startup founder looking for a developer, or a musician seeking a producer, our app makes it easy to discover the right talent. Here’s how CrewFind stands out:

    Personalized Search: Easily filter and search for collaborators based on specific skills, experience levels, and interests.
    Comprehensive Profiles: View detailed profiles, including portfolios, past projects, and reviews, to ensure you find the perfect match.
    Seamless Communication: Use our built-in messaging system to connect with others, discuss projects, and finalize details all in one place.
    Diverse Categories: Whether you're working in tech, art, media, education, or any other field, CrewFind caters to a wide array of industries and skills.
    User-Friendly Interface: Designed with simplicity and functionality in mind, our platform ensures a smooth experience for everyone.


        </div>
        </div>
        <div className='flex h-full w-1/2'><img className='rounded-xl' src={images.set} width={700} alt="image"/></div>
    </div>
  )
}

export default AboutUs
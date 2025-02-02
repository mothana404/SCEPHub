import React from 'react'
import HeroSection from '../components/HeroScetion'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import OurProjectsHome from '../components/OurProjectsHome'
import Feedback from '../components/FeedBack'

function HomePage() {
  return (
    <>
        <NavBar />
        <HeroSection />
        <OurProjectsHome />
        <Feedback />
        <Footer />
    </>
  )
}

export default HomePage
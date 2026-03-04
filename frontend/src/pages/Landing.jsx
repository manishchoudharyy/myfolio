import React from 'react'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Features from '../components/landing/Features'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

const Landing = () => {
  return (
    <div className='min-h-screen w-full bg-white'>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}

export default Landing
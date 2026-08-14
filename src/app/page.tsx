import FeatureStrip from '@/features/marketing/components/features'
import Footer from '@/features/marketing/components/footer'
import Hero from '@/features/marketing/components/hero'
import Navbar from '@/features/marketing/components/navbar'
import React from 'react'

const page = () => {
  return (
  <main>
    <Navbar/>
    <Hero/>
    <FeatureStrip/>
    <Footer/>
  </main>
  )
}

export default page
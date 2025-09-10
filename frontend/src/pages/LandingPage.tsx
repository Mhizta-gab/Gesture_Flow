

import Navbar from '../components/components/navbar/Navbar'
import Hero from '../components/components/Hero/Hero'
import Dashboard_Image from '../components/components/Dashboard-Image/Dashboard_Image'
import Contributors from '../components/components/Contributors/Contributors'
import Features from '../components/components/Features/Features'
import Users from '../components/components/Users/users'
import Elevate from '../components/components/Elevation/Elevate'
import Footer from '../components/components/Footer/Footer'

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <Hero />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <Dashboard_Image />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <Contributors />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <Features />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <Users />
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <Elevate />
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage
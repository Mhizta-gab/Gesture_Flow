// import Image from 'next/image'
// import React from 'react'
import dashbaord from '../../../public/dashboard3.png'
import stars from '../../../public/stars.png'

const Dashboard_Image = () => {
  return (
    <div className="relative flex justify-center items-center min-h-[60vh] w-full">
      {/* Background stars image */}
      <img
        className="absolute   -z-10"
        src={stars}
        alt="Stars Background"
    
      />
      <div className="overflow-auto px-3 py-2 flex justify-between items-center rounded-xl border w-fit mt-5 border-white/10 bg-white/5 shadow-[0px_1px_5px_1px_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-300 hover:border-[2px] hover:border-[#a78bfa] hover:shadow-[0_0_16px_2px_rgba(167,139,250,0.7)]">
        <img
          src={dashbaord}
          alt="Dashboard Image"
          className="object-cover"
          width={900}
          height={350}
      
        />
      </div>
    </div>
  )
}

export default Dashboard_Image
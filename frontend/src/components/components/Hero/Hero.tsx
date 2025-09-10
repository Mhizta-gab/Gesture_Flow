'use client'
// import React from 'react'
// import { Space_Grotesk } from 'next/font/google'
import Gradient from '../../../public/gradient'
// import Image from 'next/image'
import stars from '../../../public/stars.png'
import { ArrowBigDownDashIcon } from 'lucide-react'
import { motion } from 'framer-motion'


// const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'] })

const Hero = () => {
  return (
    <motion.div
      className='text-center min-h-[100vh] flex flex-col justify-center items-center mt-10'
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className='rounded-full flex gap-2 items-center px-2 py-1 border-[1px] border-[#FAFAFA1A] backdrop-blur-md'>

        {/* Using a div with a background color to create a dot */}
        <div className='w-3 h-3 rounded-full bg-[rgba(124,59,237,0.60)]'></div>

        {/* Small Paragraph text*/}
        <p className="bg-gradient-to-r from-[#B2A8FD] via-[#8678F9] to-[#C7D2FE] bg-clip-text text-transparent text-sm font-light">
          The Future of Communication
        </p>

        {/* svg */}
              <svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.589966" width="26" height="18" rx="9" fill="url(#paint0_linear_21_9661)" />
                  <path d="M9.50665 9H17.6733" stroke="#FAFAFA" strokeOpacity="0.5" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M13.59 4.91669L17.6733 9.00002L13.59 13.0834" stroke="#FAFAFA" stroke-opacity="0.5" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" />
                  <defs>
                      <linearGradient id="paint0_linear_21_9661" x1="13.59" y1="0" x2="13.59" y2="18" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#FAFAFA" stop-opacity="0.2" />
                          <stop offset="1" stop-color="#FAFAFA" stop-opacity="0.1" />
                      </linearGradient>
                  </defs>
              </svg>

      </div>
      <h1 className={`text-[60px] font-bold text-white mb-4 `}>
        Get Translated <span className='text-[#00ADB5]'>Sign Language</span><br /> Instantly
      </h1>

      <p className='text-white/60 text-md font-light'>Instantly understand sign language with real-time AI-powered gesture detection from your webcam.<br />
          Gesture Flow makes communication seamless and accessible for everyone.</p>
            {/* Buttons */}
            <div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(124,59,237,0.15)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className='bg-[#7C3BED] hover:cursor-pointer text-sm text-center px-3 py-2 rounded-md mt-6 mr-4'
              >
                Start for Free
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(124,59,237,0.10)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className='bg-[#FFF] text-sm hover:cursor-pointer text-[#0F0F0F] text-center px-3 py-2 rounded-md mt-6'
              >
                How it works
              </motion.button>
            </div>

            <Gradient/>
            <img
              className='absolute top-0 right-0 -z-10'
              src={stars}
              alt="Stars Background"

              />

            <ArrowBigDownDashIcon className="animate-float-arrow text-white mt-10" />

            <style>{`
              @keyframes float-arrow {
                0% { transform: translateY(0); }
                50% { transform: translateY(24px); }
                100% { transform: translateY(0); }
              }
              .animate-float-arrow {
                animation: float-arrow 2s ease-in-out infinite;
              }
            `}</style>
    </motion.div>
  )
}

export default Hero


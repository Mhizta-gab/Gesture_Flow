// import { Space_Grotesk } from 'next/font/google'
// import React from 'react'
import Feature_Card from '../Feature_Card/Feature_Card'
import Thunderbolt from '../../../public/thunderbolt'
import Customize from '../../../public/customize'
import Nodes from '../../../public/nodes'
import Support from '../../../public/support'
import Trend from '../../../public/trend'
import Sheild from '../../../public/sheild'
import Stars from '../../../public/stars.png'
import { motion } from 'framer-motion'
// import Image from 'next/image'

// const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'] })

const FeaturesData = [
  {
    title: 'Real-Time Sign Detection',
    description: 'Instantly detect and translate sign language gestures from your webcam feed using advanced AI.',
    icon: <Thunderbolt />,
  },
  {
    title: 'Seamless Webcam Integration',
    description: 'Effortlessly connect your webcam and start recognizing sign language with a single click.',
    icon: <Customize />,
  },
  {
    title: 'Accurate Gesture Recognition',
    description: 'Benefit from high-accuracy gesture recognition powered by state-of-the-art neural networks.',
    icon: <Nodes />,
  },
  {
    title: 'Live Text Translation',
    description: 'See real-time text translations of detected signs, making communication smoother and more accessible.',
    icon: <Support />,
  },
  {
    title: 'User-Friendly Interface',
    description: 'Enjoy an intuitive and accessible interface designed for users of all ages and abilities.',
    icon: <Trend />,
  },
  {
    title: 'Privacy & Security',
    description: 'Your video data is processed securely and never stored, ensuring your privacy at all times.',
    icon: <Sheild />,
  },
]

const Features = () => {
  return (
    <motion.div
      className='relative'
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <img src={Stars} alt='stars' className='absolute top-0 left-0 w-full h-full object-cover -z-40' />
      <div className='flex flex-col justify-center items-center mt-20'>
        <div className='rounded-full bg-[rgba(124,59,237,0.20)] flex gap-2 items-center px-2 py-1 border-[1px] border-[#FAFAFA1A] backdrop-blur-md'>
          <p className="bg-gradient-to-r from-[#B2A8FD] via-[#8678F9] to-[#C7D2FE] bg-clip-text text-transparent text-sm font-light">
            Perks
          </p>
        </div>
      </div>
      <h1 className={`text-[50px] text-center font-bold text-white mb-4 `}>
        Discover the Features
      </h1>
      <p className='text-white/60 text-md font-light text-center'>
        Explore the powerful features and advantages that Gesture Flow offers to help you understand <br /> sign language in real time.
      </p>
      <motion.div
        className='flex flex-row flex-wrap justify-center my-5'
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
        viewport={{ once: true }}
      >
        {FeaturesData.map((feature, index) => (
          <motion.div
            key={index + feature.title}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Feature_Card
              title={feature.title}
              icon={feature.icon}
              description={feature.description}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Features
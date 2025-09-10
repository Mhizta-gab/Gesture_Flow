'use client'
// import { Space_Grotesk } from 'next/font/google'
// import Image from 'next/image'
// import React from 'react'
import Stars from '../../../public/stars.png'
import User_Card from '../User_Card/User_Card'
import profile_image from '../../../public/profile_image.png'
import { motion } from 'framer-motion'

// Example user data (prepopulated to 8, using the same image)
const users = [
  {
    title: 'Jane Doe',
    description: 'Gesture Flow helped me communicate with my deaf friends in real time.',
    image: profile_image,
    userId: 'jane_doe',
  },
  {
    title: 'John Smith',
    description: 'The webcam integration is seamless and the privacy features give me peace of mind.',
    image: profile_image,
    userId: 'john_smith',
  },
  {
    title: 'Amina Bello',
    description: 'I love how easy it is to use. The live text translation is a game changer for my classroom.',
    image: profile_image,
    userId: 'amina_bello',
  },
  {
    title: 'Carlos Ruiz',
    description: 'Gesture Flow makes learning sign language fun and interactive for my students.',
    image: profile_image,
    userId: 'carlos_ruiz',
  },
  {
    title: 'Emily Zhang',
    description: 'The accuracy of sign detection is impressive. It bridges the communication gap for me.',
    image: profile_image,
    userId: 'emily_zhang',
  },
  {
    title: 'Fatima Al-Farsi',
    description: 'I can now communicate with my hearing-impaired family members more easily.',
    image: profile_image,
    userId: 'fatima_alfarsi',
  },
  {
    title: 'Liam O\'Connor',
    description: 'The interface is so intuitive and the privacy features are top-notch.',
    image: profile_image,
    userId: 'liam_oconnor',
  },
  {
    title: 'Sophia Rossi',
    description: 'Gesture Flow has made my classroom more inclusive and engaging.',
    image: profile_image,
    userId: 'sophia_rossi',
  },
]

// const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'] })

// Split into two rows of 4
const row1 = users.slice(0, 4)
const row2 = users.slice(4, 8)

const CARD_WIDTH = 256 // w-64 in px
const GAP = 20 // gap-5 in px
const VISIBLE_CARDS = 4
const CONTAINER_WIDTH = CARD_WIDTH * VISIBLE_CARDS + GAP * (VISIBLE_CARDS - 1) // 256*4 + 20*3 = 1104px

const Users = () => {
  return (
    <motion.section
      className="relative mx-25 my-10 py-24 flex flex-col items-center overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      {/* Background stars */}
      <img
        src={Stars}
        alt="stars"
        className="absolute top-0 left-0 w-full h-full object-cover -z-40"
      />
      {/* Overlay blur circles */}
      <div className="absolute top-24 left-1/4 w-28 h-28 bg-[#00ADB5]/70 rounded-full blur-3xl z-0" />
      <div className="absolute top-24 right-1/4 w-28 h-28 bg-[#00ADB5]/70 rounded-full blur-3xl z-0" />
      {/* Section header */}
      <div className="flex flex-col justify-center items-center z-20">
        <div className="rounded-full bg-[rgba(124,59,237,0.20)] flex gap-2 items-center px-2 py-1 border border-[#FAFAFA1A] backdrop-blur-md mb-4">
          <p className="bg-gradient-to-r from-[#B2A8FD] via-[#8678F9] to-[#C7D2FE] bg-clip-text text-transparent text-sm font-light">
            Our Customers
          </p>
        </div>
        <h1 className={`text-[40px] md:text-[50px] text-center font-bold text-white mb-4 `}>
          What our users say
        </h1>
        <p className="text-white/60 text-md font-light text-center max-w-2xl mb-5">
          We are proud to have helped thousands of customers across the globe.<br />
          Here are some of their stories.
        </p>
      </div>
      {/* User cards grid with opposite infinite scrolling rows */}
      <motion.div
        className="relative w-full py-5 flex flex-col gap-8 items-center z-20"
        initial="hidden"
        whileInView="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
        viewport={{ once: true }}
      >
        {/* Row 1: left to right */}
        <motion.div
          className="overflow-x-hidden mx-auto"
          style={{ width: `${CONTAINER_WIDTH}px` }}
          variants={{}}
        >
          <motion.div
            className="flex flex-nowrap gap-5 animate-scroll-users"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {[...row1].map((user, idx) => (
              <motion.div
                key={user.userId + '-row1-' + idx}
                className="flex-shrink-0 w-full"
                style={{ minWidth: `${CARD_WIDTH}px`, maxWidth: `${CARD_WIDTH}px` }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <User_Card
                  title={user.title}
                  description={user.description}
                  image={user.image}
                  userId={user.userId}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Row 2: right to left */}
        <motion.div
          className="overflow-x-hidden mx-auto"
          style={{ width: `${CONTAINER_WIDTH}px` }}
          variants={{}}
        >
          <motion.div
            className="flex flex-nowrap gap-5 animate-scroll-users-reverse"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {[...row2].map((user, idx) => (
              <motion.div
                key={user.userId + '-row2-' + idx}
                className="flex-shrink-0 w-full"
                style={{ minWidth: `${CARD_WIDTH}px`, maxWidth: `${CARD_WIDTH}px` }}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <User_Card
                  title={user.title}
                  description={user.description}
                  image={user.image}
                  userId={user.userId}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        {/* Faded gradients left/right */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-64 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-zinc-950 to-transparent z-10" />
      </motion.div>
      {/* Custom scroll animations */}
      <style>{`
        @keyframes scroll-users {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-users-reverse {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-scroll-users {
          animation: scroll-users 20s linear infinite;
        }
        .animate-scroll-users-reverse {
          animation: scroll-users-reverse 20s linear infinite;
        }
      `}</style>
    </motion.section>
  )
}

export default Users
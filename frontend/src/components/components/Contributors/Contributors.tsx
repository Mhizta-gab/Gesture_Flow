'use client'
// import React from 'react'
import Turso from '../../../public/turso'

const Contributors = () => {
  return (
    <div className="mt-20 mx-25 flex flex-col gap-2 text-center text-white/60">
      <h2>Special Thanks to our Contributors</h2>
      <div className="relative w-full flex justify-center">
        {/* Faded left effect */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black/60 to-transparent z-10" />
        {/* Faded right effect */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/60 to-transparent z-10" />
        {/* Scrolling row */}
        <div className="overflow-hidden w-full">
          <div className="flex gap-5 animate-scroll-horizontal">
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            {/* Duplicate for seamless scroll */}
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
            <Turso />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-horizontal {
          width: max-content;
          animation: scroll-horizontal 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Contributors
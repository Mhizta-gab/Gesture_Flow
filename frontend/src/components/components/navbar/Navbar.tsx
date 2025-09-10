'use client'

// import React from 'react'
import logo from '../../../public/logo.png'
import { useNavigate } from 'react-router-dom'
import {  UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { MenuIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

const Navbar = () => {
    // const router = useRouter()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navlinks = [
        { name: 'How it works', href: '/' },
        { name: 'Features', href: '/about' },
        { name: 'Pricing', href: '/contact' },
        { name: 'Integration', href: '/contact' },
        { name: 'Resources', href: '/contact' },
    ];
  return (
      <nav className="fixed top-0 left-0 right-0 mx-2 md:mx-20 flex justify-between items-center rounded-xl border px-4 md:px-6 py-2 mt-5 border-white/10 bg-white/5 shadow-[0px_1px_5px_1px_rgba(255,255,255,0.06)]   z-50 backdrop-blur-md ">
          {/* Logo and Desktop Links */}
          <div className='flex gap-7 items-center'>
            <img src={logo} alt="Logo" className="w-8" />
            <div className="hidden md:flex">
               {navlinks.map((link, index) =>(
                <a 
                  className='text-white/60 text-sm  hover:text-white transition-colors duration-300 mr-4'
                  key={index + link.name} 
                  href={link.href}                 >
                  {link.name}
                </a>
               ))}
            </div>
          </div>
        
        {/* Desktop Buttons */}
        <div className='hidden md:flex gap-4 items-center'>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn">Sign In</button>
            </SignInButton>
          </SignedOut>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-[#FFF] text-sm hover:cursor-pointer text-[#0F0F0F] text-center px-3 py-2 rounded-md"
          >
            Try It Now
          </button>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-200 hover:text-white focus:outline-none">
            {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 shadow-md z-50 flex flex-col md:hidden animate-fade-in rounded-b-xl">
            {navlinks.map((link, index) => (
              <a
                className="px-6 py-3 text-[#0F0F0F] text-sm hover:text-indigo-600 border-b border-gray-200"
                key={index + link.name + '-mobile'}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col px-6 py-3 space-y-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn w-full">Sign In</button>
                </SignInButton>
              </SignedOut>
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                className="bg-[#0F0F0F] text-white text-sm hover:cursor-pointer text-center px-3 py-2 rounded-md"
              >
                Start For Free
              </button>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        )}
      </nav>
  )
}

export default Navbar
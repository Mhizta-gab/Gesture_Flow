// import React from "react"
// import Image from "next/image"
import stars from "../../../public/stars.png"

const Footer = () => {
  return (
    <footer className="w-full relative bg-transparent flex flex-col items-center pt-10 pb-0">
      <div className="relative flex flex-col md:flex-row gap-16 md:gap-[220px] max-w-[1152px] w-full px-6 md:px-12 pb-20">
        {/* Left: Logo & Tagline */}
        <div className="relative flex flex-col items-start min-w-[192px] max-w-[192px]">
          {/* Logo */}
          <div className="flex flex-col items-start mb-8">
            <span className="text-[#00adb5] text-[36px] font-normal leading-none select-none">G
              <span className="font-italianno text-[#00adb5]">f</span>
            </span>
            <p className="text-[#fafafa] text-base mt-2 leading-6">
              Empower your business<br />with our AI tools.
            </p>
          </div>
          {/* CTA Button */}
          <button className="bg-[#7C3BED] text-white text-sm font-medium rounded-md px-6 py-2 mt-4 shadow hover:bg-[#6d28d9] transition">
            Start for free
          </button>
        </div>

        {/* Center: Links */}
        <div className="flex-1 flex flex-wrap gap-12 md:gap-16">
          {/* Product */}
          <div>
            <h4 className="text-[#fafafa] text-[14px] font-medium mb-3">Product</h4>
            <ul className="flex flex-col gap-1">
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Home</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Features</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Pricing</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Contact</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Download</a></li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h4 className="text-[#fafafa] text-[14px] font-medium mb-3">Resources</h4>
            <ul className="flex flex-col gap-1">
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Blog</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Help Center</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Community</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Guides</a></li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="text-[#fafafa] text-[14px] font-medium mb-3">Legal</h4>
            <ul className="flex flex-col gap-1">
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Privacy</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Terms</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Cookies</a></li>
            </ul>
          </div>
          {/* Developers */}
          <div>
            <h4 className="text-[#fafafa] text-[14px] font-medium mb-3">Developers</h4>
            <ul className="flex flex-col gap-1">
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">API Docs</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">SDKs</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Tools</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Open Source</a></li>
              <li><a href="#" className="text-[#fafafa] text-sm hover:text-[#00adb5] transition">Changelog</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full max-w-[1152px] h-px bg-gradient-to-r from-[#28223933] via-transparent to-[#28223900] mb-0" />

      {/* Bottom: Copyright & Socials */}
      <div className="flex justify-between items-center w-full max-w-[1152px] px-6 md:px-12 py-6">
        <p className="text-[#e1dcfe] text-sm">© 2025 Gesture Flow. All rights reserved.</p>
        <div className="flex gap-4">
          {/* Replace these with your actual social icon components/links */}
          <a href="#" aria-label="Twitter" className="w-5 h-5 bg-[#00adb5] rounded-full flex items-center justify-center text-white">T</a>
          <a href="#" aria-label="GitHub" className="w-5 h-5 bg-[#7C3BED] rounded-full flex items-center justify-center text-white">G</a>
          <a href="#" aria-label="LinkedIn" className="w-5 h-5 bg-[#00adb5] rounded-full flex items-center justify-center text-white">L</a>
        </div>
      </div>

      <img
              className='absolute top-0 right-0 -z-10'
              src={stars}
              alt="Stars Background"

              />
    </footer>
  )
}

export default Footer
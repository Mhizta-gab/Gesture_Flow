// import React from "react"
// import Image from "next/image"
import Stars from "../../../public/stars.png"

const Elevate = () => {
  return (
    <div className="relative w-full h-[500px] rounded-[24px] border border-[#fafafa1a] overflow-hidden mx-auto">
      {/* Background blur at bottom */}
      <div className="absolute left-0 bottom-0 w-full h-12 bg-[#8b5cf6] blur-[20px] opacity-100 pointer-events-none z-0" />

      {/* Gradient overlays */}
      <div className="absolute left-0 top-[200px] w-[calc(100%-32px)] h-[572px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg,rgba(255,255,255,0.3) 2%,rgba(255,255,255,0) 2%),linear-gradient(180deg,rgba(255,255,255,0.3) 2%,rgba(255,255,255,0) 2%)"
        }}
      />

      {/* Top fade overlay */}
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-t from-zinc-950/90 to-transparent z-10 pointer-events-none" />

      {/* Background image (replace with your image if needed) */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage:`url(${Stars})`}} />

      {/* Heading */}
      <div className="absolute left-1/4 top-[114px] flex flex-col items-center z-50 w-[calc(100%-2*25%)]">
        <h2 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent text-[60px] font-semibold leading-[75px] text-center mb-2">
          Elevate your experience with us
        </h2>
      </div>

      {/* Subheading */}
      <div className="absolute left-1/4 top-[288px] flex flex-col items-center max-w-xl px-2 z-20 w-[calc(100%-2*25%)]">
        <p className="text-[#fafafaCC] text-[18px] leading-7 text-center">
          Ready to get started? Sign up now and start your journey with us.<br />
          We are here to help you grow.
        </p>
      </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 cursor-pointer justify-center z-40 items-center
            absolute left-1/2 top-[75%] -translate-x-1/2 w-full px-4 sm:static sm:translate-x-0">
              <button className="bg-[#7C3BED] text-white text-base sm:text-lg font-medium rounded-md px-8 py-2.5 shadow hover:bg-[#6d28d9] transition w-full max-w-xs sm:w-auto">
                  Get Started
              </button>
              <button className="bg-white text-[#7C3BED] text-base sm:text-lg font-medium rounded-md px-8 py-2.5 shadow hover:bg-[#f3f4f6] transition w-full max-w-xs sm:w-auto">
                  Learn More
              </button>
          </div>
    </div>
  )
}

export default Elevate
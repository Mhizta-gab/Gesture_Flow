import React, { ReactNode } from 'react'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
}

const Feature_Card: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div
      className="border border-[#262626] p-11 relative overflow-hidden w-[352px] h-[235px] transition-all duration-300
      hover:bg-gradient-to-br hover:from-black/50 hover:via-[#7c3bed]/20 hover:to-[#a78bfa]/20 hover:cursor-pointer hover:p-12 group"
    >
      <div className="mb-4 hover:text-white">{icon}</div>
      <h3 className="text-lg font-extralight text-white mb-2">{title}</h3>
      <p className="text-md font-extralight text-white/50">{description}</p>
      <div
        className="w-1.5 h-10 absolute left-0 top-24 rounded-r-full bg-[#404040] transition-all duration-300
        group-hover:bg-[#a78bfa]"
      ></div>
    </div>
  )
}

export default Feature_Card
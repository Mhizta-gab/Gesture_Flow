// import Image, { ImageProps } from 'next/image'
import React from 'react'

interface FeatureCardProps {
  title: string
  description: string
  image: string  // Adjusted to accept Image src type
  userId: string
}

const User_Card: React.FC<FeatureCardProps> = ({ title, description, image, userId }) => {
  return (
    <div className="rounded-[12px] w-[235px] border border-[rgba(250,250,250,0.05)] bg-[rgba(250,250,250,0.05)] flex flex-col items-center  p-3 shadow-md">
      <div className='flex gap-2 w-full'>
        <img
        src={image}
        alt={title}
        className="rounded-full h-10 w-10 object-cover mb-2"
      />
      <div className='flex flex-col gap-[-8px]'>
        <h3 className="text-lg font-semibold text-white text-center">{title}</h3>
        <span className="text-xs text-white/50 mb-2">@{userId}</span>
      </div>
      
      </div>  
  
      <p className="text-sm text-left  text-white/70 ">{description}</p>
    </div>
  )
}

export default User_Card
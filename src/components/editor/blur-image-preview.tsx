"use client"
import React from 'react'
import DropzoneCard from './upload-card'

const BlurImagePreview = () => {
  return (
    <div className='w-full flex items-center justify-center h-full flex-col gap-4'>
        {/* <div className="video w-full  rounded-2xl h-[300px] bg-background/10 "></div> */}
      <DropzoneCard type='image'/>
        
    </div>
  )
}

export default BlurImagePreview
"use client"
import React from 'react'

const BlurVideoPreview = () => {
  return (
    <div className='w-full flex flex-col gap-4'>
        {/* <div className="video w-full  rounded-2xl h-[300px] bg-background/10 "></div> */}

        <div className="how-it-works flex flex-col px-10 py-5">
            <img src="steps.png" className='w-[80%] mx-auto' alt="" />
        </div>
    </div>
  )
}

export default BlurVideoPreview
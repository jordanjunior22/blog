import React from 'react'
import { Quote } from 'lucide-react';

function Quotes() {
  return (
    <div className='flex flex-col items-center bg-(--cta-color) gap-5 px-6 py-6 md:px-30 md:py-15 text-white'>
        <Quote/>
        <p>"Our first intentional act of the day upon waking up should be a profound smile of gratitude."</p>
        <h1>Ni Timah</h1>
    </div>
  )
}

export default Quotes
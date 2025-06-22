import React from 'react'
import { Quote } from 'lucide-react';

function Quotes() {
  return (
    <div className='flex flex-col items-center bg-(--cta-color) gap-5 px-6 py-6 md:px-30 md:py-15 text-white'>
        <Quote/>
        <p>"The universe is not only stranger than we imagine, but stranger than <br/> we can imagine. In poetry, we glimpse what logic cannot grasp."</p>
        <h1>Alexander Matthews</h1>
    </div>
  )
}

export default Quotes
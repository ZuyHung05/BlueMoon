import React from 'react'
import {feedback} from "constants"
import images from "assets/landing_page/images"
const Testimonial = () => 
   (
    <section className='grid grid-cols-1 sm:grid-cols-3 grid-rows-1 mt-16 relative z-[1]'>
        <img src={images.BgQuote} alt="Quote marks" className='absolute -left-[10px] -top-[40px] -z-[1]' />
{feedback.map((item)=>(
  
  <div key={item.id} className='bg-primary-testimonial-bluecolor mr-8 mb-8 px-6 py-8 text-white shadow-[0px_0px_10px_0px_#e1e1e129]'>

<p className='leading-5 mb-4 tracking-wide'>{item.content}</p>
<span className="flex">
  <img src={item.img} alt="feedback images" className='rounded-full max-w-[40px] mr-2' />
  <div className='flex flex-col mt-2'>
  <small className='font-bold mb-2 text-xs tracking-wide'>{item.name}</small>
  <small className='text-white/60'>{item.title}</small>

  </div>



</span>

</div>


))}


    </section>
  )


export default Testimonial
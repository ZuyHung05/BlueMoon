import React from 'react'
import images from "assets/landing_page/images"
const Howitworks = () => 
   (
    <section className='grid  grid-rows-1 grid-cols-1  sm:grid-cols-2 gap-5 mt-10 px-12'>
<div className='max-w-[600px] mb-8'>
  <img src={images.IllustrationSproductive} alt="stay productive" className='object-contain w-full' />

</div>

<div className='text-white mt-8 sm:mt-[6rem]'>

<h2 className=' text-2xl sm:text-4xl mb-8'>Stay productive,wherever you are</h2>
<p className='text-white/80 leading-7 text-[16px] font-opensans mb-4'>
Never let location be an issue when accessing your files. Fylo has you
covered for all of your file storage needs.
<br></br>
<br></br>
Securely share files and folders with friends, family and colleagues for live collaboration. No email attachments required.
</p>

<a href="#" className='text-[15px]  border-b-[1px] border-secondary-cyangradient text-secondary-cyangradient pb-1'>
<span>See how Fylo works</span><img src={images.ArrowIcon} alt="arrow"  className='inline ml-1 w-[20px]'/>
</a>

</div>


    </section>
  )


export default Howitworks
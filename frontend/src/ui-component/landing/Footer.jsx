import React from 'react'
import images from  "assets/landing_page/images"
import {footerLinks,socialMedia,contactInfo} from "constants"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => 
   (
<section className='grid grid-rows-1  sm:grid-cols-[minmax(300px,_1fr)_minmax(200px,_1fr)_1fr_1fr_1fr] gap-8 bg-[#0C1524] pt-44 px-12 lg:px-24 justify-center items-center'>
  <div>
    <img src={images.logo} alt="logo" className="w-[90px] h-[30px]" />

    <div className='flex items-start mt-4 justify-center grow'>
      <img src={images.iconLocation} alt="location of fylo" />
      <p className='text-white ml-4 text-xs text-justify leading-6'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.</p>

    </div>
 </div>
  

<div>
  {contactInfo.map((item)=>(
  <div key={item.id} >
  <a href={item.link} className='flex flex-1 text-white p-2 '><img src={item.icon} alt="contact icon" /><span className='ml-4'>{item.text}</span></a>

  </div>

))}

</div>





{footerLinks.map((item)=>(
  <div className='flex flex-col py-2 '> 
    {item.links.map((item)=>(
<a href={item.link} className='text-white mb-4'>{item.name}</a>

))}
  </div>


  ))}






<div className='text-center mb-8'>
    {socialMedia.map((item)=>(
       <span key={item.id} className='text-white text-[15px] inline-block mr-2 px-2 py-2 mb-2 border rounded-full hover:text-secondary-cyangradient hover:border-secondary-cyangradient'> 
       <FontAwesomeIcon icon={item.img} />
      </span>
  
  
   ))}

</div>






      


   </section>
  )


export default Footer
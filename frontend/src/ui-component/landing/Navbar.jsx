import {React,useState} from 'react';
import logo from 'assets/landing_page/logo.svg';
import {navLinks} from "constants";


 const Navbar = () => {
  return (
  <nav className='w-full flex justify-between text-white navbar px-4 py-4 md:px-16 md:py-8'>
<img src={logo} alt="logo" className="w-[90px] h-[30px]" />
<ul className='list-none justify-end items-center flex flex-1'>

{navLinks.map((nav, index) => (
<li key={nav.id} className ={`font-raleway ${index=== navLinks.length-1 ? ' mr-0':' mr-2 sm:mr-10'} `}>
<a href={`#{nav.id}`} className='text-[#bdc0ef] hover:underline hover:text-white'>
{nav.title}
</a>

</li>


))}


</ul>

    
  </nav>
  )
}

export default Navbar

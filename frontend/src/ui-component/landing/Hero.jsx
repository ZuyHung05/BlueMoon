import React from 'react';
import images from 'assets/landing_page/images'
import Button from './Button';

const Hero = () => 
   (
    <section id="hero-section" className="mt-4 flex flex-col flex-1 justify-center items-center text-center relative z-50">
  
  <picture className="absolute bottom-0 left-0 -z-50 w-full">  
    <source media="(min-width:375px )" srcset={images.BackgroundCurveDesktop} />
    <img src={images.BackgroundCurveMobile} alt="background-image" />
  </picture>
<div className="max-w-[500px] ">
<img src={images.IllustrationIntro} alt="hero-image" className={`w-full object-fit`}/>

 <h1 className="text-white text-3xl leading-relaxed font-raleway">
All your files in one secure location,
accessible anywhere.
</h1>
<p className="text-white text-sm sm:text-[16px] my-4 leading-10 mx-8 text-white/60 ">Fylo stores all your files in one secure location.
  Access them wherever you need, share and collaborate with
  friends family, and co-workers.
  </p>
  <Button style={{maxWidth:250,}} >
        Get Started
      </Button>

  </div>




    </section>
  )


export default Hero
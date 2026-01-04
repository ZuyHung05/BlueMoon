import React from 'react';
import { Navbar,Hero,Feature,Howitworks,Testimonial,Footer,SubscriptionForm} from 'ui-component/landing';

const App = () => (
<div className='w-full bg-primary-hero-bluecolor'>
<Navbar />
<Hero />
<div className='bg-primary-mainbody-bluecolor'>
<div className=' px-4 py-4 md:px-16 md:py-8'>
<Feature />
<Howitworks />
<Testimonial />
<SubscriptionForm />
</div>

</div>
<Footer />
</div>
  )


export default App
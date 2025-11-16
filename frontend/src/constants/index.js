import images from 'assets/landing_page/images'

import {faFacebookF, faInstagram,faTwitter} from '@fortawesome/free-brands-svg-icons'

export const navLinks = [
  
    
  {
    id: "features",
    title: "Features",
  },
  {
    id: "Team",
    title: "Team",
  },
  {
    id: "Sign In",
    title: "Sign In",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: images.AccessIcon,
    title: "Access your files, anywhere",
    content:
      "The ability to use a smartphone, tablet, or computer to access your account means your files follow you everywhere.",
  },
  {
    id: "feature-2",
    icon: images.Iconsecurity,
    title: "Security you can trust",
    content:
      "2-factor authentication and user-controlled encryption are just a couple of the security features we allow to help secure your files.",
  },
  {
    id: "feature-3",
    icon: images.CollabrationIcon,
    title: "Real-time collaboration",
    content:
      "Securely share files and folders with friends, family and colleagues for live collaboration. No email attachments required.",
  },
  {
    id: "feature-4",
    icon: images.AnyfileIcon,
    title: "Store any type of file",
    content:
      "Whether you're sharing holidays photos or work  documents, Fylo has you covered allowing for all file types to be securely stored and shared.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Fylo has improved our team productivity by an order of magnitude. Since making the  switch our team has become a well-oiled collaboration machine.",
    name: "Satish Patel",
    title: "Founder & CEO, Huddle",
    img: images.Profile1,
  },
  {
    id: "feedback-2",
    content:
      "Fylo has improved our team productivity by an order of magnitude. Since making the  switch our team has become a well-oiled collaboration machine.",
    name: "Bruce McKenzie",
    title: "Founder & CEO, Huddle",
    img: images.Profile2,
  },
  {
    id: "feedback-3",
    content:
    "Fylo has improved our team productivity by an order of magnitude. Since making the  switch our team has become a well-oiled collaboration machine.",
    name: "Iva Boyd",
    title: "Founder & CEO, Huddle",
    img: images.Profile3,
  },
];

export const contactInfo = [
  {
    id: "Phone",
    icon: images.iconPhone,
    link: "#",
    text:"+1-543-123-4567",
  },
  {
    id: "Email",
    icon: images.iconEmail,
    link: "#",
    text:" example@fylo.com",
  },
 ]




export const footerLinks = [
    {
        links: [
      {
        name: "About Us",
        link: "#",
      },
      {
        name: "Jobs",
        link: "#",
      },
      {
        name: "Press",
        link: "#",
      },
      {
        name: "Blog",
        link: "#",
      },
          ],
  },
  {
       links: [
      {
        name: "Contact Us",
        link: "#",
      },
      {
        name: "Terms",
        link: "#",
      },
      {
        name: "Privacy",
        link: "#",
      },
       ],
  },
  ];


  export const socialMedia = [
    {
      id: "facebook",
     img: faFacebookF,
    },
    {
      id: "twitter",
   img:faTwitter,
    },
    {
      id: "intsgram",
      img: faInstagram,
    },
  ];
  

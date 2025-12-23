import React from "react";
import images from "assets/landing_page/images";
import { footerLinks, socialMedia, contactInfo } from "constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => (
  <section className="grid grid-rows-1 sm:grid-cols-[minmax(300px,_1fr)_minmax(200px,_1fr)_1fr_1fr_1fr] gap-8 bg-[#0C1524] pt-44 px-12 lg:px-24 justify-center items-center">
    {/* Logo + Description */}
    <div>
      <img src={images.logo} alt="logo" className="w-[90px] h-[30px]" />
      <div className="flex items-start mt-4 justify-center grow">
        <img src={images.iconLocation} alt="location of fylo" />
        <p className="text-white ml-4 text-xs text-justify leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>

    {/* Contact Info */}
    <div>
      {contactInfo.map((contact) => (
        <div key={contact.id}>
          <a href={contact.link} className="flex flex-1 text-white p-2">
            <img src={contact.icon} alt="contact icon" />
            <span className="ml-4">{contact.text}</span>
          </a>
        </div>
      ))}
    </div>

    {/* Footer Links */}
    {footerLinks.map((group, groupIndex) => (
      <div key={group.id || groupIndex} className="flex flex-col py-2">
        {group.links.map((link, linkIndex) => (
          <a
            key={link.id || linkIndex}
            href={link.link}
            className="text-white mb-4 hover:text-secondary-cyangradient"
          >
            {link.name}
          </a>
        ))}
      </div>
    ))}

    {/* Social Media Icons */}
    <div className="text-center mb-8">
      {socialMedia.map((media) => (
        <span
          key={media.id}
          className="text-white text-[15px] inline-block mr-2 px-2 py-2 mb-2 border rounded-full hover:text-secondary-cyangradient hover:border-secondary-cyangradient"
        >
          <FontAwesomeIcon icon={media.img} />
        </span>
      ))}
    </div>
  </section>
);

export default Footer;

import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiMapPin, FiMail } from "react-icons/fi"; 
import Link from 'next/link';
import { Cinzel } from 'next/font/google';
import { SHOW_GALLERY } from '@/lib/features';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

const Footer = () => {
  return (
    <footer className="relative z-50 bg-black text-gray-300 w-full pt-10 md:pt-16 pb-5 md:pb-8 border-t border-red-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-6 md:mb-12">
          
          {/* KOLOM 1: BRANDING */}
          <div className="md:col-span-5 space-y-6">
            <h2 className={`${cinzel.className} text-2xl sm:text-3xl tracking-wide leading-tight`}>
              <span className="text-white font-bold block sm:inline">TEDx</span>
              <span className="text-red-600 font-bold break-all sm:break-normal">UNIVERSITASCIPUTRA</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              An independently organized TED event bringing together thinkers, innovators, and visionaries to share ideas worth spreading. Join us on our infinite journey.
            </p>
            
            {/* ICON SOSIAL MEDIA */}
            <div className="flex gap-3 pt-2">
              <SocialIcon icon={<FaInstagram size={14} />} href="https://www.instagram.com/tedxuniversitasciputrasurabaya/" label="Instagram" />
              <SocialIcon icon={<FaYoutube size={14} />} href="https://www.youtube.com/@TEDxUCSurabaya" label="YouTube" />
            </div>
          </div>

          {/* KOLOM 2: QUICK LINKS */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className={`${cinzel.className} text-white text-lg mb-6 uppercase tracking-wider`}>
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <FooterLink href="/about-ted">About TED</FooterLink>
              <FooterLink href="/past-tedx">Past TEDxUC</FooterLink>
              <FooterLink href="/schedule">Speakers & Schedule</FooterLink>
              {SHOW_GALLERY && <FooterLink href="/gallery">Gallery</FooterLink>}
              {/* <FooterLink href="/sponsor">Sponsor</FooterLink> */}
            </ul>
          </div>

          {/* KOLOM 3: CONTACT (UPDATED ICONS) */}
          <div className="md:col-span-3">
            <h3 className={`${cinzel.className} text-white text-lg mb-6 uppercase tracking-wider`}>
              Contact
            </h3>
            <div className="space-y-6 text-sm text-gray-400">
              
              <div className="flex items-start gap-4">
                <FiMapPin className="text-red-600 mt-1 shrink-0" size={20} />
                <p className="leading-relaxed">
                  Universitas Ciputra Surabaya<br />
                  Citraland<br />
                  Surabaya, Indonesia
                </p>
              </div>

              <div className="flex items-center gap-4">
                <FiMail className="text-red-600 shrink-0" size={20} />
                <a href="mailto:info@tedxucs.com" className="hover:text-red-500 transition-colors">
                  info@tedxucs.com
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-gray-900 pt-3 md:pt-6 flex flex-col md:flex-row justify-end items-center text-xs text-gray-600">
          <div className="w-full md:w-auto text-center md:text-right space-y-1">
            <p className="break-all sm:break-normal">© 2026 TEDxUniversitasCiputraSurabaya. All rights reserved.</p>
            <p className="italic opacity-60 wrap-break-word">This independent TEDx event is operated under license from TED.</p>
            </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-600 transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  if (href.startsWith('mailto:')) {
    return (
      <li>
        <a href={href} className="hover:text-red-500 transition-colors duration-200 block">
          {children}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className="hover:text-red-500 transition-colors duration-200 block">
        {children}
      </Link>
    </li>
  );
};

export default Footer;
"use client";

import React, { useEffect, useState } from 'react';
import ButtonNav from '../buttons/ButtonNav';

const LinkPageHeader = () => {

  const [showNav, setShowNav] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0); // スクロールしたか
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div >
      <div
        onMouseEnter={() => setShowNav(true)}
        onMouseLeave={() => setShowNav(false)}
        className="fixed p-2 top-0 z-50 w-16 md:w-20 lg:w-28 h-16 md:h-20 lg:h-28 left-1/2 transform -translate-x-1/2 rounded-full bg-main-nav cursor-pointer"
      >
        <img
          className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 md:w-12 lg:w-20'
          alt='daruma_icon'
          src='/images/daruma_logo_transparent.png'
        />
      </div>
      <nav
        onMouseEnter={() => setShowNav(true)}
        onMouseLeave={() => setShowNav(false)}
        className={`fixed top-0 left-0 w-full flex justify-center h-14 md:h-16 lg:h-24 bg-main-nav shadow-md z-40 transition-transform duration-300 ${hasScrolled && !showNav ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className='w-full md:w-[750px] lg:w-[980px] h-16 md:h-16 lg:h-24 flex justify-between items-center p-3'>
          <div>
            <ButtonNav href={"home"} text={"inicio"} className="bg-main-yellow ml-0" />
            <ButtonNav href={"study"} text={"Vamos a estudiar japonés"} className="ml-5" />
          </div>
          <div>
            <ButtonNav href={"login"} text={"iniciar sesión"} />
            <ButtonNav href={"register"} text={"Registrarse"} className={"ml-5 "} />
          </div>
        </div>
      </nav>
    </div>
  );
};
export default LinkPageHeader;
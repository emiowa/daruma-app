import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BotonHeader from '../botones/BotonHeader';
import BotonModeSwitch from '../botones/BotonModeSwitch';
import Image from 'next/image';


const LinkPaginasHeader = () => {

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
        className="fixed top-0 z-50 w-28 p-2 h-28 left-1/2 transform -translate-x-1/2 rounded-full bg-main-nav cursor-pointer"
      >
        <Image
          className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          alt='daruma_icon'
          src='/images/daruma_logo_transparent.png'
          width={90}
          height={90}
        />
      </div>
      <nav
        onMouseEnter={() => setShowNav(true)}
        onMouseLeave={() => setShowNav(false)}
        className={`fixed top-0 left-0 w-full h-24 bg-main-nav shadow-md z-40 transition-transform duration-300 ${hasScrolled && !showNav ? '-translate-y-full' : 'translate-y-0'
          }`}
      >
        <div className='w-full flex justify-between'>
          <div>
            <BotonHeader href={"inicio"} text={"inicio"} />
            <BotonHeader href={"estudiar"} text={"Vamos a estudiar japonés"} className="ml-5" />
          </div>
          <div>
            <BotonHeader href={"iniciar-sesion"} text={"iniciar sesión"} />
            <BotonHeader href={"registrarse"} text={"Registrarse"} className={"text-main-orange ml-5 !shadow-[3px_3px_0px_0px_rgba(242,103,73,0.9)] !border-main-orange"} />
          </div>
        </div>
      </nav>
    </div>
  );
};
export default LinkPaginasHeader;
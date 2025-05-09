'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const BouncingLogo = () => {

  useEffect(() => {
  }, []);

  return (
    <div
      className="relative w-full  flex items-center justify-between h-[400px]"
    >
      <div className=''>
        <Image
          src="/images/inicio_saludo.png"
          alt='daruma_icon'
          width={250}
          height={60} />
        <Image
          className='mt-5'
          src="/images/inicio_mensaje.png"
          alt='daruma_icon'
          width={350}
          height={60} />
      </div >
      <div className='w-[300px] flex justify-center'>
        <Image
          className='animation-bounce'
          src='/images/daruma_logo_transparent.png'
          alt='daruma'
          width={200}
          height={200}
        />
      </div>
    </div >
  );
};

export default BouncingLogo;

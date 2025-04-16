import Link from 'next/link';
import React, { useState } from 'react';
import BotonHeader from '../botones/BotonHeader';
import BotonModeSwitch from '../botones/BotonModeSwitch';


const LinkPaginasHeader = () => {
  const [isLight, setIsLight] = useState(true)
  return (
    <div className='flex items-center'>
      <BotonHeader href={"inicio"} text={"inicio"} />
      <BotonHeader href={"estudiar"} text={"Vamos a estudiar japonés"} />
      <div className='w-[1.4px] bg-gray-400 ml-3 h-[40px]'></div>
      <BotonHeader href={"iniciar-sesion"} text={"iniciar sesión"} />
      <BotonHeader href={"registrarse"} text={"Registrarse"} className={"text-main-red !shadow-[3px_3px_0px_0px_rgba(242,103,73,0.9)] !border-main-red"} />
      <div className='w-[1.4px] bg-gray-400 ml-3 h-[40px]'></div>
      <BotonModeSwitch isLight={isLight} setIsLight={setIsLight} />
    </div>
  );
};
export default LinkPaginasHeader;
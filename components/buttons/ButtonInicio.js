import Link from 'next/link';
import React from 'react';

const ButtonInicio = ({ text, className }) => {

  return (
    <>
      <button className={`p-1 md:p-2 lg:p-3 content bg-main-white shadow-small lg:text-[18px] ${className}`}>{text}</button>

    </>
  );
};
export default ButtonInicio;

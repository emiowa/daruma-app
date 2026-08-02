import Link from 'next/link';
import React from 'react';

const ButtonNav = ({ href, text, className }) => {

  return (
    <>
      <Link href={`/${href}`} >
        <button className={`p-1 md:p-2 lg:p-3 content bg-main-white shadow-small lg:text-[18px] ${className}`}>{text}</button>
      </Link>
    </>
  );
};
export default ButtonNav;


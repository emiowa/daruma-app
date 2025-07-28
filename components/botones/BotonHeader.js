import Link from 'next/link';
import React from 'react';

const BotonHeader = ({ href, text, className }) => {
  return (
    <>
      <Link href={`/${href}`}>
        <button className={`p-1 md:p-2 content bg-main-white shadow-small ${className}`}>{text}</button>
      </Link>
    </>
  );
};
export default BotonHeader;
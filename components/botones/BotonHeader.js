import Link from 'next/link';
import React from 'react';

const BotonHeader = ({ href, text, className }) => {
  return (
    <>
      <Link href={`/${href}`} className="ml-2">
        <button className={` border-black border rounded  p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] ${className}`}>{text}</button>
      </Link>
    </>
  );
};
export default BotonHeader;
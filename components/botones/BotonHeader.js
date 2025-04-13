import Link from 'next/link';
import React from 'react';

const BotonHeader = ({ href, text, className }) => {
  return (
    <>
      <Link href={`/${href}`} className="ml-2">
        <button className={`p-3 content shadow-small ${className}`}>{text}</button>
      </Link>
    </>
  );
};
export default BotonHeader;
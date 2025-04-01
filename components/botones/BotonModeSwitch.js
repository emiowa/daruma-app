import Link from 'next/link';
import React from 'react';
const BotonModeSwitch = ({ isLight, setIsLight }) => {
  return (
    <>
      <button
        className={`border rounded border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] ml-2`}
        onClick={() => setIsLight(prevState => !prevState)}
      >
        {isLight ? "on" : "off"}
      </button>
    </>
  );
};
export default BotonModeSwitch;
import Link from 'next/link';
import React from 'react';

const ButtonInicio = ({ text, type, disabled, className }) => {

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}    >
      {text}
    </button>

  );
};
export default ButtonInicio;

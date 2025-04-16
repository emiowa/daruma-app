
import React from 'react';
import { FaArrowRight } from "react-icons/fa";

const LinkVerTodosArticulos = () => {
  return (
    <>
      <div className='flex text-main-background text-sm'>
        <a href='/' className='underline text-[11px]'>Ver todos los artículos</a>
        <FaArrowRight className='icons-m ml-4' />
      </div>
    </>
  );
};
export default LinkVerTodosArticulos;
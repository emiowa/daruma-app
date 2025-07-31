
import React from 'react';
import { FaArrowRight } from "react-icons/fa";

const LinkVerTodosArticulos = () => {
  return (
    <>
      <div className='flex text-main-grey text-sm'>
        <a href='/estudiar/articulos' className='underline text-[11px] lg:text-[14px]'>Ver todos los artículos</a>
        <FaArrowRight className='icons-m ml-4' />
      </div>
    </>
  );
};
export default LinkVerTodosArticulos;
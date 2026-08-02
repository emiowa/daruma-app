
import React from 'react';
import { FaArrowRight } from "react-icons/fa";

const SeeEveryArticleLink = () => {
  return (
    <a
      href='/study/article'
      className='inline-flex items-center text-main-grey text-base md:text-lg font-bold gap-2 hover-float py-2 px-3 rounded-lg'
    >
      <div className='underline'>Ver todos los artículos</div>
      <FaArrowRight className='text-sm' />
    </a>
  );
};
export default SeeEveryArticleLink;
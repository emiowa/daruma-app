
import React from 'react';
import { FaArrowRight } from "react-icons/fa";

const SeeEveryArticleLink = () => {
  return (
    <>
      <a href='/study/article' className='flex text-main-grey text-sm'>
        <div className='underline text-[11px] lg:text-[14px]'>Ver todos los artícules</div>
        <FaArrowRight className='icons-m ml-4' />
      </a>
    </>
  );
};
export default SeeEveryArticleLink;
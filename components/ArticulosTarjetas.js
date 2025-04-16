import Image from 'next/image';
import React from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";


const ArticulosTarjetas = ({ title, description, imageUrl, liked, checked }) => {

  return (
    <>
      <div className='w-[170px] h-[258px] rounded mb-4 bg-main-white shadow-small text-main-grey overflow-hidden'>
        <div className="relative w-full h-[107px] overflow-hidden">
          <Image
            src={imageUrl}
            alt="Hiroshima"
            fill
            className="object-cover"
          />
          {checked &&
            <FaRegCircleCheck className='absolute top-2 right-2 z-10 text-sm bg-[#82B590] rounded-full ' />
          }
        </div>
        <div className='pt-4 px-2 h-[151px] relative w-full' >
          <p className='text-[11px]'>{title}</p>
          <p className='mt-4 text-[10px]'>{description}</p>
          <div className='absolute bottom-3  text-sm'>
            <div className='flex items-center justify-between w-[150px]'>
              {
                liked &&
                <FaHeart className='text-main-pink absolute top-1.2 left-0.4 text-[13px]' />
              }
              <FaRegHeart className='relative' />
              <div className='flex items-center '>
                <a href='/' className='underline text-[10px]'>Leer artículo</a>
                <FaArrowRight className='icons-m ml-1 text-[13px]' />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
export default ArticulosTarjetas;
import Image from 'next/image';
import React from 'react';
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";


const ArticulosTarjetas = ({ title, imageUrl, checked, label, star }) => {

  return (
    <>
      <div className='w-[170px] md:w-[146px] h-[200px] md:h-[185px] rounded mb-4 bg-main-white shadow-small text-main-grey overflow-hidden'>
        <div className="relative w-full h-[90px] overflow-hidden">
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
        <div className='pt-2 px-2 md:h-[95px] md:w-146px relative' >
          <div className='flex justify-between'>
            <div className={`${label.bg} md:text-[9px] md:px-1 rounded`}>{label.text}</div>
            <div className='flex relative'>
              <div className="flex gap-1 text-yellow-400">
                {Array.from({ length: 3 }).map((_, i) =>
                  i < star ? (
                    <FaStar key={i} className="text-sm" />
                  ) : (
                    <FaRegStar key={i} className="text-sm" />
                  )
                )}
              </div>
            </div>
          </div>
          <p className='text-[11px] font-bold mt-2'>{title}</p>
          <div className='absolute bottom-1 right-2  text-sm flex '>
            <a href='/' className='underline text-[9px]'>Leer artículo</a>
            <FaArrowRight className='icons-m ml-1 text-[13px]' />
          </div>

        </div>
      </div>
    </>
  );
};
export default ArticulosTarjetas;
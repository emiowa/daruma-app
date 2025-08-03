import Image from 'next/image';
import React from 'react';
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Link from 'next/link';
import { RubyText } from "@/lib/renderRuby"


const ArticulosTarjetas = ({ title, titleRuby, imageUrl, checked, id, label, star, page }) => {

  return (
    <>
      {
        page == "main" ?
          <div className='w-[170px] md:w-[146px] lg:w-[195px] h-[200px] md:h-[185px] lg:h-[260px] rounded lg:rounded-lg mb-4 bg-main-white shadow-small text-main-grey overflow-hidden'>
            <div className="relative w-full h-[90px] md:h-[90px] lg:h-[120px] overflow-hidden">
              <Image
                src={imageUrl}
                alt="Hiroshima"
                fill
                className="object-cover"
              />
              {checked &&
                <FaRegCircleCheck className='absolute top-2 lg:w-4 lg:h-4 right-2 z-10 bg-[#82B590] rounded-full ' />
              }
            </div>
            <div className='pt-2 lg:pt-4 px-2 lg:px-2 md:h-[95px] lg:h-[135px] relative' >
              <div className='flex justify-between'>
                <div className={`${label.bg} md:text-[9px] lg:text-[12px] md:px-1 lg:px-3 rounded`}>{label.text}</div>
                <div className='flex relative'>
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: 3 }).map((_, i) =>
                      i < star ? (
                        <FaStar key={i} className="text-sm lg:text-lg" />
                      ) : (
                        <FaRegStar key={i} className="text-sm lg:text-lg" />
                      )
                    )}
                  </div>
                </div>
              </div>
              <RubyText parts={titleRuby} className={'text-[11px] font-bold mt-2 lg:mt-5 lg:text-[14px]'} />
              <div className='absolute bottom-1 lg:bottom-1 right-2  text-sm flex '>
                <Link href={`/estudiar/articulos/${id}`} className='underline text-[9px] lg:text-[13px]'>Leer artículo</Link>
                <FaArrowRight className='icons-m ml-1 text-[13px]' />
              </div>
            </div>
          </div>
          :
          <div className='w-[170px] md:w-[160px] lg:w-[222px] h-[200px] md:h-[206px] lg:h-[285px] rounded lg:rounded-lg mb-4 bg-main-white shadow-small text-main-grey overflow-hidden'>
            <div className="relative w-full h-[90px] md:h-[100px] lg:h-[135px] overflow-hidden">
              <Image
                src={imageUrl}
                alt="Hiroshima"
                fill
                className="object-cover"
              />
              {checked &&
                <FaRegCircleCheck className='absolute top-2 lg:w-6 lg:h-6 right-2 z-10 bg-[#82B590] rounded-full ' />
              }
            </div>
            <div className='pt-2 lg:pt-4 px-2 lg:px-3 md:h-[95px] lg:h-[135px] relative' >
              <div className='flex justify-between'>
                <div className={`${label.bg} md:text-[9px] lg:text-[14px] md:px-1 lg:px-3 rounded`}>{label.text}</div>
                <div className='flex relative'>
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: 3 }).map((_, i) =>
                      i < star ? (
                        <FaStar key={i} className="text-sm lg:text-xl" />
                      ) : (
                        <FaRegStar key={i} className="text-sm lg:text-xl" />
                      )
                    )}
                  </div>
                </div>
              </div>
              <RubyText parts={titleRuby} className={'text-[11px] font-bold mt-2 lg:mt-6 lg:text-[16px]'} />
              <div className='absolute bottom-1 lg:bottom-1 right-2  text-sm flex '>
                <Link href={`/estudiar/articulos/${id}`} className='underline text-[9px] lg:text-[13px]'>Leer artículo</Link>
                <FaArrowRight className='icons-m ml-1 text-[13px]' />
              </div>
            </div>
          </div>
      }

    </>
  );
};
export default ArticulosTarjetas;
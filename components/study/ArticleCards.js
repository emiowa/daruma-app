"use client"

import Image from 'next/image';
import React from 'react';
import { FaRegCircleCheck, FaArrowRight, FaRegStar, FaStar } from "react-icons/fa6";
import Link from 'next/link';
import RubyText from "@/components/RubyText";

const ArticleCards = ({ title, leido, id, label, star, page }) => {
  const ARTICLE_IMAGE_BASE = "https://algrpsbdswhjpeityrai.supabase.co/storage/v1/object/public/articles";
  const isMain = page === "main";

  return (
    // ⭕️ カード全体を Link で包む
    <Link
      href={`/study/article/${id}`}
      className={`
        block transition-all duration-300 ease-out transform
        /* 👇 修正：ホバー時、上に浮き上がりつつ、元々の影を「 drop-shadow」で右下に強調 */
        hover:-translate-y-1.5 hover:drop-shadow-[6px_6px_8px_rgba(0,0,0,0.15)]
        ${isMain ? 'w-[170px] md:w-[146px] lg:w-[195px] h-[200px] md:h-[185px] lg:h-[260px]' : 'w-[170px] md:w-[160px] lg:w-[222px] h-[200px] md:h-[206px] lg:h-[285px]'} 
        rounded lg:rounded-lg mb-4 bg-main-white
        /* 👇 元々の右下の影 */
        shadow-small
        text-main-grey overflow-hidden
      `}
    >
      {/* 🖼️ 上部：画像エリア */}
      <div className={`relative w-full ${isMain ? 'h-[90px] md:h-[90px] lg:h-[120px]' : 'h-[90px] md:h-[100px] lg:h-[135px]'} overflow-hidden`}>
        <Image
          src={`${ARTICLE_IMAGE_BASE}/article_${id}/main.png`}
          alt={title}
          fill
          className="object-cover"
          // sizesのタイポも修正済み
          sizes={isMain ? "(max-width: 768px) 170px, (max-width: 1024px) 146px, 195px" : "(max-width: 768px) 170px, (max-width: 1024px) 160px, 222px"}
        />
        {leido && (
          <FaRegCircleCheck className={`absolute top-2 ${isMain ? 'lg:w-4 lg:h-4' : 'lg:w-6 lg:h-6'} right-2 z-10 bg-[#82B590] rounded-full text-white`} />
        )}
      </div>

      {/* 📝 下部：テキスト・情報エリア */}
      <div className={`pt-2 lg:pt-4 px-2 ${isMain ? 'lg:px-2' : 'lg:px-3'} md:h-[95px] lg:h-[135px] relative`} >
        <div className='flex justify-between items-center'>
          <div className={`${label.bg} md:text-[9px] lg:text-[12px] px-1.5 lg:px-3 py-0.5 rounded text-white`}>
            {label.text}
          </div>
          <div className='flex relative'>
            <div className={`flex gap-0.5 text-yellow-400 ${!isMain && 'text-sm lg:text-xl'}`}>
              {Array.from({ length: 3 }).map((_, i) =>
                i < star ? (
                  <FaStar key={i} className={isMain ? "text-sm lg:text-lg" : ""} />
                ) : (
                  <FaRegStar key={i} className={isMain ? "text-sm lg:text-lg" : ""} />
                )
              )}
            </div>
          </div>
        </div>

        <div className={`font-bold mt-2 line-clamp-2 ${isMain ? 'lg:mt-5 text-[11px] lg:text-[14px]' : 'lg:mt-6 text-[11px] lg:text-[16px]'}`}>
          <RubyText rawText={title} />
        </div>
      </div>
    </Link>
  );
};

export default ArticleCards;
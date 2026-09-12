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
    <Link
      href={`/study/article/${id}`}
      className={`
        block transition-all duration-300 ease-out transform
        hover:-translate-y-1.5 hover:drop-shadow-[6px_6px_8px_rgba(0,0,0,0.15)]
        ${isMain ? 'w-[170px] md:w-[146px] lg:w-[195px] h-[200px] md:h-[185px] lg:h-[260px]' : 'w-[170px] md:w-[160px] lg:w-[222px] h-[200px] md:h-[206px] lg:h-[285px]'} 
        rounded lg:rounded-lg mb-4 bg-main-white
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
          sizes={isMain ? "(max-width: 768px) 170px, (max-width: 1024px) 146px, 195px" : "(max-width: 768px) 170px, (max-width: 1024px) 160px, 222px"}
        />

        {/* ⭕️ 既読（leido = true）の場合に右上に緑のチェックアイコンを表示 */}
        {leido && (
          <div className="absolute top-2 right-2 z-10 flex items-center justify-center bg-green-500 rounded-full text-white p-0.5 shadow-md border border-white/80">
            <FaRegCircleCheck className={`${isMain ? 'w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5' : 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6'}`} />
          </div>
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
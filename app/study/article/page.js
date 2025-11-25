"use client";

import ArticleCards from '@/components/study/ArticleCards';
import Head from 'next/head';
import { useState } from 'react';
import CardData from "@/data/cards.json"

function Articles() {

  const ArticleNum = 12
  const [articleNum, setArticleNum] = useState(ArticleNum)
  const handleArticleNum = () => {
    setArticleNum(prev => prev + ArticleNum)
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title >Articles</title>
        <meta name='description' content='記事' />
      </Head>
      <>
        <div className='md:mt-20 bg-main-lightBlue w-[570px] md:w-[720px] lg:w-[1000px] content md:pt-28 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large relative'>
          <div className='text-main-grey font-bold md:text-6xl lg:text-7xl absolute md:-top-16 lg:-top-[75px] md:left-8 space-y-3'>
            <div>き</div>
            <div>じ</div>
          </div>
          <div className='flex flex-wrap gap-3 mt-3 lg:mt-12 justify-center'>
            {
              CardData.slice(0, articleNum).map((item) => (
                <ArticleCards key={item.title} title={item.title} titleRuby={item.titleRuby} id={item.id} label={item.label} imageUrl={item.imageUrl} star={item.star} checked={item.checked} />
              ))
            }
          </div>
          {CardData.length > articleNum &&
            <div className='flex justify-center relative' onClick={() => handleArticleNum()}>
              <div className='md:m-9 md:w-12 md:h-12 border border-solid border-black rounded-full'>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-2xl">
                  +
                </span>
              </div>
            </div>
          }
        </div>
      </>
    </>
  )
}
export default Articles;
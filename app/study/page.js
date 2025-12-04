"use client";

import Head from 'next/head';
import { IoEyeOutline, IoBookOutline } from "react-icons/io5";
import { VscFlame } from "react-icons/vsc";
import ButtonAudioFunFactData from '@/components/buttons/ButtonAudioFunFactData';
import ButtonAudioVocabulary from '@/components/buttons/ButtonAudioVocabulary';
import SeeEveryArticleLink from '@/components/links/SeeEveryArticleLink';
import ArticleCards from '@/components/study/ArticleCards';
import VocabularyRow from '@/components/VocabularyRow';
import { FaArrowRight } from "react-icons/fa";
import { useState } from 'react';
import CardData from "@/data/cards.json"
import Vocabulary from "@/data/vocabulary.json"

function Study() {
  const articleNum = 6
  const vocabularyNum = 5

  const [isJapanese, setIsJapanese] = useState(true)
  const handleToggleLanguage = () => {
    setIsJapanese(prev => !prev)
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title >study</title>
        <meta name='description' content='私たちはグラン戸田住人' />
      </Head>
      <div className='w-full md:w-[720px] lg:w-[1000px]' >
        <div className='flex justify-center h-40 md:h-48 lg:h-64'>
          {/* --------------------------------------points-------------------------------------- */}
          <div className='bg-main-orange md:w-[210px] lg:w-[280px] content shadow-large md:pt-9 lg:pt-12 md:px-2 flex flex-col md:gap-6'>
            <div className='flex text-[rgb(246,239,221)] items-end ml-2'>
              <p className='text-4xl md:text-4xl lg:text-5xl'>200</p>
              <p className='text-xm md:text-xm ml-1 md:ml-1'>ポイント</p>
            </div>
            <div className='bg-main-white w-full h-16 md:h-20 lg:h-28 shadow-small content p-2'>
              <div className='flex'>
                <IoEyeOutline className='text-[15px] md:text-[15px] lg:text-[18px] lg:mt-[2px]' />
                <p className='ml-1 text-[10px] md:text-[10px] lg:text-[14px] font-semibold'>Artículos leídos: 10</p>
              </div>
              <div className='flex-col ml-1 mt-3 md:mt-4 lg:mt-5'>
                <div className='flex'>
                  <IoBookOutline className='text-[15px] md:text-[15px] lg:text-[18px] lg:mt-[2px]' />
                  <p className='ml-1 text-[10px] md:text-[10px] lg:text-[14px]'>Artículos para principiantes: 8</p>
                </div>
                <div className='flex mt-1'>
                  <VscFlame className='text-[15px] md:text-[15px] lg:text-[18px] lg:mt-[2px]' />
                  <p className='ml-1 text-[10px] md:text-[10px] lg:text-[14px]'>Artículos para avanzados: 2</p>
                </div>
              </div>
            </div>
          </div>
          {/* --------------------------------------tips-------------------------------------- */}
          <div className='content shadow-large  bg-main-white w-[450px] md:w-[510px] lg:w-[680px] ml-3 pt-3 lg:pt-5 pl-5 lg:pl-7 md:pl-4 relative overflow-hidden'>
            <img
              src="/images/sushi.png"
              alt="sushi"
              className='absolute top-0 right-0 w-42 md:w-52 lg:w-72'
            />
            <div className='w-[290px] md:w-[250px] lg:w-[340px]'>
              <p className='text-xl font-bold md:text-2xl lg:text-4xl'>
                {isJapanese
                  ? "まめちしき"
                  : "Curiosidades"
                }
              </p>
              <div className='text-[10px] md:text-[10px] lg:text-[14px]'>
                <p className='mt-5 md:mt-4 lg:mt-6'>
                  {isJapanese
                    ? "知っていましたか..."
                    : "¿Sabías que...?"
                  }</p>
                <p className='mt-5 md:mt-4 lg:mt-6'>
                  {isJapanese
                    ? "女性の手は男性よりも熱く、魚の鮮度を損なう可能性があると言われているため、日本では寿司を握る女性の職人がほとんどいません。"
                    : "Hay muy pocas chefs de sushi en Japón porque se dice que las manos de las mujeres están más calientes que las de los hombres y pueden arruinar la frescura del pescado."
                  }
                </p>
              </div>
              <div className='flex text-[11px] absolute bottom-5 lg:text-[14px] '>
                <ButtonAudioVocabulary handleToggleLanguage={handleToggleLanguage} />
                <ButtonAudioFunFactData audio={"/sounds/goi.mp4"} />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-center mt-8 lg:mt-20'>
          {/* --------------------------------------article-------------------------------------- */}
          <div className='bg-main-lightBlue w-[570px] md:w-[570px] lg:w-[660px] h-[650px] md:h-[500px] lg:h-[750px] content p-4 lg:p-6 shadow-large'>
            <div className='flex justify-between items-center'>
              <p className='text-main-grey font-bold md:text-2xl lg:text-4xl'>きじ</p>
              <SeeEveryArticleLink />
            </div>
            <div className='flex flex-wrap gap-3 mt-3 lg:mt-12'>
              {
                CardData.slice(0, articleNum).map((item) => (
                  <ArticleCards key={item.id} title={item.title} titleRuby={item.titleRuby} id={item.id} label={item.label} imageUrl={item.imageUrl} star={item.star} leido={item.leido} page="main" />
                ))
              }
            </div>
          </div>
          {/* --------------------------------------vocabulary-------------------------------------- */}
          <div className='bg-main-white w-[240px] md:w-[240px] lg:w-[300px] h-[400px] md:h-[400px] lg:h-[550px] ml-3 content px-3 py-5 shadow-large'>
            <div className='flex items-center justify-between'>
              <p className='font-bold md:text-2xl lg:text-4xl lg:ml-3'>ごい</p>
              <div className='flex'>
                <a href='/study/vocabulary/facil' className='underline md:text-[11px] text-[11px] lg:text-[14px]'>Ver mi vocabulario</a>
                <FaArrowRight className='ml-1' />
              </div>
            </div>
            <div className='lg:mt-8'>
              {
                Vocabulary.slice(0, vocabularyNum).map((item, index) => (
                  <div key={item.id}>
                    <VocabularyRow palabra={item.palabra} hiragana={item.hiragana} traduccion={item.traduccion} audio={item.audio} />
                    {
                      index < vocabularyNum - 1 &&
                      <div className='w-full mt-1.5 h-[1px] md:h-[1px] bg-main-grey'></div>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Study;
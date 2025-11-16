"use client";
import Head from 'next/head';
import { useParams } from 'next/navigation';
import ArticleData from "/data/cards.json"
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';
import ButtonPager from '@/components/buttons/ButtonPager';

function Test() {
  const params = useParams();
  const id = params.id;

  const data = ArticleData.find(item => item.id === Number(id))
  const [quizNum, setQuizNum] = useState(0)
  const quizData = data.quiz
  const total = quizData.length
  const currentQuiz = quizData[quizNum]
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >study</title>
        <meta name='description' content='私たちはグラン戸田住人' />
      </Head>
      <div className='flex-col'>
        <div className='text-center text-[30px]'>{data.title}</div>
        <div className='md:mt-10 bg-main-lightBlue w-[570px] md:w-[720px] lg:w-[1000px] content md:h-[60px] md:px-9 lg:px-6 shadow-large flex items-center justify-between'>
          <div>pregunta {quizNum + 1} / {total}</div>
          <div className="flex w-64">
            {Array.from({ length: total }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1
                  ${index <= quizNum ? "bg-main-blue" : "bg-main-mastard"}
                  ${index === 0 ? "rounded-l-lg" : ""}
                  ${index === total - 1 ? "rounded-r-lg" : ""}
                `}
              ></div>
            ))}
          </div>
          <div className='flex justify-between items-center' >
            <div>Dificultad media</div>
            <div className='flex justify-between md:ml-3 text-2xl lg:text-lg'>
              {Array.from({ length: 3 }).map((_, i) =>
                i < data.star ? (
                  <FaStar key={i} className="md:ml-1" />
                ) : (
                  <FaRegStar key={i} className="md:ml-1" />
                )
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Image
            src="/images/daruma_otoshi.png"
            alt="Hiroshima"
            width={350}
            height={150}
            className="object-cover" />
          <div className="text-[20px] mt-8">{currentQuiz.question}</div>
          <div className='flex flex-wrap w-full gap-4 mt-5'>
            {currentQuiz.choices.map((item, index) => {
              return (
                <ButtonPager key={index} className="basis-[calc(50%-0.5rem)] ">
                  <div className='text-center'>{item}</div>
                </ButtonPager>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
export default Test;
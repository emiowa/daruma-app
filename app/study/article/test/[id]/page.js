"use client";
import Head from 'next/head';
import { useParams } from 'next/navigation';
import ArticleData from "/data/cards.json"
import { FaRegStar, FaStar } from 'react-icons/fa';
import { HiArrowPath } from "react-icons/hi2";
import { useState } from 'react';
import Image from 'next/image';
import ButtonPager from '@/components/buttons/ButtonPager';
import { useRouter } from "next/navigation";

function Test() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const data = ArticleData.find(item => item.id === Number(id))
  const [quizNum, setQuizNum] = useState(0)
  const [result, setResult] = useState(false)
  const quizData = data.quiz
  const total = quizData.length
  const currentQuiz = quizData[quizNum]
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClickAnswer = (index) => {
    setSelectedIndex(index);
  }

  const handleClickNext = () => {
    if (quizNum === total - 1) {
      setResult(true)
    } else {
      setQuizNum(prev => prev + 1)
      setSelectedIndex(null)
    }
  }

  const goToArticle = () => {
    router.push(`/study/article/${id}`);
  };

  const goToTest = () => {
    setQuizNum(0)
    setResult(false)
    setSelectedIndex(null)
  };

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
          {result ?
            // --------------------------------------Result-----------------------------------------
            <div className='w-full flex flex-col justify-center items-center'>
              <div className='md:mt-10 bg-main-lightBlue w-[200px] md:w-[400px] lg:w-[1000px] content md:h-[180px] md:p-6 shadow-large flex flex-col items-center justify-center '>
                <div className='text-[23px]'>Resultados</div>
                <div className='mt-4 w-[250px]'>
                  <div className='flex justify-between'>
                    <div>Respuestas correctas:</div>
                    <div>2</div>
                  </div>
                  <div className='flex justify-between mt-2'>
                    <div>Respuestas incorrectas:</div>
                    <div>5</div>
                  </div>
                </div>
              </div>
              <div className='flex w-full mt-8 justify-end'>
                <ButtonPager className="flex" onClick={() => { goToTest() }}>
                  <div className='flex justify-center items-center' >
                    <div className='mr-4'>
                      <HiArrowPath />
                    </div>
                    <div>Volver a intentar</div>
                  </div>
                </ButtonPager>
                <ButtonPager className="flex ml-6" onClick={() => goToArticle()}>
                  <div className='mr-4'>Finalizar</div>
                  <div className='text-center'>→</div>
                </ButtonPager>
              </div >
            </div>
            :
            // ---------------------------------------Quiz-------------------------------------------
            <div className='flex flex-col items-center w-full'>
              <div className="text-[20px] mt-8">{currentQuiz.question}</div>
              <div className='flex flex-wrap w-full gap-4 mt-5'>
                {currentQuiz.choices.map((item, index) => {
                  return (
                    <ButtonPager
                      key={index}
                      className={
                        `basis-[calc(50%-0.5rem)] ` +
                        (selectedIndex === index
                          ? index === currentQuiz.correct
                            ? "bg-green-400"
                            : "bg-red-400"
                          : "bg-white")
                      }
                      onClick={() => handleClickAnswer(index)}
                    >
                      <div className='text-center'>{item}</div>
                    </ButtonPager>
                  )
                })}
              </div>
              {/* _________________________________page button___________________________________ */}
              <div className='flex w-full mt-8 justify-between'>
                <ButtonPager className="flex">
                  <div className='flex' >
                    <div className='mr-4'>←</div>
                    <div>Anterior</div>
                  </div>
                </ButtonPager>
                <ButtonPager className="flex" onClick={() => { handleClickNext() }}>
                  <div className='mr-4'>Siguente</div>
                  <div className='text-center'>→</div>
                </ButtonPager>
              </div >
            </div>
          }
        </div>
      </div >
    </>
  )
}
export default Test;
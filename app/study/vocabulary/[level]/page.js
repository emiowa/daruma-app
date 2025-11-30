"use client"

import Head from 'next/head';
import { useParams } from "next/navigation";
import vocabulary from "/data/vocabulary.json"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import ButtonAudioPlay from '@/components/buttons/ButtonAudioPlay';

function Vocabulary() {
  const params = useParams();
  const level = params.level;
  const router = useRouter();
  const vocabList = vocabulary.filter(item => item.level === level)
  const [isTransferPopup, setIsTransferPopup] = useState(null)

  const levels = [
    { "level": "facil", "color": "bg-main-yellow" },
    { "level": "normal", "color": "bg-main-orange" },
    { "level": "dificil", "color": "bg-main-lightBlue" },
    { "level": "archivadas", "color": "bg-main-purple" }
  ]

  const idPage = levels.find(obj => obj.level === level)

  const levelButton = levels.filter((levelObj) => level !== levelObj.level);

  if (!level) return <p>Loading...</p>;

  const goToFlashCard = () => {
    router.push(`/study/vocabulary/${level}/flashCard`);
  };

  const handleClicktransfer = (item) => {
    setIsTransferPopup(item)
  }

  const handleClickLevel = (item) => {
    setIsTransferPopup(false)
  }
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsTransferPopup(false)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Popup = () => {
    return (
      <div className='w-[330px] h-14 px-5 absolute flex justify-between items-center bg-main-background border border-black -right-8 top-0 rounded-lg' ref={ref}>
        {levels
          .filter(item => item.level !== isTransferPopup.level)
          .map((item) => (
            <div
              key={item.level}
              className={`w-[85px] h-10 rounded-lg border flex justify-center items-center border-black ${item.color}`}
              onClick={() => handleClickLevel(item.level)}
            >
              {item.level}
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title >Vocabulary</title>
        <meta name='description' content='記事' />
      </Head>
      <div className='relative'>
        <div className='w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3'>
          <div>ご</div>
          <div>い</div>
        </div>
        <div className='flex md:mt-10'>
          {levels.map((level, index) => (
            <Link href={`/study/vocabulary/${level.level}`} className={`${level.color}  w-24 text-center py-2 rounded ml-2 border border-black -mb-1 relative z-0 ${index === levels.length - 1 ? "ml-auto" : ""}`} key={level.level}>{level.level}</Link>
          ))}
        </div>
        <div className={`${idPage.color} z-1 w-[570px] md:w-[720px] relative lg:w-[1000px] content md:pt-14 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large`}>
          <button className='absolute bg-main-background w-32 h-8 top-4 right-16 shadow-small border border-black rounded text-sm' onClick={goToFlashCard}>Flash Card →</button>
          <div className='flex flex-wrap gap-3 mt-3 lg:mt-12 justify-center '>
            <div className='mt-3'>
              {vocabList.map((item) => (
                <div key={item.hiragana} className='flex items-center w-[600px] bg-main-white py-3 px-10  border-b border-main-grey justify-between mx-2  lg:mx-4'>
                  <div className='flex-col text-[18px] w-44 lg:text-[15px]'>
                    <p>{item.palabra}</p>
                    <p>{item.hiragana}</p>
                    <p>{item.traduccion}</p>
                  </div>
                  <div className='flex w-40 justify-between'>
                    <ButtonAudioPlay audio={item.audio} className={"w-12 h-12"} />
                    <div className='relative'>
                      <div
                        className='flex justify-center items-center w-12 h-12 rounded-full border-main-grey border border-solid relative shadow-small'
                        onClick={() => { handleClicktransfer(item) }}
                      >→
                      </div>

                      {item === isTransferPopup &&
                        <Popup />
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Vocabulary;
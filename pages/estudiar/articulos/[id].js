

import Head from 'next/head';
import { useRouter } from 'next/router';
import ArticuloData from "/data/cards.json"
import { FaRegStar, FaStar } from 'react-icons/fa';
import { RubyText } from "@/lib/renderRuby"
import BotonSwichDisplay from '@/components/botones/BotonSwichDisplay';
import { useState } from 'react';

function ArticuloIndividual() {
  const router = useRouter()
  const { id } = router.query
  const data = ArticuloData.find(item => item.id === Number(id))
  const [displayFurigana, setDisplayFrigana] = useState(false)
  const [isJapones, setIsJapones] = useState(true)
  const handleTraduccion = () => {
    setIsJapones(prev => !prev)
  }
  const handleDisplayFurigana = () => {
    if (isJapones) setDisplayFrigana(prev => !prev);
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >articulo_individual</title>
        <meta name='description' content='記事' />
      </Head>
      <div>
        <div className='w-full md:mt-20 text-main-grey font-bold md:text-3xl lg:text-7xl text-center'>{data.title}</div>
        <div className='md:mt-10 bg-main-blue w-[570px] md:w-[720px] lg:w-[1000px] content md:h-[60px] md:px-9 lg:px-6 shadow-large flex justify-between'>
          <div className='flex justify-between items-center ' >
            <div>Tema</div>
            <div className={`${data.label.bg} md:text-[15px] lg:text-[12px] md:px-3 lg:px-3 md:ml-5 rounded`}>{data.label.text}</div>
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
        <div className='flex justify-center md:min-h-[450px] '>
          <RubyText
            displayFurigana={displayFurigana}
            isJapones={isJapones} parts={data.textRuby}
            spanishText={data.spanishText}
            className={"md:px-36 md:py-10 text-[16px] font-bold mt-2 lg:mt-6 lg:text-[16px] "} />
        </div>
        <div className='flex'>
          <BotonSwichDisplay booleanItem={isJapones} func={handleTraduccion} className={"bg-main-purple md:w-40 md:ml-3"} defaultText={"Traducción a español"} changedText={"Ver original text"} />
          <BotonSwichDisplay booleanItem={displayFurigana} func={handleDisplayFurigana} className={"bg-main-purple md:w-40 md:ml-3"} defaultText={"Sacar furigana"} changedText={"Mostrar furigana"} />
        </div>
      </div>
    </>
  )
}
export default ArticuloIndividual;
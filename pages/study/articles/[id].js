

import Head from 'next/head';
import { useRouter } from 'next/router';
import ArticleData from "/data/cards.json"
import { FaRegStar, FaStar } from 'react-icons/fa';
import { RubyText } from "@/lib/renderRuby"
import ButtonSwichDisplay from '@/components/buttons/ButtonSwichDisplay';
import { useState } from 'react';
import vocabData from '@/data/Vocabulario.json'
import ButtonPager from '@/components/buttons/ButtonPager';

function IndividualArticle() {
  const router = useRouter()
  const { id } = router.query

  const [displayFurigana, setDisplayFrigana] = useState(false)
  const [isJapanese, setIsJapanese] = useState(true)

  const data = ArticleData.find(item => item.id === Number(id))
  const vocabAry = data.Vocabulario
  const vocabList = vocabData.filter((vocab) => vocabAry.includes(vocab.id))
  console.log(vocabList)

  const handleTraduccion = () => {
    setIsJapanese(prev => !prev)
  }

  const handleDisplayFurigana = () => {
    if (isJapanese) setDisplayFrigana(prev => !prev);
  }

  if (!id) return <p>Loading...</p>;
  if (!data) return <p>記事が見つかりません</p>;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >article_individual</title>
        <meta name='description' content='記事' />
      </Head>
      <div>
        <div className='w-full md:mt-20 text-main-grey font-bold md:text-3xl lg:text-7xl text-center'>{data.title}</div>
        <div className='md:mt-10 bg-main-lightBlue w-[570px] md:w-[720px] lg:w-[1000px] content md:h-[60px] md:px-9 lg:px-6 shadow-large flex justify-between'>
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
        <div className='flex justify-center md:min-h-[450px]'>
          <RubyText
            displayFurigana={displayFurigana}
            isJapanese={isJapanese} parts={data.paragraph}
            spanishText={data.spanishText}
            className={"md:px-36 md:py-10 text-[16px] font-bold mt-2 lg:mt-6 lg:text-[16px] "} />
        </div>
        <div className='flex justify-between md:p-3'>
          <div className='flex'>
            <ButtonSwichDisplay booleanItem={isJapanese} func={handleTraduccion} className={"bg-main-lightBlue md:w-40"} defaultText={"Traducción a español"} changedText={"Ver original text"} />
            <ButtonSwichDisplay booleanItem={displayFurigana} func={handleDisplayFurigana} className={"bg-main-lightBlue md:w-40 md:ml-3"} changedText={"Sacar furigana"} defaultText={"Mostrar furigana"} />
          </div>
          <ButtonPager>
            <div className='flex'>
              <div>Tomar el test</div>
              <div className='ml-3'>→</div>
            </div>
          </ButtonPager>
        </div>
        <div className='md:mt-10 relative flex bg-main-lightBlue w-[570px] md:p-9  md:w-[720px] lg:w-[1000px] content md:px-9 lg:px-6 shadow-large'>
          <div className='absolute top-4 left-4'>Vocabulario:</div>
          <div className='ml-16 flex flex-wrap [&>*:nth-child(-n+2)]:mt-0'>
            {vocabList.map((item) =>
              <div className={`ml-5 mt-5 w-[250px] flex items-center justify-between shadow-large rounded h-[75px] px-5 py-3 text-[18px] ${item.isAdded ? "bg-main-purple" : "bg-main-white"}`}>
                <div className=''>
                  <div className=' '>{item.palabra}</div>
                  <div className=' '>{item.traduccion}</div>
                </div>
                <button className='w-[30px] h-[30px] rounded-full border'>{item.isAdded ? "+" : "-"}</button>
              </div>
            )}
          </div>
        </div>
      </div >
    </>
  )
}
export default IndividualArticle;


import Head from 'next/head';
import { useRouter } from 'next/router';
import vocabulary from "/data/vocabulary.json"
import { AiOutlineSound } from 'react-icons/ai';
import { useRef } from 'react';
import Link from 'next/link';

function Vocabulary() {
  const router = useRouter()
  const { id } = router.query
  console.log("id", id)
  console.log(vocabulary)
  const vocabList = vocabulary.filter(item => item.level === id)
  console.log(vocabList)

  const levels = [
    { "level": "facil", "color": "bg-main-pink" },
    { "level": "normal", "color": "bg-main-orange" },
    { "level": "dificil", "color": "bg-main-lightBlue" }
  ]
  const words = [
    { "text": "anadidas", "color": "bg-main-orange" },
    { "text": "archivadas", "color": "bg-main-lightBlue" }
  ]

  const idPage = levels.find(obj => obj.level === id)
    || words.find(obj => obj.text === id);

  console.log("idPage", idPage)
  const levelButton = levels.filter((levelObj) => id !== levelObj.level);

  if (!id) return <p>Loading...</p>;
  const audioRef = useRef(null);
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >Vocabulary</title>
        <meta name='description' content='記事' />
      </Head>
      <div>
        <div className='w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3'>
          <div>ご</div>
          <div>い</div>
        </div>
        <div className="flex justify-between md:mt-10">
          <div className='flex'>
            {levels.map((level) => (
              <Link href={`/study/vocabulary/${level.level}`} className={`${level.color}  w-24 text-center py-2 rounded ml-2 -mb-1 relative z-0`} key={level.level}>{level.level}</Link>
            ))}
          </div>
          <div className='flex'>
            {words.map((word) => (
              <Link href={`/study/vocabulary/${word.text}`} className={`${word.color} w-24 text-center py-2 rounded ml-2 -mb-1 relative z-0`} key={word.text}>{word.text}</Link>
            ))}
          </div>
        </div>
        <div className={`${idPage.color} z-10 w-[570px] md:w-[720px] relative lg:w-[1000px] content md:pt-14 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large`}>
          <div className='flex flex-wrap gap-3 mt-3 lg:mt-12 justify-center '>
            <div className='mt-3'>
              {vocabList.map((item) => (
                <div key={item.id} className='flex items-center w-[600px] bg-main-white py-3 px-7  border-b border-main-grey justify-between mx-2  lg:mx-4'>
                  <div className='flex-col text-[18px] w-44 lg:text-[15px]'>
                    <p>{item.palabra}</p>
                    <p>{item.hiragana}</p>
                    <p>{item.traduccion}</p>
                  </div>
                  <button onClick={handlePlay} className='w-12 h-12 rounded-full border-main-grey border border-solid relative shadow-small'>
                    <AiOutlineSound className='text-xl text-main-grey absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
                  </button>
                  <audio ref={audioRef} src={item.audio} preload='auto' />
                  <div className='flex  w-64 justify-between'>
                    {levelButton.map((item, i) => (
                      <button key={i} className='bg-main-pink w-14 h-8 rounded'>{item.level}</button>
                    ))}
                    <div className='flex justify-center items-center bg-main-pink w-16  h-8 rounded'>-</div>
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
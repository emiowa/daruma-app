import { useRouter } from 'next/router';
import vocabulary from "/data/vocabulary.json"
import { useRef, useState } from 'react';
import { AiOutlineSound } from 'react-icons/ai';
import { IoSwapVerticalSharp } from "react-icons/io5";


export default function FlashCardPage() {
  const router = useRouter();
  const { level } = router.query;
  const vocabList = vocabulary.filter(item => item.level === level)
  const [cards, setCards] = useState(() =>
    [...vocabList].sort(() => Math.random() - 0.5)
  );
  const showFurigana = () => [
    setDisplayFrigana(prev => !prev)
  ]
  const [displayFurigana, setDisplayFrigana] = useState(false)
  const [displayAnswer, setDisplayAnswer] = useState(false)
  const [japaneseAbove, setJapaniseAbove] = useState(true)

  const nextCard = () => {
    setCards((prev) => {
      setDisplayAnswer(false)
      const newCards = prev.slice(1);
      console.log("newCards", newCards)
      if (newCards.length === 0) {
        return [...vocabList].sort(() => Math.random() - 0.5);
      }
      return newCards;
    });
  };

  const openCard = () => setDisplayAnswer(true)

  const handleCardButton = () => {
    displayAnswer ? nextCard() : openCard()
  }


  const audioRef = useRef(null);
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const current = cards[0];
  if (!current) return <p>Loading...</p>;
  console.log("display", displayAnswer)
  const Japanese = (
    <div className=" flex flex-col justify-center text-[18px] w-44 lg:text-[15px] h-36">
      <p className='h-8'>{displayFurigana ? current.hiragana : ""}</p>
      <p className='text-[25px]'>{current.palabra}</p>
      <div className='flex justify-center mt-2'>
        <button onClick={handlePlay} className='w-8 h-8 rounded-full border-main-grey border border-solid relative shadow-small'>
          <AiOutlineSound className='text-xl text-main-grey absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
        </button>
        <audio ref={audioRef} src={current.audio} preload='auto' />
        <button className='w-8 h-8 ml-3 rounded-full border-main-grey border border-solid relative shadow-small' onClick={showFurigana}>あ</button>
      </div>
    </div>
  )

  const Spanish = (
    <div className='h-36 flex items-center'>
      <p className='text-[25px]  '>{current.traduccion}</p>
    </div>
  )

  const CardButton = (
    <button onClick={handleCardButton} className=' w-36 h-9 mt-8 bg-main-yellow shadow-small rounded border border-black'>{displayAnswer ? "Siguente pregunta" : "Ver la respuesta"}</button>
  )

  const changePosition = () => {
    setJapaniseAbove(prev => !prev)
  }

  return (
    <div className="mt-16">
      <div className={`bg-main-lightBlue z-10 w-[570px] md:w-[650px] relative lg:w-[1000px] content md:pt-14 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large`}>
        <div className='md:my-3 lg:mt-12 flex flex-col items-center '>
          <div key={current.id} className='flex flex-col text-center items-center w-[600px] rounded shadow-small bg-main-white py-5 px-7 border border-main-grey justify-between mx-2  lg:mx-4'>
            {japaneseAbove ? Japanese : Spanish}
            <div className='w-[550px] flex justify-around items-center'>
              <span className='w-56 h-[0.1px] bg-main-grey'></span>
              <IoSwapVerticalSharp onClick={changePosition} />
              <span className='w-56 h-[0.1px] bg-main-grey'></span>
            </div>
            <div className={!displayAnswer && "opacity-0"}>
              {japaneseAbove ? Spanish : Japanese}
            </div>
          </div>
          {CardButton}
        </div>
      </div>
    </div>
  );
}
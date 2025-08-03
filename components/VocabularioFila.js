

import Image from 'next/image';
import React, { useRef } from 'react';
import { AiOutlineSound } from "react-icons/ai";



const VocabularioFila = ({ palabra, hiragana, traduccion, audio }) => {

  const audioRef = useRef(null);
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <div className='mt-3'>
      <div className='flex items-center justify-between mx-2 lg:mx-4'>
        <div className='flex-col text-[10px] lg:text-[15px]'>
          <p>{palabra}</p>
          <p>{hiragana}</p>
          <p>{traduccion}</p>
        </div>
        <button onClick={handlePlay} className='w-8 h-8 rounded-full border-main-grey border border-solid  bg-main-orange relative shadow-small'>
          <AiOutlineSound className='text-main-background absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
        </button>
        <audio ref={audioRef} src={audio} preload='auto' />
      </div>
    </div>
  );
};
export default VocabularioFila;
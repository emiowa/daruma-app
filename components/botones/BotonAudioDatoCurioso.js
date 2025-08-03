
import React, { useRef } from 'react';
import { AiOutlineSound } from "react-icons/ai";



const BotonAudioDatoCurioso = ({ audio }) => {
  const audioRef = useRef(null);
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <>
      <div className='flex ml-3 cursor-pointer' onClick={() => handlePlay()}>
        <AiOutlineSound className='icons-s' />
        <p className='ml-1 underline'>
          Escuchar audio
        </p>
        <audio ref={audioRef} src={audio} preload='auto' />
      </div>
    </>
  );
};
export default BotonAudioDatoCurioso;
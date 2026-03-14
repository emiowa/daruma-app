
import React, { useRef } from 'react';
import { AiOutlineSound } from "react-icons/ai";


const ButtonAudioPlay = ({ audio, className }) => {
  const audioRef = useRef(null);
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  return (
    <>
      <button onClick={handlePlay} className={`${className} rounded-full border-main-grey border border-solid relative shadow-small`}>
        <AiOutlineSound className='text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
      </button>
      <audio ref={audioRef} src={audio} preload='auto' />
    </>
  );
};
export default ButtonAudioPlay;






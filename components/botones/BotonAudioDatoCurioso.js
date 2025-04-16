
import React from 'react';
import { AiOutlineSound } from "react-icons/ai";



const BotonAudioDatoCurioso = () => {
  return (
    <>
      <div className='flex ml-3'>
        <AiOutlineSound className='icons-s' />
        <p className='ml-1 underline'>
          Escuchar audio
        </p>
      </div>
    </>
  );
};
export default BotonAudioDatoCurioso;
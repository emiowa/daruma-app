
import React from 'react';
import { MdTranslate } from "react-icons/md";


const BotonAudioVocabulario = () => {
  return (
    <>
      <div className='flex'>
        <MdTranslate className='icons-s' />
        <p className='ml-1 underline'>Ver traducción al español</p>
      </div>
    </>
  );
};
export default BotonAudioVocabulario;
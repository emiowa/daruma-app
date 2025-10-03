
import React from 'react';
import { MdTranslate } from "react-icons/md";


const ButtonAudioVocabulary = ({ handleToggleLanguage }) => {
  return (
    <>
      <div className='flex cursor-pointer' onClick={() => handleToggleLanguage()}>
        <MdTranslate className='icons-s' />
        <p className='ml-1 underline'>Ver traducción al español</p>
      </div>
    </>
  );
};
export default ButtonAudioVocabulary;
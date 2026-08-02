
import React from 'react';
import { MdTranslate } from "react-icons/md";


const ButtonAudioVocabulary = ({ handleToggleLanguage, jp }) => {
  return (
    <div>
      <div className='flex cursor-pointer' onClick={() => handleToggleLanguage()}>
        <MdTranslate className='icons-s' />
        <p className='ml-1 underline'>Ver traducción al {jp ? "español" : "japones"}</p>
      </div>
    </div>
  );
};
export default ButtonAudioVocabulary;
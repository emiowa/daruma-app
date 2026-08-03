

import React from 'react';
import ButtonAudioPlay from './buttons/ButtonAudioPlay';

const VocabularyRow = ({ palabra, hiragana, traduccion, audio }) => {

  return (
    <div className='mt-3'>
      <div className='flex items-center justify-between mx-2 lg:mx-4'>
        <div className='flex-col text-[10px] lg:text-[15px]'>
          <p>{palabra}</p>
          <p>{hiragana}</p>
          <p>{traduccion}</p>
        </div>
        <ButtonAudioPlay audio={audio} className={"w-8 h-8 text-xl text-main-background bg-main-retroRed"} />
      </div>
    </div>
  );
};
export default VocabularyRow;
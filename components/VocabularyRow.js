

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
        {audio ? (
          <ButtonAudioPlay
            audio={audio}
            className={"w-8 h-8 text-xl text-main-background bg-main-orange"}
          />
        ) : (
          <div className="w-8 h-8" /> // 音声がない時のスペース確保
        )}
      </div>
    </div>
  );
};
export default VocabularyRow;
"use client";

import { useState, useEffect, useMemo } from 'react';
import { IoSwapVerticalSharp } from "react-icons/io5";
import { useParams, useRouter } from 'next/navigation';
import { HiArrowPath } from "react-icons/hi2";
import ButtonPager from "@/components/buttons/ButtonPager";
import ButtonAudioPlay from "@/components/buttons/ButtonAudioPlay";
import { useAuth } from "@/app/context/AuthContext";
import { useVocabulary } from "@/app/context/VocabularyContext";

export default function FlashCardPage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level;

  const { user, authLoading } = useAuth();
  // ⭕️ Context から取得
  const { allVocabs, loading: vocabLoading } = useVocabulary();

  const [cards, setCards] = useState([]);
  const [displayFurigana, setDisplayFrigana] = useState(false);
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [japaneseAbove, setJapaniseAbove] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // 該当レベルの単語一覧を抽出（メモ化）
  const levelVocabs = useMemo(() => {
    return allVocabs.filter(item => item.level === level);
  }, [allVocabs, level]);

  // 単語データが読み込まれたらカードをシャッフルしてセット
  useEffect(() => {
    if (levelVocabs.length > 0) {
      setCards([...levelVocabs].sort(() => Math.random() - 0.5));
      setIsFinished(false);
    }
  }, [levelVocabs]);

  const showFurigana = () => setDisplayFrigana(prev => !prev);

  // 次のカードへ進む
  const nextCard = () => {
    setDisplayAnswer(false);
    setDisplayFrigana(false);

    setCards((prev) => {
      const newCards = prev.slice(1);
      if (newCards.length === 0) {
        setIsFinished(true);
        return [];
      }
      return newCards;
    });
  };

  const openCard = () => setDisplayAnswer(true);

  const handleCardButton = () => {
    displayAnswer ? nextCard() : openCard();
  };

  const changePosition = () => {
    setJapaniseAbove(prev => !prev);
  };

  const handleBackToVocabulary = () => {
    router.push(`/study/vocabulary/${level}`);
  };

  // リトライ（もう1周シャッフル）
  const handleRetry = () => {
    setDisplayAnswer(false);
    setDisplayFrigana(false);
    setIsFinished(false);
    setCards([...levelVocabs].sort(() => Math.random() - 0.5));
  };

  // 認証チェック中またはデータ取得中
  if (authLoading || vocabLoading) {
    return <p className="text-center mt-20 text-gray-500">Cargando cartas...</p>;
  }

  // 単語が1つもない場合
  if (!isFinished && cards.length === 0 && levelVocabs.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="mb-8">No hay vocabulario en este nivel.</p>
        <ButtonPager className="bg-main-white" onClick={handleBackToVocabulary}>
          Regresar
        </ButtonPager>
      </div>
    );
  }

  const current = cards[0];

  const Japanese = current ? (
    <div className="flex flex-col justify-center text-[18px] w-44 lg:text-[15px] h-36">
      <p className='h-8 text-main-blue font-bold transition-all duration-200'>
        {displayFurigana ? current.hiragana : ""}
      </p>
      <p className='text-[30px] font-bold text-main-grey'>{current.palabra}</p>
      <div className='flex justify-center mt-3 items-center gap-3'>
        <ButtonAudioPlay
          audio={current.audio_url}
          className="w-9 h-9 text-xl shadow-small rounded-full transition-transform active:scale-95"
        />
        <button
          className={`w-9 h-9 rounded-full border font-bold relative shadow-small transition-all duration-150 active:scale-95 ${displayFurigana
              ? "bg-main-blue text-white border-main-blue"
              : "bg-white border-main-grey text-main-grey hover:bg-gray-50"
            }`}
          onClick={showFurigana}
        >
          あ
        </button>
      </div>
    </div>
  ) : null;

  const Spanish = current ? (
    <div className='h-36 flex items-center justify-center'>
      <p className='text-[28px] font-bold text-gray-700 font-sans'>{current.traduccion}</p>
    </div>
  ) : null;

  return (
    <div className="mt-10 flex flex-col items-center w-full max-w-[1000px] mx-auto px-2">
      <div className="bg-main-lightBlue z-10 w-full relative content py-12 px-4 md:px-8 shadow-large rounded-2xl border border-black">
        <div className='flex flex-col items-center'>

          {/* 終了画面 */}
          {isFinished ? (
            <div className='flex flex-col text-center items-center justify-center w-full max-w-[600px] rounded-2xl shadow-small bg-main-white py-10 px-8 border border-black mx-2 lg:mx-4 min-h-[400px] animate-in fade-in zoom-in-95 duration-200'>
              <div className='text-[50px] mb-3 animate-bounce duration-1000'>🎉</div>
              <h3 className='text-[26px] font-bold text-main-grey mb-3'>¡Has terminado la lista!</h3>
              <p className='text-gray-500 text-sm mb-8 font-medium'>¿Qué te gustaría hacer ahora?</p>

              <div className='flex flex-col sm:flex-row gap-4 w-full max-w-[340px]'>
                <button
                  className="flex-1 py-3 bg-main-yellow text-white border border-black rounded-full font-bold shadow-small hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                  onClick={handleRetry}
                >
                  <HiArrowPath size={18} className="animate-spin-slow" />
                  Otra ronda
                </button>
                <button
                  className="flex-1 py-3 bg-main-white text-main-grey border border-black rounded-full font-bold shadow-small hover:bg-gray-50 active:scale-95 transition-all text-sm"
                  onClick={handleBackToVocabulary}
                >
                  Regresar
                </button>
              </div>
            </div>
          ) : (
            /* プレイ中 */
            <>
              <div key={current?.id} className='flex flex-col text-center items-center w-full max-w-[600px] rounded-2xl shadow-small bg-main-white py-8 px-7 border border-black justify-between mx-2 lg:mx-4 min-h-[400px]'>
                {/* 上段 */}
                <div className="w-full flex justify-center items-center flex-1">
                  {japaneseAbove ? Japanese : Spanish}
                </div>

                {/* 中央仕切り */}
                <div className='w-full flex justify-around items-center my-4'>
                  <span className='w-[35%] h-[1px] bg-gray-200'></span>
                  <IoSwapVerticalSharp
                    onClick={changePosition}
                    className="text-2xl text-gray-400 cursor-pointer hover:text-main-blue transition-all duration-300 hover:scale-110 active:rotate-180"
                  />
                  <span className='w-[35%] h-[1px] bg-gray-200'></span>
                </div>

                {/* 下段（回答） */}
                <div className={`w-full flex justify-center items-center flex-1 transition-all duration-300 ${!displayAnswer
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100 animate-in fade-in slide-in-from-bottom-4 duration-300"
                  }`}>
                  {japaneseAbove ? Spanish : Japanese}
                </div>
              </div>

              {/* 回答・次へボタン */}
              <button
                onClick={handleCardButton}
                className={`w-52 h-12 mt-10 shadow-small rounded-full border border-black font-bold transition-all duration-150 hover-float active:scale-[0.97] active:shadow-none ${displayAnswer ? "bg-main-blue text-white" : "bg-main-yellow text-white"
                  }`}
              >
                {displayAnswer ? "Siguiente pregunta" : "Ver la respuesta"}
              </button>
            </>
          )}

        </div>
      </div>

      {!isFinished && (
        <ButtonPager className="flex mt-8 w-36 bg-main-white hover-float" onClick={handleBackToVocabulary}>
          <div className='text-center mr-2'>←</div>
          <div>Regresar</div>
        </ButtonPager>
      )}
    </div>
  );
}
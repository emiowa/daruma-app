"use client";

import { useState, useEffect } from 'react';
import { IoSwapVerticalSharp } from "react-icons/io5";
import { useParams, useRouter } from 'next/navigation';
import { HiArrowPath } from "react-icons/hi2"; // ⭕️ リトライ用のアイコンを追加
import ButtonPager from "@/components/buttons/ButtonPager";
import ButtonAudioPlay from "@/components/buttons/ButtonAudioPlay";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/AuthContext";

export default function FlashCardPage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level;

  const { user, authLoading } = useAuth();

  const [cards, setCards] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [displayFurigana, setDisplayFrigana] = useState(false);
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [japaneseAbove, setJapaniseAbove] = useState(true);
  const [loading, setLoading] = useState(true);

  // ⭕️ 追加：1周すべて終了したかどうかを管理するステート
  const [isFinished, setIsFinished] = useState(false);

  // Supabaseから該当レベルの単語を取得
  useEffect(() => {
    const fetchUserVocabs = async () => {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_vocabulary_progress')
        .select(`
          level,
          vocabularies (
            id,
            palabra,
            hiragana,
            traduccion,
            audio_url
          )
        `)
        .eq('user_id', user.id)
        .eq('level', level);

      if (error) {
        console.error(error);
      } else if (data) {
        const formattedCards = data.map(item => item.vocabularies).filter(Boolean);
        setVocabList(formattedCards);
        setCards([...formattedCards].sort(() => Math.random() - 0.5));
      }
      setLoading(false);
    };

    fetchUserVocabs();
  }, [level, user, authLoading]);

  const showFurigana = () => setDisplayFrigana(prev => !prev);

  // ⭕️ 修正：次のカードへ進む処理（終了判定を追加）
  const nextCard = () => {
    setDisplayAnswer(false);
    setDisplayFrigana(false);

    setCards((prev) => {
      const newCards = prev.slice(1);

      // 💡 もし次のカードがゼロ（＝すべてのカードを消化した）なら終了フラグを立てる
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

  // ⭕️ 追加：もう1周（リトライ）するための処理
  const handleRetry = () => {
    setDisplayAnswer(false);
    setDisplayFrigana(false);
    setIsFinished(false);
    // 元のリストから再度ランダムにシャッフルしてセット
    setCards([...vocabList].sort(() => Math.random() - 0.5));
  };

  if (authLoading || loading) return <p className="text-center mt-20 text-gray-500">Cargando cartas...</p>;

  // 単語がそもそも1つもない場合の初期表示
  if (!isFinished && cards.length === 0 && vocabList.length === 0) {
    return (
      <div className="mt-16 text-center">
        <p className="mb-8">No hay vocabulario en este nivel.</p>
        <ButtonPager className="bg-main-white" onClick={handleBackToVocabulary}>Regresar</ButtonPager>
      </div>
    );
  }

  const current = cards[0];

  const Japanese = current ? (
    <div className="flex flex-col justify-center text-[18px] w-44 lg:text-[15px] h-36">
      <p className='h-8 text-main-blue font-bold'>{displayFurigana ? current.hiragana : ""}</p>
      <p className='text-[30px] font-bold'>{current.palabra}</p>
      <div className='flex justify-center mt-2'>
        <ButtonAudioPlay audio={current.audio_url} className={"w-8 h-8 text-xl text-main-grey"} />
        <button
          className={`w-8 h-8 ml-3 rounded-full border border-solid relative shadow-small transition-colors ${displayFurigana ? "bg-main-blue text-white" : "bg-white border-main-grey"}`}
          onClick={showFurigana}
        >
          あ
        </button>
      </div>
    </div>
  ) : null;

  const Spanish = current ? (
    <div className='h-36 flex items-center justify-center'>
      <p className='text-[28px] font-bold text-gray-700'>{current.traduccion}</p>
    </div>
  ) : null;

  return (
    <div className="mt-16 flex flex-col items-center">
      <div className={`bg-main-lightBlue z-10 w-[570px] md:w-[650px] relative lg:w-[1000px] content md:pt-14 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large rounded-xl`}>
        <div className='md:my-3 lg:mt-12 flex flex-col items-center'>

          {/* ⭕️ 条件分岐：すべて終了したときの画面（1周したけどどうする？） */}
          {isFinished ? (
            <div className='flex flex-col text-center items-center justify-center w-full max-w-[600px] rounded-xl shadow-small bg-main-white py-8 px-7 border border-main-grey mx-2 lg:mx-4 min-h-[400px]'>
              <div className='text-[35px] mb-2'>🎉</div>
              <h3 className='text-[24px] font-bold text-main-grey mb-4'>¡Has terminado la lista!</h3>
              <p className='text-gray-500 text-sm mb-8'>¿Qué te gustaría hacer ahora?</p>

              <div className='flex flex-col sm:flex-row gap-4 w-full max-w-[320px]'>
                {/* もう一周する（もう一度並び替えて再スタート） */}
                <button
                  className="flex-1 py-3 bg-main-yellow border border-black rounded-full font-bold shadow-small active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm"
                  onClick={handleRetry}
                >
                  <HiArrowPath size={16} />
                  Otra ronda
                </button>
                {/* 前のページに戻る */}
                <button
                  className="flex-1 py-3 bg-main-white border border-black rounded-full font-bold shadow-small active:scale-95 transition-transform text-sm"
                  onClick={handleBackToVocabulary}
                >
                  Regresar
                </button>
              </div>
            </div>
          ) : (
            /* 💡 通常のフラッシュカード画面（プレイ中） */
            <>
              <div key={current?.id} className='flex flex-col text-center items-center w-full max-w-[600px] rounded-xl shadow-small bg-main-white py-8 px-7 border border-main-grey justify-between mx-2 lg:mx-4 min-h-[400px]'>

                {/* 上段 */}
                <div className="w-full flex justify-center items-center flex-1">
                  {japaneseAbove ? Japanese : Spanish}
                </div>

                {/* 中央の仕切り */}
                <div className='w-full flex justify-around items-center my-4'>
                  <span className='w-[40%] h-[1px] bg-gray-200'></span>
                  <IoSwapVerticalSharp
                    onClick={changePosition}
                    className="text-2xl cursor-pointer hover:text-main-blue transition-colors"
                  />
                  <span className='w-[40%] h-[1px] bg-gray-200'></span>
                </div>

                {/* 下段（答え） */}
                <div className={`w-full flex justify-center items-center flex-1 transition-opacity duration-300 ${!displayAnswer ? "opacity-0 invisible" : "opacity-100 visible"}`}>
                  {japaneseAbove ? Spanish : Japanese}
                </div>
              </div>

              <button
                onClick={handleCardButton}
                className={`w-48 h-12 mt-10 shadow-small rounded-full border border-black font-bold transition-transform active:scale-95 ${displayAnswer ? "bg-main-blue text-white" : "bg-main-yellow"}`}
              >
                {displayAnswer ? "Siguiente pregunta" : "Ver la respuesta"}
              </button>
            </>
          )}

        </div>
      </div>

      {/* 下部の常駐戻るボタン（終了画面のときは二重になるので非表示にします） */}
      {!isFinished && (
        <ButtonPager className="flex mt-8 w-36 bg-main-white hover-float" onClick={handleBackToVocabulary}>
          <div className='text-center mr-2'>←</div>
          <div>Regresar</div>
        </ButtonPager>
      )}
    </div>
  );
}
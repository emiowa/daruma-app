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

  // 1. 周すべて終了したかどうかを管理するステート
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

  // 次のカードへ進む処理（終了判定を追加）
  const nextCard = () => {
    setDisplayAnswer(false);
    setDisplayFrigana(false);

    setCards((prev) => {
      const newCards = prev.slice(1);

      // もし次のカードがゼロ（＝すべてのカードを消化した）なら終了フラグを立てる
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

  // もう1周（リトライ）するための処理
  const handleRetry = () => {
    setDisplayAnswer(false);
    setDisplayFrigana(false);
    setIsFinished(false);
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
      <p className='h-8 text-main-blue font-bold transition-all duration-200'>{displayFurigana ? current.hiragana : ""}</p>
      <p className='text-[30px] font-bold text-main-grey'>{current.palabra}</p>
      <div className='flex justify-center mt-3 items-center gap-3'>
        <ButtonAudioPlay audio={current.audio_url} className={"w-9 h-9 text-xl shadow-small rounded-full transition-transform active:scale-95"} />
        <button
          className={`w-9 h-9 rounded-full border font-bold relative shadow-small transition-all duration-150 active:scale-95 ${displayFurigana ? "bg-main-blue text-white border-main-blue" : "bg-white border-main-grey text-main-grey hover:bg-gray-50"}`}
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
    /* ⭕️ 変更：他のページと横幅を揃えるため、w-full max-w-[1000px] に修正 */
    <div className="mt-10 flex flex-col items-center w-full max-w-[1000px] mx-auto px-2">
      <div className={`bg-main-lightBlue z-10 w-full relative content py-12 px-4 md:px-8 shadow-large rounded-2xl border border-black`}>
        <div className='flex flex-col items-center'>

          {/* 条件分岐：すべて終了したときの画面（1周したけどどうする？） */}
          {isFinished ? (
            /* ⭕️ 変更：より達成感が伝わる、ふわっとズームして現れるアニメーションを適用 */
            <div className='flex flex-col text-center items-center justify-center w-full max-w-[600px] rounded-2xl shadow-small bg-main-white py-10 px-8 border border-black mx-2 lg:mx-4 min-h-[400px] animate-in fade-in zoom-in-95 duration-200'>
              <div className='text-[50px] mb-3 animate-bounce duration-1000'>🎉</div>
              <h3 className='text-[26px] font-bold text-main-grey mb-3'>¡Has terminado la lista!</h3>
              <p className='text-gray-500 text-sm mb-8 font-medium'>¿Qué te gustaría hacer ahora?</p>

              <div className='flex flex-col sm:flex-row gap-4 w-full max-w-[340px]'>
                {/* もう一周する（もう一度並び替えて再スタート） */}
                <button
                  className="flex-1 py-3 bg-main-yellow text-white border border-black rounded-full font-bold shadow-small hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                  onClick={handleRetry}
                >
                  <HiArrowPath size={18} className="animate-spin-slow" />
                  Otra ronda
                </button>
                {/* 前のページに戻る */}
                <button
                  className="flex-1 py-3 bg-main-white text-main-grey border border-black rounded-full font-bold shadow-small hover:bg-gray-50 active:scale-95 transition-all text-sm"
                  onClick={handleBackToVocabulary}
                >
                  Regresar
                </button>
              </div>
            </div>
          ) : (
            /* 💡 通常のフラッシュカード画面（プレイ中） */
            <>
              {/* ⭕️ 変更：カード自体をより立体的な角丸に変更 */}
              <div key={current?.id} className='flex flex-col text-center items-center w-full max-w-[600px] rounded-2xl shadow-small bg-main-white py-8 px-7 border border-black justify-between mx-2 lg:mx-4 min-h-[400px]'>

                {/* 上段 */}
                <div className="w-full flex justify-center items-center flex-1">
                  {japaneseAbove ? Japanese : Spanish}
                </div>

                {/* 中央の仕切り */}
                <div className='w-full flex justify-around items-center my-4'>
                  <span className='w-[35%] h-[1px] bg-gray-200'></span>
                  {/* ⭕️ 変更：クリックした時にカチッと回転する楽しいインタラクションを追加 */}
                  <IoSwapVerticalSharp
                    onClick={changePosition}
                    className="text-2xl text-gray-400 cursor-pointer hover:text-main-blue transition-all duration-300 hover:scale-110 active:rotate-180"
                  />
                  <span className='w-[35%] h-[1px] bg-gray-200'></span>
                </div>

                {/* 下段（答え） */}
                {/* ⭕️ 変更：不透明度だけでなく、下からふわっと浮き出てくる立体的なめくりアニメーションに変更 */}
                <div className={`w-full flex justify-center items-center flex-1 transition-all duration-300 ${!displayAnswer
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100 animate-in fade-in slide-in-from-bottom-4 duration-300"
                  }`}>
                  {japaneseAbove ? Spanish : Japanese}
                </div>
              </div>

              {/* クイズ回答・進行ボタン */}
              {/* ⭕️ 変更：ホバーした時に少し浮かび上がる hover-float を追加して操作感を向上 */}
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

      {/* 下部の常駐戻るボタン */}
      {!isFinished && (
        <ButtonPager className="flex mt-8 w-36 bg-main-white hover-float" onClick={handleBackToVocabulary}>
          <div className='text-center mr-2'>←</div>
          <div>Regresar</div>
        </ButtonPager>
      )}
    </div>
  );
}
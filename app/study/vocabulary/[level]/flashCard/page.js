"use client";

import { useState, useEffect } from 'react'; // useEffectを追加
import { IoSwapVerticalSharp } from "react-icons/io5";
import { useParams, useRouter } from 'next/navigation';
import ButtonPager from "@/components/buttons/ButtonPager";
import ButtonAudioPlay from "@/components/buttons/ButtonAudioPlay";
import { supabase } from "@/lib/supabase"; // 追加

export default function FlashCardPage() {
  const params = useParams();
  const router = useRouter();
  const level = params.level;

  const [cards, setCards] = useState([]);
  const [vocabList, setVocabList] = useState([]); // 元のリスト保持用
  const [displayFurigana, setDisplayFrigana] = useState(false);
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [japaneseAbove, setJapaniseAbove] = useState(true);
  const [loading, setLoading] = useState(true);

  // 1. Supabaseから該当レベルの単語を取得
  useEffect(() => {
    const fetchUserVocabs = async () => {
      // 1. 現在ログインしているユーザーを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. 紐付けテーブルから、このユーザーがこのレベルに設定したデータを取得
      // .select('*, vocabularies(*)') と書くと、紐付いた単語データも一緒に取れます
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
        // データの形を使いやすいように整形
        const formattedCards = data.map(item => item.vocabularies).filter(Boolean);
        setVocabList(formattedCards);
        setCards([...formattedCards].sort(() => Math.random() - 0.5));
      }
      setLoading(false);
    };

    fetchUserVocabs();
  }, [level]);

  const showFurigana = () => setDisplayFrigana(prev => !prev);

  const nextCard = () => {
    setCards((prev) => {
      setDisplayAnswer(false);
      setDisplayFrigana(false); // 次のカードではフリガナを一旦隠すのが一般的
      const newCards = prev.slice(1);
      // 全て終わったら再度シャッフルしてループ
      if (newCards.length === 0) {
        return [...vocabList].sort(() => Math.random() - 0.5);
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

  if (loading) return <p className="text-center mt-20 text-gray-500">Cargando cartas...</p>;

  const current = cards[0];

  // 単語がない場合の表示
  if (!current) {
    return (
      <div className="mt-16 text-center">
        <p className="mb-8">No hay vocabulario en este nivel.</p>
        <ButtonPager className="bg-main-white" onClick={handleBackToVocabulary}>Regresar</ButtonPager>
      </div>
    );
  }

  const Japanese = (
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
  );

  const Spanish = (
    <div className='h-36 flex items-center justify-center'>
      <p className='text-[28px] font-bold text-gray-700'>{current.traduccion}</p>
    </div>
  );

  return (
    <div className="mt-16 flex flex-col items-center">
      <div className={`bg-main-lightBlue z-10 w-[570px] md:w-[650px] relative lg:w-[1000px] content md:pt-14 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large rounded-xl`}>
        <div className='md:my-3 lg:mt-12 flex flex-col items-center'>
          <div key={current.id} className='flex flex-col text-center items-center w-full max-w-[600px] rounded-xl shadow-small bg-main-white py-8 px-7 border border-main-grey justify-between mx-2 lg:mx-4 min-h-[400px]'>

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
        </div>
      </div>

      <ButtonPager className="flex mt-8 w-36 bg-main-white" onClick={handleBackToVocabulary}>
        <div className='text-center mr-2'>←</div>
        <div>Regresar</div>
      </ButtonPager>
    </div>
  );
}
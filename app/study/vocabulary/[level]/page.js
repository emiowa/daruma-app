"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabase"; // 追加
import ButtonAudioPlay from '@/components/buttons/ButtonAudioPlay';

function Vocabulary() {
  const params = useParams();
  const level = params.level;
  const router = useRouter();

  const [allVocabs, setAllVocabs] = useState([]); // DBから全取得
  const [isTransferPopup, setIsTransferPopup] = useState(null);
  const [loading, setLoading] = useState(true);

  const levels = [
    { "level": "anadidas", "color": "bg-main-purple" }, // 追加
    { "level": "facil", "color": "bg-main-yellow" },
    { "level": "normal", "color": "bg-main-orange" },
    { "level": "dificil", "color": "bg-main-lightBlue" },
    { "level": "archivadas", "color": "bg-main-purple" }
  ];

  // 1. データをSupabaseから取得
  useEffect(() => {
    const fetchMyVocabs = async () => {
      setLoading(true);

      // 1. ログインユーザーを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 2. user_vocabulary_progress を起点に、単語情報を結合して取得
      // vocabularies!inner() とすることで、紐づく単語があるものだけを取得します
      const { data, error } = await supabase
        .from('user_vocabulary_progress')
        .select(`
          level,
          vocabularies!inner (
            id,
            palabra,
            hiragana,
            traduccion,
            audio_url
          )
        `)
        .eq('user_id', user.id)
        .eq('level', level); // URLのタブ（facil, anadidasなど）でフィルタリング

      if (error) {
        console.error('Error fetching filtered vocabs:', error);
      } else {
        // データの階層をフラットにしてステートに保存
        const formattedList = data.map(item => ({
          ...item.vocabularies,
          level: item.level
        }));
        setAllVocabs(formattedList);
      }
      setLoading(false);
    };

    fetchMyVocabs();
  }, [level]); // タブが切り替わるたびに実行

  // 暫定：今のDBにはlevelがないので、全部表示するか、
  // もしDBにlevelカラムを追加したならここでfilterします。
  const filteredVocabList = allVocabs;

  const idPage = levels.find(obj => obj.level === level) || levels[0];
  const ref = useRef(null);

  // ポップアップの外側クリック処理
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsTransferPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando vocabulario...</p>;

  const goToFlashCard = () => {
    router.push(`/study/vocabulary/${level}/flashCard`);
  };

  const handleClicktransfer = (item) => {
    setIsTransferPopup(item);
  };

  // レベルを移動させる処理（今はフロントエンドのステートのみ更新）
  const handleClickLevelChange = async (vId, targetLevel) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_vocabulary_progress')
      .update({ level: targetLevel })
      .eq('user_id', user.id)
      .eq('vocabulary_id', vId);

    if (error) {
      console.error('Error updating level:', error);
    } else {
      // ステート名に合わせて修正
      setAllVocabs(prev => prev.filter(item => item.id !== vId));
      setIsTransferPopup(null);
    }
  };

  const Popup = ({ currentItem }) => {
    return (
      <div className='w-[330px] h-14 px-5 absolute flex justify-between items-center bg-main-background border border-black -right-8 top-0 rounded-lg z-50' ref={ref}>
        {levels
          .filter(l => l.level !== level)
          .map((l) => (
            <div
              key={l.level}
              className={`w-[85px] h-10 rounded-lg border flex justify-center items-center border-black cursor-pointer text-xs ${l.color}`}
              // ここで currentItem.id を渡す
              onClick={() => handleClickLevelChange(currentItem.id, l.level)}
            >
              {l.level}
            </div>
          ))
        }
      </div>
    );
  };

  // ... 表示部分の修正（PopupにcurrentItemを渡す）
  { isTransferPopup && isTransferPopup.id === item.id && <Popup currentItem={item} /> }

  return (
    <div className='relative'>
      <div className='w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3'>
        <div>ご</div><div>い</div>
      </div>

      {/* タブメニュー */}
      <div className='flex md:mt-10'>
        {levels.map((l, index) => (
          <Link
            key={l.level}
            href={`/study/vocabulary/${l.level}`}
            className={`${l.color} w-24 text-center py-2 rounded ml-2 border border-black -mb-1 relative z-0 ${index === levels.length - 1 ? "ml-auto" : ""} ${level === l.level ? "font-bold border-b-0 pb-3" : "opacity-70"}`}
          >
            {l.level}
          </Link>
        ))}
      </div>

      {/* メインリストエリア */}
      <div className={`${idPage.color} z-1 w-[570px] md:w-[720px] relative lg:w-[1000px] content md:pt-14 lg:pt-20 md:pb-10 md:px-4 lg:px-6 shadow-large min-h-[500px]`}>
        <button className='absolute bg-main-background w-32 h-8 top-4 right-16 shadow-small border border-black rounded text-sm hover:bg-gray-100' onClick={goToFlashCard}>
          Flash Card →
        </button>

        <div className='flex flex-col items-center mt-10'>
          {filteredVocabList.map((item) => (
            <div key={item.id} className='flex items-center w-full max-w-[800px] bg-main-white py-4 px-10 border-b border-main-grey justify-between mb-1 shadow-sm'>
              <div className='flex flex-col w-44'>
                <p className='font-bold text-lg'>{item.palabra}</p>
                <p className='text-sm text-gray-600'>{item.hiragana}</p>
                <p className='text-sm italic'>{item.traduccion}</p>
              </div>

              <div className='flex w-40 justify-between items-center'>
                <ButtonAudioPlay audio={item.audio_url} className={"w-12 h-12"} />
                <div className='relative'>
                  <div
                    className='flex justify-center items-center w-12 h-12 rounded-full border-main-grey border border-solid shadow-small cursor-pointer hover:bg-gray-100'
                    onClick={() => handleClicktransfer(item)}
                  >
                    →
                  </div>
                  {isTransferPopup && isTransferPopup.id === item.id && <Popup />}
                </div>
              </div>
            </div>
          ))}
          {filteredVocabList.length === 0 && (
            <p className="mt-20 text-gray-500 italic">No hay palabras en este nivel.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vocabulary;
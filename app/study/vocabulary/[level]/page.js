"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";
import ButtonAudioPlay from '@/components/buttons/ButtonAudioPlay';
import { FaTrashCan } from "react-icons/fa6";
import { RiFileTransferLine } from "react-icons/ri";

let cachedVocabs = null;

function Vocabulary() {
  const params = useParams();
  const level = params.level;
  const router = useRouter();

  const [allVocabs, setAllVocabs] = useState(cachedVocabs || []);
  const [isTransferPopup, setIsTransferPopup] = useState(null);
  const [loading, setLoading] = useState(cachedVocabs === null);

  const levels = [
    { "level": "anadidas", "color": "bg-main-purple" },
    { "level": "facil", "color": "bg-main-yellow" },
    { "level": "normal", "color": "bg-main-orange" },
    { "level": "dificil", "color": "bg-main-lightBlue" },
    { "level": "archivadas", "color": "bg-gray-400" } // 右端に寄せるアーカイブ
  ];

  useEffect(() => {
    const initializeData = async () => {
      // ★ ここが重要！すでにキャッシュ（データ）があるなら、
      // データの再取得（上書き）を絶対にさせない。
      if (cachedVocabs !== null) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 掃除処理（初回のみ）
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      await supabase
        .from('user_vocabulary_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('level', 'archivadas')
        .lt('updated_at', fourteenDaysAgo.toISOString());

      // 全データ取得
      const { data, error } = await supabase
        .from('user_vocabulary_progress')
        .select(`
          level,
          vocabularies!inner (id, palabra, hiragana, traduccion, audio_url)
        `)
        .eq('user_id', user.id);

      if (!error && data) {
        const formattedList = data.map(item => ({
          ...item.vocabularies,
          level: item.level
        }));
        setAllVocabs(formattedList);
        cachedVocabs = formattedList;
      }
      setLoading(false);
    };

    initializeData();
  }, []); // 依存配列は空のまま

  const filteredVocabList = allVocabs.filter(item => item.level === level);
  const idPage = levels.find(obj => obj.level === level) || levels[0];
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsTransferPopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToFlashCard = () => {
    router.push(`/study/vocabulary/${level}/flashCard`);
  };

  const handleClicktransfer = (item) => {
    setIsTransferPopup(item);
  };

  const handleClickLevelChange = async (vId, targetLevel) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedList = allVocabs.map(item =>
      item.id === vId ? { ...item, level: targetLevel } : item
    );
    setAllVocabs(updatedList);
    cachedVocabs = updatedList;
    setIsTransferPopup(null);

    await supabase
      .from('user_vocabulary_progress')
      .update({ level: targetLevel })
      .eq('user_id', user.id)
      .eq('vocabulary_id', vId);
  };

  const Popup = ({ currentItem }) => {
    return (
      <div className='w-[330px] h-14 px-5 absolute flex justify-between items-center bg-main-background border border-black -right-8 top-0 rounded-lg z-50' ref={ref}>
        {levels
          .filter(l =>
            l.level !== level &&
            l.level !== "archivadas"
          )
          .map((l) => (
            <div
              key={l.level}
              className={`w-[85px] h-10 rounded-lg border flex justify-center items-center border-black cursor-pointer text-xs ${l.color}`}
              onClick={() => handleClickLevelChange(currentItem.id, l.level)}
            >
              {l.level}
            </div>
          ))
        }
      </div >
    );
  };

  return (
    <div className='relative'>
      <div className='w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3'>
        <div>ご</div><div>い</div>
      </div>

      {/* タブメニュー */}
      <div className='flex md:mt-10 items-end'>
        {levels.map((l, index) => (
          <Link
            key={l.level}
            href={`/study/vocabulary/${l.level}`}
            prefetch={true}
            className={`
              ${l.color} border border-black -mb-1 relative z-0 flex justify-center items-center
              ${index === levels.length - 1 ? "ml-auto w-16 h-10 rounded-t-lg" : "w-24 py-2 rounded-t ml-2"}
              ${level === l.level ? "font-bold border-b-0 pb-3 h-12" : "opacity-70"}
            `}
          >
            {l.level === "archivadas" ? <FaTrashCan size={18} /> : l.level}
          </Link>
        ))}
      </div>

      {/* メインエリア */}
      <div className={`${idPage.color} z-1 w-[570px] md:w-[720px] relative lg:w-[1000px] content md:pt-14 lg:pt-20 md:pb-10 md:px-4 lg:px-6 shadow-large min-h-[500px] rounded-b-lg`}>
        <button className='absolute bg-main-background w-32 h-8 top-4 right-16 shadow-small border border-black rounded text-sm hover:bg-gray-100' onClick={goToFlashCard}>
          Flash Card →
        </button>

        <div className='flex flex-col items-center mt-10'>
          {loading && allVocabs.length === 0 ? (
            <div className="flex flex-col items-center mt-20">
              <div className="animate-spin h-8 w-8 border-4 border-main-grey border-t-transparent rounded-full mb-4"></div>
              <p className="text-main-grey italic">Cargando vocabulario...</p>
            </div>
          ) : (
            <>
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
                        <RiFileTransferLine size={20} />
                      </div>
                      {isTransferPopup && isTransferPopup.id === item.id && <Popup currentItem={item} />}
                    </div>

                    <div
                      className='flex justify-center items-center w-12 h-12 rounded-full border-main-grey border border-solid shadow-small cursor-pointer hover:bg-red-50 text-red-500'
                      onClick={() => handleClickLevelChange(item.id, 'archivadas')}
                    >
                      <FaTrashCan size={18} />
                    </div>
                  </div>
                </div>
              ))}
              {filteredVocabList.length === 0 && (
                <p className="mt-20 text-gray-500 italic">No hay palabras en este nivel.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vocabulary;
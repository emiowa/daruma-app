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
  // ★ ユーザーのログイン状態を保持するステート
  const [user, setUser] = useState(null);

  const levels = [
    { "level": "anadidas", "color": "bg-main-purple" },
    { "level": "facil", "color": "bg-main-yellow" },
    { "level": "normal", "color": "bg-main-orange" },
    { "level": "dificil", "color": "bg-main-lightBlue" },
    { "level": "archivadas", "color": "bg-gray-400" }
  ];

  useEffect(() => {
    const initializeData = async () => {
      // ユーザー情報の取得を最初に行う
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(authUser);

      // キャッシュがある場合は再取得しない
      if (cachedVocabs !== null) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const now = new Date().toISOString();

      // 1. 2週間以上経過したアーカイブの掃除
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      await supabase
        .from('user_vocabulary_progress')
        .delete()
        .eq('user_id', authUser.id)
        .eq('level', 'archivadas')
        .lt('updated_at', fourteenDaysAgo.toISOString());

      // 2. 公開済みの単語のみ、ユーザーの進捗を取得
      const { data, error } = await supabase
        .from('user_vocabulary_progress')
        .select(`
          level,
          vocabularies!inner (
            id,
            palabra,
            hiragana,
            traduccion,
            audio_url,
            published_at
          )
        `)
        .eq('user_id', authUser.id)
        .lte('vocabularies.published_at', now);

      if (!error && data) {
        const formattedList = data.map(item => ({
          ...item.vocabularies,
          level: item.level
        }));
        setAllVocabs(formattedList);
        cachedVocabs = formattedList;
      } else if (error) {
        console.error("Error fetching vocabs:", error.message);
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  const filteredVocabList = allVocabs.filter(item => item.level === level);
  const idPage = levels.find(obj => obj.level === level) || levels[0];
  const ref = useRef(null);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const handleClickDelete = async (vId) => {
    if (!user) return;

    const updatedList = allVocabs.filter(item => item.id !== vId);
    setAllVocabs(updatedList);
    cachedVocabs = updatedList;
    setItemToDelete(null);

    await supabase
      .from('user_vocabulary_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('vocabulary_id', vId);
  };

  const Popup = ({ currentItem }) => {
    return (
      <div className='w-[250px] h-24 px-5 absolute flex justify-between items-center bg-main-background border border-black -right-16 -top-6 rounded-lg z-50' ref={ref}>
        {levels
          .filter(l =>
            l.level !== level &&
            l.level !== "archivadas"
          )
          .map((l) => (
            <div
              key={l.level}
              className={`w-14 h-14 rounded-full border flex justify-center items-center border-black cursor-pointer text-xs ${l.color}`}
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

        {loading ? (
          // 1. ローディング表示
          <div className="flex flex-col items-center mt-20">
            <div className="animate-spin h-8 w-8 border-4 border-main-grey border-t-transparent rounded-full mb-4"></div>
            <p className="text-main-grey italic">Cargando vocabulario...</p>
          </div>
        ) : !user ? (
          // 2. 未ログイン時の表示
          <div className="flex flex-col items-center justify-center mt-20 px-10 text-center">
            <div className="bg-white/30 p-8 rounded-2xl border border-black/10 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4 text-main-grey">¡Bienvenido!</h2>
              <p className="text-main-grey mb-8 leading-relaxed">
                Inicia sesión para guardar palabras en tu lista personal y hacer un seguimiento de tu progreso.
              </p>
              <Link
                href="/auth/login"
                className="inline-block bg-main-white border border-black px-10 py-3 rounded-full shadow-small hover:bg-gray-100 active:translate-y-0.5 active:shadow-none transition-all font-bold"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        ) : (
          // 3. ログイン済みの表示
          <>
            {level === 'archivadas' && (
              <div className="absolute top-16 left-10 text-main-grey text-s italic bg-white/50 px-3 py-1 rounded-full border border-black/10">
                Las palabras en esta lista se eliminarán automáticamente después de 2 semanas.
              </div>
            )}

            <button className='absolute bg-main-background w-32 h-8 top-4 right-16 shadow-small border border-black rounded text-sm hover:bg-gray-100' onClick={goToFlashCard}>
              Flash Card →
            </button>

            <div className='flex flex-col items-center mt-14'>
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
                      className={`flex justify-center items-center w-12 h-12 rounded-full border border-main-grey shadow-small cursor-pointer hover:bg-red-50 ${item.level === "archivadas" && "text-red-600"}`}
                      onClick={() => {
                        if (level === 'archivadas') {
                          setItemToDelete(item);
                        } else {
                          handleClickLevelChange(item.id, 'archivadas');
                        }
                      }}
                    >
                      <FaTrashCan size={16} />
                    </div>
                  </div>
                </div>
              ))}
              {filteredVocabList.length === 0 && (
                <p className="mt-20 text-gray-500 italic">No hay palabras en este nivel.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* 削除確認ポップアップ */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-black max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-2 text-center text-red-600">
              ¿Eliminar permanentemente?
            </h3>
            <p className="text-gray-600 text-sm mb-6 text-center leading-relaxed">
              Se eliminará <strong>「{itemToDelete.palabra}」</strong> de tu lista. Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                className="flex-1 py-3 border border-black rounded-xl font-bold hover:bg-gray-100 transition-colors"
                onClick={() => setItemToDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="flex-1 py-3 bg-red-500 text-white border border-black rounded-xl font-bold hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                onClick={() => handleClickDelete(itemToDelete.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vocabulary;
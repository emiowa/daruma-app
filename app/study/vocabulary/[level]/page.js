"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";
import ButtonAudioPlay from '@/components/buttons/ButtonAudioPlay';
import { FaTrashCan } from "react-icons/fa6";
import { RiFileTransferLine } from "react-icons/ri";
// ⭕️ 共通の認証状態（Context）を呼び出す
import { useAuth } from "@/app/context/AuthContext";

let cachedVocabs = null;

function Vocabulary() {
  const params = useParams();
  const level = params.level;
  const router = useRouter();

  // アプリ共通の認証情報を最上部で常にキャッチする
  const { user, authLoading } = useAuth();

  const [allVocabs, setAllVocabs] = useState(cachedVocabs || []);
  const [isTransferPopup, setIsTransferPopup] = useState(null);

  // 認証自体のチェックは authLoading に任せるため、こちらは純粋にデータ取得のローディングとして扱います
  const [loading, setLoading] = useState(cachedVocabs === null);

  // 現在通信処理中（レベル変更や削除）の単語のIDを保持する（nullの時は何も処理していない）
  const [processingId, setProcessingId] = useState(null);

  const levels = [
    { "level": "anadidas", "color": "bg-main-purple" },
    { "level": "facil", "color": "bg-main-yellow" },
    { "level": "normal", "color": "bg-main-orange" },
    { "level": "dificil", "color": "bg-main-lightBlue" },
    { "level": "archivadas", "color": "bg-gray-400" }
  ];

  useEffect(() => {
    const initializeData = async () => {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }
      if (cachedVocabs !== null) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const now = new Date().toISOString();

      try {
        // 1. 2週間以上経過したアーカイブの掃除
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        await supabase
          .from('user_vocabulary_progress')
          .delete()
          .eq('user_id', user.id)
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
          .eq('user_id', user.id)
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
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [user, authLoading]);

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
    if (processingId !== null) return;
    router.push(`/study/vocabulary/${level}/flashCard`);
  };

  const handleClicktransfer = (item) => {
    if (processingId !== null) return;
    setIsTransferPopup(item);
  };

  const handleClickLevelChange = async (vId, targetLevel) => {
    if (!user || processingId !== null) return;
    setProcessingId(vId);

    const updatedList = allVocabs.map(item =>
      item.id === vId ? { ...item, level: targetLevel } : item
    );
    setAllVocabs(updatedList);
    cachedVocabs = updatedList;
    setIsTransferPopup(null);

    try {
      await supabase
        .from('user_vocabulary_progress')
        .update({ level: targetLevel })
        .eq('user_id', user.id)
        .eq('vocabulary_id', vId);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
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

  // ⭕️ ポップアップのデザイン改良（ふわっと出現するアニメーションを追加）
  const Popup = ({ currentItem }) => {
    return (
      <div
        className='w-[240px] h-20 px-4 absolute flex justify-between items-center bg-main-background border border-black -right-4 -top-24 rounded-xl z-50 shadow-large animate-in fade-in zoom-in-95 duration-150'
        ref={ref}
      >
        {levels
          .filter(l => l.level !== level && l.level !== "archivadas")
          .map((l) => (
            <div
              key={l.level}
              className={`w-11 h-11 rounded-full border flex justify-center items-center border-black cursor-pointer text-[10px] font-bold shadow-small uppercase tracking-wider transition-all duration-150 active:scale-95 hover:brightness-105 ${l.color}`}
              onClick={() => handleClickLevelChange(currentItem.id, l.level)}
            >
              {l.level.substring(0, 3)} {/* 💡 文字数がはみ出ないように3文字にトリミング */}
            </div>
          ))
        }
      </div >
    );
  };

  return (
    /* ⭕️ 横幅を1000px最大にコントロールするコンテナに変更 */
    <div className='relative w-full max-w-[1000px] mx-auto'>
      {processingId !== null && (
        <div className="fixed inset-0 z-[100] cursor-not-allowed bg-transparent" />
      )}

      <div className='w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3 pl-2'>
        <div>ご</div><div>い</div>
      </div>

      {/* タブメニュー */}
      <div className='flex md:mt-10 items-end px-2'>
        {levels.map((l, index) => (
          <Link
            key={l.level}
            href={`/study/vocabulary/${l.level}`}
            prefetch={true}
            className={`
              ${l.color} border border-black -mb-1 relative z-0 flex justify-center items-center transition-all duration-200 rounded-t-lg
              ${index === levels.length - 1 ? "ml-auto w-16 h-10" : "w-24 py-2 ml-1 md:ml-2"}
              ${level === l.level ? "font-bold border-b-0 pb-3 h-12 z-10" : "opacity-70 hover:opacity-90 hover:pb-2"}
              ${processingId !== null ? "pointer-events-none" : ""} 
            `}
          >
            {l.level === "archivadas" ? <FaTrashCan size={18} /> : l.level}
          </Link>
        ))}
      </div>

      {/* メインエリア：w-full max-w-[1000px] で他のページとラインを統一 */}
      <div className={`${idPage.color} z-1 w-full relative content pt-14 md:pt-16 lg:pt-20 pb-10 px-4 md:px-8 lg:px-12 shadow-large min-h-[500px] rounded-b-xl border border-t-0 border-black`}>

        {authLoading || loading ? (
          <div className="flex flex-col items-center mt-20">
            <div className="animate-spin h-8 w-8 border-4 border-main-grey border-t-transparent rounded-full mb-4"></div>
            <p className="text-main-grey italic">Cargando vocabulario...</p>
          </div>
        ) : (
          <>
            {!user ? (
              <div className="flex flex-col items-center justify-center mt-20 px-10 text-center">
                <div className="bg-white/30 p-8 rounded-2xl border border-black/10 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-4 text-main-grey">¡Bienvenido!</h2>
                  <p className="text-main-grey mb-8 leading-relaxed">
                    Inicia sesión para guardar palabras en tu lista personal y hacer un seguimiento avancer de tu progreso.
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
              <>
                {level === 'archivadas' && (
                  <div className="absolute top-5 left-6 md:left-8 text-main-grey text-xs italic bg-white/60 px-4 py-1.5 rounded-full border border-black/10 shadow-sm">
                    🗑️ Las palabras en esta lista se eliminarán automáticamente después de 2 semanas.
                  </div>
                )}

                {filteredVocabList && filteredVocabList.length > 0 && (
                  <button
                    className="absolute bg-main-background w-32 h-8 top-4 right-6 md:right-8 shadow-small border border-black rounded-lg text-sm font-bold hover:bg-gray-100 active:translate-y-0.5 transition-all"
                    onClick={goToFlashCard}
                  >
                    Flash Card →
                  </button>
                )}

                <div className='flex flex-col items-center mt-10 gap-2 w-full'>
                  {filteredVocabList.map((item) => {
                    const isCurrentProcessing = processingId === item.id;

                    return (
                      <div
                        key={item.id}
                        /* ⭕️ 変更：ホバーしたときにふわっと浮き上がるリッチな影エフェクトを追加 */
                        className={`flex items-center w-full max-w-[850px] py-4 px-6 md:px-10 border border-black rounded-xl justify-between transition-all duration-200
                          ${isCurrentProcessing
                            ? "bg-gray-200 text-gray-400 opacity-60 scale-[0.98] pointer-events-none shadow-none border-gray-300"
                            : "bg-main-white shadow-small hover:shadow-medium hover:-translate-y-0.5"
                          }
                        `}
                      >
                        {/* 単語テキスト情報 */}
                        <div className='flex flex-col flex-1 pr-4'>
                          <p className='font-bold text-xl text-main-grey'>{item.palabra}</p>
                          <p className='text-xs font-medium text-gray-500 mt-0.5'>{item.hiragana}</p>
                          <p className='text-sm italic text-gray-700 mt-1 font-sans'>{item.traduccion}</p>
                        </div>

                        {/* アクションボタンコンテナ */}
                        <div className='flex w-40 justify-between items-center flex-shrink-0'>
                          <ButtonAudioPlay audio={item.audio_url} className="w-11 h-11 transition-transform active:scale-95 shadow-small rounded-full" />

                          {/* 移動ポップアップ用ボタン */}
                          <div className='relative'>
                            <button
                              className={`flex justify-center items-center w-11 h-11 rounded-full bg-main-white border border-black shadow-small cursor-pointer transition-all duration-150 hover:bg-gray-50 active:scale-95 ${isCurrentProcessing ? "text-gray-300 pointer-events-none" : "text-main-grey"}`}
                              onClick={() => handleClicktransfer(item)}
                            >
                              {isCurrentProcessing ? "⌛" : <RiFileTransferLine size={18} />}
                            </button>
                            {isTransferPopup && isTransferPopup.id === item.id && <Popup currentItem={item} />}
                          </div>

                          {/* 削除（アーカイブ）ボタン */}
                          <button
                            className={`flex justify-center items-center w-11 h-11 rounded-full bg-main-white border border-black shadow-small cursor-pointer transition-all duration-150 hover:bg-red-50 hover:text-red-600 hover:border-red-400 active:scale-95 ${item.level === "archivadas" ? "text-red-600 border-red-500 bg-red-50" : "text-main-grey"} ${isCurrentProcessing ? "text-gray-300 pointer-events-none" : ""}`}
                            onClick={() => {
                              if (level === 'archivadas') {
                                setItemToDelete(item);
                              } else {
                                handleClickLevelChange(item.id, 'archivadas');
                              }
                            }}
                          >
                            <FaTrashCan size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredVocabList.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-16 text-gray-500 bg-white/20 px-8 py-6 rounded-xl border border-dashed border-black/10">
                      <p className="italic font-medium">No hay palabras en este nivel.</p>
                    </div>
                  )}
                </div>
              </>
            )}
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
              Se eliminará <strong>「{itemToDelete.palabra}」</strong> de tu lista. Esta action no se puede deshacer.
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
// app/study/vocabulary/[level]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ButtonAudioPlay from "@/components/buttons/ButtonAudioPlay";
import { FaTrashCan } from "react-icons/fa6";
import { RiFileTransferLine } from "react-icons/ri";
import { useAuth } from "@/app/context/AuthContext";
import { useVocabulary } from "@/app/context/VocabularyContext";

function Vocabulary() {
  const params = useParams();
  const router = useRouter();

  // ⭕️ URLの初期levelをステートとして保持する
  const [currentLevel, setCurrentLevel] = useState(params.level || "anadidas");

  const { user, authLoading } = useAuth();
  const { allVocabs, loading, processingId, changeLevel, deleteVocabulary } = useVocabulary();

  const [isTransferPopup, setIsTransferPopup] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const ref = useRef(null);

  const levels = [
    { level: "anadidas", color: "bg-main-purple" },
    { level: "facil", color: "bg-main-yellow" },
    { level: "normal", color: "bg-main-orange" },
    { level: "dificil", color: "bg-main-lightBlue" },
    { level: "archivadas", color: "bg-gray-400" },
  ];

  // ⭕️ currentLevel をもとにフィルタリング
  const filteredVocabList = allVocabs.filter((item) => item.level === currentLevel);
  const idPage = levels.find((obj) => obj.level === currentLevel) || levels[0];

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
    // フラッシュカードへの遷移は currentLevel を渡す
    router.push(`/study/vocabulary/${currentLevel}/flashCard`);
  };

  const handleLevelChange = async (vId, targetLevel) => {
    setIsTransferPopup(null);
    await changeLevel(vId, targetLevel);
  };

  const handleDelete = async (vId) => {
    setItemToDelete(null);
    await deleteVocabulary(vId);
  };

  const Popup = ({ currentItem }) => (
    <div
      className="w-[240px] h-20 px-4 absolute flex justify-between items-center bg-main-background border border-black -right-4 -top-24 rounded-xl z-50 shadow-large animate-in fade-in zoom-in-95 duration-150"
      ref={ref}
    >
      {levels
        .filter((l) => l.level !== currentLevel && l.level !== "archivadas")
        .map((l) => (
          <div
            key={l.level}
            className={`w-11 h-11 rounded-full border flex justify-center items-center border-black cursor-pointer text-[10px] font-bold shadow-small uppercase tracking-wider transition-all duration-150 active:scale-95 hover:brightness-105 ${l.color}`}
            onClick={() => handleLevelChange(currentItem.id, l.level)}
          >
            {l.level.substring(0, 3)}
          </div>
        ))}
    </div>
  );

  return (
    <div className="relative w-full max-w-[1000px] mx-auto md:w-[760px]">
      {processingId !== null && (
        <div className="fixed inset-0 z-[100] cursor-not-allowed bg-transparent" />
      )}

      <div className="w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3 pl-2">
        <div>ご</div>
        <div>い</div>
      </div>

      {/* タブメニュー（Link から button に変更しページ遷移を排除） */}
      <div className="flex md:mt-10 items-end px-2">
        {levels.map((l, index) => (
          <button
            key={l.level}
            type="button"
            onClick={() => setCurrentLevel(l.level)}
            disabled={processingId !== null}
            className={`
              ${l.color} border border-black -mb-1 relative z-0 flex justify-center items-center transition-all duration-200 rounded-t-lg
              ${index === levels.length - 1 ? "ml-auto w-16 h-10" : "w-24 py-2 ml-1 md:ml-2"}
              ${currentLevel === l.level ? "font-bold border-b-0 pb-3 h-12 z-10" : "opacity-70 hover:opacity-90 hover:pb-2"}
              ${processingId !== null ? "pointer-events-none opacity-50" : ""} 
            `}
          >
            {l.level === "archivadas" ? <FaTrashCan size={18} /> : l.level}
          </button>
        ))}
      </div>

      {/* メインカード */}
      <div className={`${idPage.color} z-1 w-full relative content pt-14 md:pt-16 lg:pt-20 pb-10 px-4 md:px-8 lg:px-12 shadow-large min-h-[500px] rounded-b-xl border border-t-0 border-black`}>
        {authLoading || loading ? (
          <div className="flex flex-col items-center mt-20">
            <div className="animate-spin h-8 w-8 border-4 border-main-grey border-t-transparent rounded-full mb-4"></div>
            <p className="text-main-grey italic">Cargando vocabulario...</p>
          </div>
        ) : !user ? (
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
            {currentLevel === "archivadas" && (
              <div className="absolute top-5 left-6 md:left-8 text-main-grey text-xs italic bg-white/60 px-4 py-1.5 rounded-full border border-black/10 shadow-sm">
                🗑️ Las palabras en esta lista se eliminarán automáticamente después de 2 semanas.
              </div>
            )}

            {filteredVocabList.length > 0 && (
              <button
                className="absolute bg-main-background w-32 h-8 top-4 right-6 md:right-8 shadow-small border border-black rounded-lg text-sm font-bold hover:bg-gray-100 active:translate-y-0.5 transition-all"
                onClick={goToFlashCard}
              >
                Flash Card →
              </button>
            )}

            <div className="flex flex-col items-center mt-10 gap-2 w-full">
              {filteredVocabList.map((item) => {
                const isCurrentProcessing = processingId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center w-full max-w-[850px] py-4 px-6 md:px-10 border border-black rounded-xl justify-between transition-all duration-200
                      ${isCurrentProcessing
                        ? "bg-gray-200 text-gray-400 opacity-60 scale-[0.98] pointer-events-none shadow-none border-gray-300"
                        : "bg-main-white shadow-small hover:shadow-medium hover:-translate-y-0.5"
                      }
                    `}
                  >
                    <div className="flex flex-col flex-1 pr-4">
                      <p className="font-bold text-xl text-main-grey">{item.palabra}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{item.hiragana}</p>
                      <p className="text-sm italic text-gray-700 mt-1 font-sans">{item.traduccion}</p>
                    </div>

                    <div className="flex w-40 justify-between items-center flex-shrink-0">
                      <ButtonAudioPlay audio={item.audio_url} className="w-11 h-11 transition-transform active:scale-95 shadow-small rounded-full" />

                      <div className="relative">
                        <button
                          className={`flex justify-center items-center w-11 h-11 rounded-full bg-main-white border border-black shadow-small cursor-pointer transition-all duration-150 hover:bg-gray-50 active:scale-95 ${isCurrentProcessing ? "text-gray-300 pointer-events-none" : "text-main-grey"}`}
                          onClick={() => {
                            if (processingId !== null) return;
                            setIsTransferPopup(item);
                          }}
                        >
                          {isCurrentProcessing ? "⌛" : <RiFileTransferLine size={18} />}
                        </button>
                        {isTransferPopup?.id === item.id && <Popup currentItem={item} />}
                      </div>

                      <button
                        className={`flex justify-center items-center w-11 h-11 rounded-full bg-main-white border border-black shadow-small cursor-pointer transition-all duration-150 hover:bg-red-50 hover:text-red-600 hover:border-red-400 active:scale-95 ${item.level === "archivadas" ? "text-red-600 border-red-500 bg-red-50" : "text-main-grey"} ${isCurrentProcessing ? "text-gray-300 pointer-events-none" : ""}`}
                        onClick={() => {
                          if (currentLevel === "archivadas") {
                            setItemToDelete(item);
                          } else {
                            handleLevelChange(item.id, "archivadas");
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
      </div>

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
                onClick={() => handleDelete(itemToDelete.id)}
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
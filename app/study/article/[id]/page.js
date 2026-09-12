"use client";

import { FaRegStar, FaStar } from 'react-icons/fa';
import RubyText from "@/components/RubyText";
import ButtonSwichDisplay from '@/components/buttons/ButtonSwichDisplay';
import { useEffect, useState } from 'react';
import ButtonPager from '@/components/buttons/ButtonPager';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';

function IndividualArticle() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const { user, authLoading } = useAuth();

  const [displayFurigana, setDisplayFrigana] = useState(true);
  const [isJapanese, setIsJapanese] = useState(true);

  const [article, setArticle] = useState(null);
  const [vocabList, setVocabList] = useState([]);

  // ⭕️ 既読状態のローカル State（初期値 false）
  const [isRead, setIsRead] = useState(false);
  const [isUpdatingRead, setIsUpdatingRead] = useState(false);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchFullArticleData = async () => {
      if (!id || authLoading) return;

      // 1. 記事データの取得
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (articleError) {
        console.error('Error fetching article:', articleError);
        setLoading(false);
        return;
      }
      setArticle(articleData);

      // 2. ユーザーの既読（is_read）ステータスを取得 ⭕️［追加］
      if (user) {
        const { data: progressData } = await supabase
          .from('user_article_progress')
          .select('is_read')
          .eq('user_id', user.id)
          .eq('article_id', Number(id))
          .maybeSingle();

        if (progressData) {
          setIsRead(progressData.is_read || false);
        }
      }

      // 3. 語彙データの取得
      if (articleData.vocabulary_ids && articleData.vocabulary_ids.length > 0) {
        const { data: vocabData, error: vocabError } = await supabase
          .from('vocabularies')
          .select('*')
          .in('id', articleData.vocabulary_ids);

        if (vocabError) {
          console.error('Error fetching vocabularies:', vocabError);
        } else if (vocabData) {
          let savedIds = [];

          if (user) {
            const { data: progressData } = await supabase
              .from('user_vocabulary_progress')
              .select('vocabulary_id')
              .eq('user_id', user.id);
            savedIds = progressData?.map(p => p.vocabulary_id) || [];
          }

          const initializedVocab = vocabData.map(v => {
            return {
              ...v,
              isAdded: savedIds.includes(v.id)
            };
          });
          setVocabList(initializedVocab);
        }
      }
      setLoading(false);
    };

    fetchFullArticleData();
  }, [id, user, authLoading]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  };

  // ⭕️ 既読/未読のトグル処理
  const handleToggleRead = async () => {
    if (!user) {
      alert("Por favor, inicia sesión para marcar como leído.");
      return;
    }

    if (isUpdatingRead) return;
    setIsUpdatingRead(true);

    const newReadStatus = !isRead;

    // UIを即座に更新（体感速度アップ）
    setIsRead(newReadStatus);

    try {
      const { error } = await supabase
        .from('user_article_progress')
        .upsert({
          user_id: user.id,
          article_id: Number(id),
          is_read: newReadStatus,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,article_id' });

      if (error) {
        console.error("【既読更新失敗】理由:", error.message);
        setIsRead(!newReadStatus); // エラー時は元に戻す
      } else {
        if (newReadStatus) {
          showToastMessage("✓ Marcado como leído");
        } else {
          showToastMessage("Desmarcado como leído", 'error');
        }
      }
    } catch (e) {
      console.error(e);
      setIsRead(!newReadStatus);
    } finally {
      setIsUpdatingRead(false);
    }
  };

  const handleClickToggleVocabList = async (vocabId, isAdded, palabra) => {
    if (processingId !== null) return;

    if (!user) {
      alert("Por favor, inicia sesión para guardar vocabulario.");
      return;
    }

    setProcessingId(vocabId);

    try {
      if (!isAdded) {
        const { error } = await supabase
          .from('user_vocabulary_progress')
          .insert([{
            user_id: user.id,
            vocabulary_id: vocabId,
            level: 'anadidas'
          }]);

        if (error) {
          console.error("【追加失敗】理由:", error.message);
          setProcessingId(null);
        } else {
          showToastMessage(`🌟 "${palabra}" ha sido guardado.`);
          setProcessingId(null);
        }
      } else {
        const { error } = await supabase
          .from('user_vocabulary_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('vocabulary_id', Number(vocabId));

        if (error) {
          console.error("【削除失敗】理由:", error.message);
          setProcessingId(null);
        } else {
          showToastMessage(`🗑️ "${palabra}" ha sido eliminado.`, 'error');
          setProcessingId(null);
        }
      }

      setVocabList(prev => prev.map(v =>
        v.id === vocabId ? { ...v, isAdded: !v.isAdded } : v
      ));

    } catch (e) {
      console.error(e);
      setProcessingId(null);
    }
  };

  const handleTraduccion = () => {
    if (processingId !== null) return;
    setIsJapanese(prev => !prev);
  };

  const handleDisplayFurigana = () => {
    if (processingId !== null) return;
    if (isJapanese) setDisplayFrigana(prev => !prev);
  };

  if (authLoading || loading) return <p className="text-center mt-20">Loading...</p>;
  if (!article) return <p className="text-center mt-20">記事が見つかりません</p>;

  const goToTest = () => {
    if (processingId !== null) return;
    router.push(`/study/article/test/${id}`);
  };

  return (
    <>
      <div className="flex flex-col items-center md:w-[80%] pb-20 w-full max-w-[1000px] mx-auto gap-10">

        {/* タイトル */}
        <div className='w-full text-main-grey font-bold md:text-3xl lg:text-7xl text-center md:mt-10'>
          <RubyText rawText={article.title} />
        </div>

        <div className='bg-main-lightBlue w-full md:h-[60px] px-6 md:px-9 shadow-large flex justify-between items-center rounded-lg'>
          <div className='flex items-center' >
            <div>Tema:</div>
            <div className={`${article.label_bg} md:text-[16px] rounded-md ml-3 lg:text-[16px] md:px-3 lg:px-3 text-white`}>
              {article.label_text}
            </div>
          </div>
          <div className='flex items-center' >
            <div>Dificultad media</div>
            <div className='flex md:ml-3 text-2xl lg:text-lg text-yellow-500'>
              {Array.from({ length: 3 }).map((_, i) =>
                i < article.star ? <FaStar key={i} /> : <FaRegStar key={i} />
              )}
            </div>
          </div>
        </div>

        {/* 本文エリア */}
        <div className='flex flex-col justify-center w-full py-6 px-4 md:px-9'>
          {article.paragraphs.map((para, index) => (
            <div key={index} className="mb-8">
              <div className={"font-bold lg:text-[18px] leading-loose mb-2"}>
                <RubyText rawText={para} displayFurigana={displayFurigana} />
              </div>
              <div className={`italic lg:text-[16px] transition-colors duration-300 ${isJapanese ? 'text-transparent' : 'text-gray-600'}`}>
                {article.spanish_texts[index]}
              </div>
            </div>
          ))}
        </div>

        {/* 操作ボタン */}
        <div className='flex flex-wrap gap-4 justify-between items-center w-full px-4 md:px-9'>
          <div className='flex flex-wrap gap-3'>
            <ButtonSwichDisplay booleanItem={isJapanese} func={handleTraduccion} className={"bg-main-lightBlue md:w-52"} defaultText={"Traducción a español"} changedText={"Ver original texto"} />
            <ButtonSwichDisplay booleanItem={displayFurigana} func={handleDisplayFurigana} className={"bg-main-lightBlue md:w-52"} changedText={"Mostrar furigana"} defaultText={"Sacar furigana"} />

            {/* ⭕️ 既読にするトグルボタン */}
            <button
              onClick={handleToggleRead}
              disabled={isUpdatingRead}
              className={`px-4 py-2 rounded-lg font-bold text-sm border border-black shadow-small transition-all active:scale-95 ${isRead
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-main-white text-main-grey hover:bg-gray-100"
                }`}
            >
              {isRead ? "✓ Leído" : "Marcar como leído"}
            </button>
          </div>

          <ButtonPager onClick={goToTest} className="bg-main-white hover-float">
            <div className='flex items-center' >
              <div>Tomar el test</div>
              <div className='ml-3'>→</div>
            </div>
          </ButtonPager>
        </div>

        {/* 語彙セクション */}
        <div className='flex flex-col bg-main-lightBlue w-full py-8 px-6 md:px-9 shadow-large rounded-lg'>
          <div className='font-bold text-main-grey mb-4 md:text-lg'>Vocabulary:</div>
          <div className='flex flex-wrap gap-5 w-full'>
            {vocabList.length > 0 ? (
              vocabList.map((item) => {
                const isCurrentProcessing = processingId === item.id;
                return (
                  <div key={item.id} className={`w-[250px] flex items-center justify-between shadow-large rounded h-[75px] px-5 py-3 text-[18px] transition-all duration-200 ${isCurrentProcessing ? "bg-gray-300 text-gray-500 opacity-60 scale-95 pointer-events-none shadow-none" : item.isAdded ? "bg-main-purple text-white hover-float" : "bg-main-white text-main-grey hover-float"}`}>
                    <div>
                      <div className='font-bold'>{item.palabra}</div>
                      <div className='text-sm italic'>{item.traduccion}</div>
                    </div>
                    <button className={`w-[50px] h-[50px] rounded-full border border-black flex items-center justify-center font-bold text-lg ${isCurrentProcessing ? "border-gray-400 bg-gray-200 text-gray-400" : ""}`} onClick={() => handleClickToggleVocabList(item.id, item.isAdded, item.palabra)}>
                      {isCurrentProcessing ? "⌛" : item.isAdded ? "-" : "+"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic">No hay vocabulario registrado.</p>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

export default IndividualArticle;
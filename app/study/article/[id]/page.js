"use client";

import { FaRegStar, FaStar } from 'react-icons/fa';
import RubyText from "@/components/RubyText";
import ButtonSwichDisplay from '@/components/buttons/ButtonSwichDisplay';
import { useEffect, useState } from 'react';
import ButtonPager from '@/components/buttons/ButtonPager';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// ⭕️ 追加：共通の認証状態（Context）を呼び出す
import { useAuth } from '@/app/context/AuthContext';

function IndividualArticle() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  // ⭕️ 修正：アプリ共通の認証情報を最上部で常にキャッチする
  const { user, authLoading } = useAuth();

  const [displayFurigana, setDisplayFrigana] = useState(true);
  const [isJapanese, setIsJapanese] = useState(true);

  const [article, setArticle] = useState(null);
  const [vocabList, setVocabList] = useState([]);

  // 💡 認証自体のチェックは authLoading に任せるため、こちらは純粋に記事データ取得のローディングとして扱います
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 現在通信中の単語のIDを保持する（null の時は何も処理していない状態）
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchFullArticleData = async () => {
      if (!id || authLoading) return; // ⭕️ 認証状態のロードがまだ終わっていない場合は処理を待つ

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

      if (articleData.vocabulary_ids && articleData.vocabulary_ids.length > 0) {
        const { data: vocabData, error: vocabError } = await supabase
          .from('vocabularies')
          .select('*')
          .in('id', articleData.vocabulary_ids);

        if (vocabError) {
          console.error('Error fetching vocabularies:', vocabError);
        } else if (vocabData) {
          let savedIds = [];

          // ⭕️ 修正：自前の supabase.auth.getUser() の下りは完全削除！Contextから引き抜いた user を安全に使います
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
    // ⭕️ 修正：認証状態（user, authLoading）が確定したタイミングでも正しく走るように依存配列を設定
  }, [id, user, authLoading]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleClickToggleVocabList = async (vocabId, isAdded, palabra) => {
    // 連打防止：今すでに別の処理中なら何もしない
    if (processingId !== null) return;

    // ⭕️ 修正：Contextから常に確定したユーザー情報を見に行く
    if (!user) {
      alert("Por favor, inicia sesión para guardar vocabulario.");
      return;
    }

    // 操作開始：この単語のIDを処理中としてセット
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
          setProcessingId(null); // 失敗時は即解除
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
          setProcessingId(null); // 失敗時は即解除
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

  // ⭕️ 修正：認証状態、または記事データのロードが終わるまではしっかりスピナーで固定
  if (authLoading || loading) return <p className="text-center mt-20">Loading...</p>;
  if (!article) return <p className="text-center mt-20">記事が見つかりません</p>;

  const goToTest = () => {
    if (processingId !== null) return;
    router.push(`/study/article/test/${id}`);
  };

  return (
    <>
      {/* ガードレイヤーやトーストはそのまま */}

      {/* ⭕️ 修正：一番外側のコンテナ。ここを最大1000pxにして中央寄せにします */}
      <div className="flex flex-col items-center pb-20 w-full max-w-[1000px] mx-auto gap-10">

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
        {/* ⭕️ 修正：パディングを他の要素と合わせて綺麗に。縦の無駄なpy-20を py-6 程度に縮小 */}
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
        {/* ⭕️ 修正：w-full にして端を揃える */}
        <div className='flex justify-between w-full px-4 md:px-9'>
          <div className='flex gap-3'>
            <ButtonSwichDisplay booleanItem={isJapanese} func={handleTraduccion} className={"bg-main-lightBlue md:w-52"} defaultText={"Traducción a español"} changedText={"Ver original texto"} />
            <ButtonSwichDisplay booleanItem={displayFurigana} func={handleDisplayFurigana} className={"bg-main-lightBlue md:w-52"} changedText={"Mostrar furigana"} defaultText={"Sacar furigana"} />
          </div>
          <ButtonPager onClick={goToTest} className="bg-main-white hover-float">
            <div className='flex items-center' >
              <div>Tomar el test</div>
              <div className='ml-3'>→</div>
            </div>
          </ButtonPager>
        </div>

        {/* 語彙セクション */}
        {/* ⭕️ 修正：ここも w-full に統一。難易度ボードと100%同じ横幅でピタッと揃います */}
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
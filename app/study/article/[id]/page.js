"use client";

import { FaRegStar, FaStar } from 'react-icons/fa';
import RubyText from "@/components/RubyText";
import ButtonSwichDisplay from '@/components/buttons/ButtonSwichDisplay';
import { useEffect, useState } from 'react';
import ButtonPager from '@/components/buttons/ButtonPager';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function IndividualArticle() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [displayFurigana, setDisplayFrigana] = useState(true);
  const [isJapanese, setIsJapanese] = useState(true);

  const [article, setArticle] = useState(null);
  const [vocabList, setVocabList] = useState([]); // 語彙リスト用ステート
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullArticleData = async () => {
      if (!id) return;

      // 1. 記事データを取得
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

      // 2. 記事に紐づく語彙IDがある場合、語彙データを取得
      if (articleData.vocabulary_ids && articleData.vocabulary_ids.length > 0) {
        const { data: vocabData, error: vocabError } = await supabase
          .from('vocabularies')
          .select('*')
          .in('id', articleData.vocabulary_ids);
        console.log("vocabdata", vocabData)
        if (vocabError) {
          console.error('Error fetching vocabularies:', vocabError);
        } else if (vocabData) {
          const { data: { user } } = await supabase.auth.getUser();

          let savedIds = [];
          if (user) {
            // ログイン中なら、中間テーブル(user_vocabulary_progress)から自分が保存したID一覧を取る
            const { data: progressData } = await supabase
              .from('user_vocabulary_progress')
              .select('vocabulary_id')
              .eq('user_id', user.id);
            savedIds = progressData?.map(p => p.vocabulary_id) || [];
          }
          const initializedVocab = vocabData.map(v => {
            const isAdded = savedIds.includes(v.id);
            console.log(`単語ID ${v.id} の判定結果:`, isAdded); // 各単語の判定ログ
            return {
              ...v,
              isAdded: isAdded
            };
          });
          setVocabList(initializedVocab)
        }
      }
      setLoading(false);
    };

    fetchFullArticleData();
  }, [id]);

  // 単語帳への追加・削除ボタンのトグル処理（フロントエンドのみ）
  // IndividualArticle.js 内の関数を修正

  const handleClickToggleVocabList = async (vocabId, isAdded) => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log(vocabList)
    if (!user) {
      alert("Por favor, inicia sesión para guardar vocabulario.");
      return;
    }

    if (!isAdded) {
      // -------------------------------------------------------
      // 「＋」を押した時：user_vocabulary_progress に追加
      // -------------------------------------------------------
      const { error } = await supabase
        .from('user_vocabulary_progress')
        .insert([{
          user_id: user.id,
          vocabulary_id: vocabId,
          level: 'anadidas'
        }]);

      if (error) {
        console.error("【追加失敗】理由:", error.message, error.details);
      } else {
        console.log("【追加成功】DBに書き込みました！");
      }
    } else {
      // -------------------------------------------------------
      // 「ー」を押した時：テーブルから削除
      // -------------------------------------------------------
      console.log("削除ボタンが押されました。対象vocabId:", vocabId);

      // 1. まず、今DBに保存されている「自分のデータ」を全部持ってくる
      const { data: currentData } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id);

      console.log("DBに今保存されているリスト:", currentData);

      // 2. その中に、今回消そうとしている vocabId があるかチェック
      const exists = currentData?.find(item => item.vocabulary_id === Number(vocabId));

      if (!exists) {
        console.error("致命的：DBの中に、一致する vocabulary_id が見つかりません！");
        console.log("探している数字:", vocabId);
        console.log("DBにある数字たち:", currentData?.map(d => d.vocabulary_id));
      }

      // 3. 削除実行
      const { data, error } = await supabase
        .from('user_vocabulary_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('vocabulary_id', Number(vocabId))
        .select();

      console.log("削除結果:", data);
    }

    // フロントエンドの表示（＋/ー）も連動させる
    setVocabList(prev => prev.map(v =>
      v.id === vocabId ? { ...v, isAdded: !v.isAdded } : v
    ));
  };

  const handleTraduccion = () => setIsJapanese(prev => !prev);
  const handleDisplayFurigana = () => {
    if (isJapanese) setDisplayFrigana(prev => !prev);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!article) return <p className="text-center mt-20">記事が見つかりません</p>;

  const goToTest = () => {
    router.push(`/study/article/test/${id}`);
  };

  return (
    <>
      <div className="flex flex-col items-center pb-20">
        {/* タイトル */}
        <div className='w-full md:mt-20 text-main-grey font-bold md:text-3xl lg:text-7xl text-center'>
          <RubyText rawText={article.title} />
        </div>

        {/* ラベルと難易度 */}
        <div className='md:mt-10 bg-main-lightBlue w-[570px] md:w-[720px] lg:w-[1000px] content md:h-[60px] md:px-9 lg:px-6 shadow-large flex justify-between items-center'>
          <div className='flex items-center' >
            <div>Tema:</div>
            <div className={`${article.label_bg} md:text-[15px] lg:text-[12px] md:px-3 lg:px-3  text-white`}>
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
        <div className='flex flex-col justify-center md:min-h-[450px] w-full max-w-[1000px] md:px-20 py-20'>
          {article.paragraphs.map((para, index) => (
            <div key={index} className="mb-8">
              <div className={"font-bold lg:text-[18px] leading-loose mb-2"}>
                <RubyText
                  rawText={para}
                  displayFurigana={displayFurigana}
                />
              </div>
              <div className={`italic lg:text-[16px] transition-colors duration-300 ${isJapanese ? 'text-transparent' : 'text-gray-600'}`}>
                {article.spanish_texts[index]}
              </div>
            </div>
          ))}
        </div>

        {/* 操作ボタン */}
        <div className='flex justify-between w-full max-w-[1000px] md:p-3'>
          <div className='flex gap-3'>
            <ButtonSwichDisplay
              booleanItem={isJapanese}
              func={handleTraduccion}
              className={"bg-main-lightBlue md:w-52"}
              defaultText={"Traducción a español"}
              changedText={"Ver original texto"}
            />
            <ButtonSwichDisplay
              booleanItem={displayFurigana}
              func={handleDisplayFurigana}
              className={"bg-main-lightBlue md:w-52"}
              changedText={"Mostrar furigana"}
              defaultText={"Sacar furigana"}
            />
          </div>
          <ButtonPager onClick={goToTest} className="bg-main-white">
            <div className='flex items-center' >
              <div>Tomar el test</div>
              <div className='ml-3'>→</div>
            </div>
          </ButtonPager>
        </div>

        {/* 語彙セクション */}
        <div className='md:mt-10 relative flex bg-main-lightBlue w-[570px] md:p-9  md:w-[720px] lg:w-[1000px] content md:px-9 lg:px-6 shadow-large'>
          <div className='absolute top-4 left-4 font-bold'>Vocabulary:</div>
          <div className='ml-16 flex flex-wrap gap-5 mt-5'>
            {vocabList.length > 0 ? (
              vocabList.map((item) => (
                <div key={item.id} className={`w-[250px] flex items-center justify-between shadow-large rounded h-[75px] px-5 py-3 text-[18px] transition-colors ${item.isAdded ? "bg-main-purple text-white" : "bg-main-white"}`}>
                  <div className=''>
                    <div className='font-bold'>{item.palabra}</div>
                    <div className='text-sm italic'>{item.traduccion}</div>
                  </div>
                  <button
                    className={`w-[30px] h-[30px] rounded-full border border-black flex items-center justify-center font-bold`}
                    onClick={() => handleClickToggleVocabList(item.id, item.isAdded)}
                  >
                    {item.isAdded ? "-" : "+"}
                  </button>
                </div>
              ))
            ) : (
              <p className="mt-4 text-gray-500">No hay vocabulario registrado.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default IndividualArticle;
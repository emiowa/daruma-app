"use client";

import { IoEyeOutline, IoBookOutline } from "react-icons/io5";
import { VscFlame } from "react-icons/vsc";
import ButtonAudioFunFactData from '@/components/buttons/ButtonAudioFunFactData';
import ButtonAudioVocabulary from '@/components/buttons/ButtonAudioVocabulary';
import SeeEveryArticleLink from '@/components/links/SeeEveryArticleLink';
import ArticleCards from '@/components/study/ArticleCards';
import VocabularyRow from '@/components/VocabularyRow';
import { FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";

function Study() {
  const articleDisplayLimit = 6;
  const vocabularyDisplayLimit = 5;

  const [isJapanese, setIsJapanese] = useState(true);
  const handleToggleLanguage = () => setIsJapanese(prev => !prev);

  const [articles, setArticles] = useState([]);
  const [trivia, setTrivia] = useState()
  const [vocabList, setVocabList] = useState([]); // 語彙用のステートを追加

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date().toISOString(); // 今の時刻

      // 1. 豆知識データの取得
      const { data: triviaData, error: triviaError } = await supabase
        .from('trivia')
        .select('*')
        .lte('published_at', now) // 公開日が今より前
        .order('published_at', { ascending: false }) // 作成順ではなく公開順に変更
        .limit(1); // .single()の代わりに.limit(1)

      if (triviaError) {
        console.error('Error fetching trivia:', triviaError.message);
      } else if (triviaData && triviaData.length > 0) {
        setTrivia(triviaData[0]); // 配列の1番目をセット
      }

      // 2. 記事データの取得
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .lte('published_at', now) // 公開日が今より前
        .order('published_at', { ascending: false }) // 公開順
        .limit(articleDisplayLimit);

      if (articlesError) {
        console.error('Error fetching articles:', articlesError);
      } else {
        setArticles(articlesData || []);
      }

      // 3. 語彙データの取得
      const { data: vocabsData, error: vocabsError } = await supabase
        .from('vocabularies')
        .select('*')
        .lte('published_at', now) // 公開日が今より前
        .order('published_at', { ascending: false }) // 公開順
        .limit(vocabularyDisplayLimit);

      if (vocabsError) {
        console.error('Error fetching vocabularies:', vocabsError);
      } else {
        setVocabList(vocabsData || []);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <div className='w-full md:w-[720px] lg:w-[1000px]'>
        <div className='flex justify-center h-40 md:h-48 lg:h-64'>
          {/* ポイントセクション */}
          <div className='bg-main-orange md:w-[210px] lg:w-[280px] content shadow-large md:pt-9 lg:pt-12 md:px-2 flex flex-col md:gap-6'>
            <div className='flex text-[rgb(246,239,221)] items-end ml-2'>
              <p className='text-4xl md:text-4xl lg:text-5xl'>200</p>
              <p className='text-xm md:text-xm ml-1 md:ml-1'>ポイント</p>
              <a href="/study/animation">
                animation
              </a>
            </div>
            <div className='bg-main-retroWhite w-full h-16 md:h-20 lg:h-28 shadow-small content p-2'>
              <div className='flex'>
                <IoEyeOutline className='lg:mt-[2px]' />
                <p className='ml-1 text-[10px] lg:text-[14px] font-semibold'>Artículos leídos: 10</p>
              </div>
              <div className='flex-col ml-1 mt-3 md:mt-4 lg:mt-5'>
                <div className='flex'>
                  <IoBookOutline className='lg:mt-[2px]' />
                  <p className='ml-1 text-[10px] lg:text-[14px]'>Principiantes: 8</p>
                </div>
                <div className='flex mt-1'>
                  <VscFlame className='lg:mt-[2px]' />
                  <p className='ml-1 text-[10px] lg:text-[14px]'>Avanzados: 2</p>
                </div>
              </div>
            </div>
          </div>

          {/* まめちしきセクション */}
          <div className='content shadow-large bg-main-white w-[450px] md:w-[510px] lg:w-[680px] ml-3 pt-3 lg:pt-5 pl-5 lg:pl-7 relative overflow-hidden'>
            <img src={trivia?.image} alt="sushi" className='absolute top-0 right-0 w-42 md:w-52 lg:w-72' />
            <div className='w-[290px] md:w-[250px] lg:w-[340px]'>
              <p className='text-xl font-bold md:text-2xl lg:text-4xl'>{isJapanese ? "まめちしき" : "Curiosidades"}</p>
              {/* key を変えることで、切り替わった瞬間に Tailwind のアニメーションを「最初から」再生させます */}
              <div
                key={isJapanese ? "jp" : "es"}
                className="fade-text"
              >
                <div className='text-[10px] lg:text-[14px]'>
                  <p className='mt-5 md:mt-4 lg:mt-6'>{isJapanese ? "知っていましたか..." : "¿Sabías que...?"}</p>
                  <p className='mt-5 md:mt-4 lg:mt-6 leading-relaxed'>
                    {isJapanese
                      ? (trivia?.japanese || "読み込み中...")
                      : (trivia?.spanish || "Cargando...")
                    }
                  </p>
                </div>
              </div>

              <div className='flex text-[11px] absolute bottom-5 lg:text-[14px]'>
                <ButtonAudioVocabulary handleToggleLanguage={handleToggleLanguage} jp={isJapanese} />
                <ButtonAudioFunFactData audio={trivia?.audio} />
              </div>
            </div>
          </div>
        </div>

        <div className='flex w-full justify-center mt-8 lg:mt-20'>
          {/* きじ（記事一覧） */}
          <div className='bg-main-lightBlue w-[570px] md:w-[570px] lg:w-[660px] h-[650px] md:h-[500px] lg:h-[750px] content p-4 lg:p-6 shadow-large'>
            <div className='flex justify-between items-center'>
              <p className='text-main-retroBlack font-bold md:text-2xl lg:text-4xl'>きじ</p>
              <SeeEveryArticleLink />
            </div>
            <div className='flex flex-wrap gap-3 mt-3 lg:mt-12'>
              {articles.map((item) => (
                <ArticleCards
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  label={{ text: item.label_text, bg: item.label_bg }}
                  imageUrl={item.image_url}
                  star={item.star || 0}
                  leido={false}
                  page="main"
                />
              ))}
            </div>
          </div>

          {/* ごい（語彙一覧） */}
          <div className='bg-main-white w-[240px] md:w-[240px] lg:w-[300px] h-[400px] md:h-[400px] lg:h-[550px] ml-3 content px-3 py-5 shadow-large overflow-hidden'>
            <div className='flex items-center justify-between'>
              <p className='font-bold md:text-2xl lg:text-4xl lg:ml-3'>ごい</p>
              <div className='flex items-center'><a
                href='/study/vocabulary/facil'
                className='inline-flex items-center text-main-grey text-base md:text-lg font-bold underline hover-float py-1 px-3 rounded-md'
              >
                Ver lista
              </a>
                <FaArrowRight className='ml-1 text-xs' />
              </div>
            </div>
            <div className='mt-4 lg:mt-8'>
              {vocabList.map((item, index) => (
                <div key={item.id}>
                  <VocabularyRow
                    palabra={item.palabra}
                    hiragana={item.hiragana}
                    traduccion={item.traduccion}
                    audio={item.audio_url}
                  />
                  {index < vocabList.length - 1 && (
                    <div className='w-full my-2 h-[1px] bg-gray-200'></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Study;
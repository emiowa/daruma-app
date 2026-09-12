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
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

function Study() {
  const { user, authLoading } = useAuth();

  const articleDisplayLimit = 6;
  const vocabularyDisplayLimit = 5;

  const [isJapanese, setIsJapanese] = useState(true);
  const handleToggleLanguage = () => setIsJapanese(prev => !prev);

  const [articles, setArticles] = useState([]);
  const [readArticleIds, setReadArticleIds] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const [trivia, setTrivia] = useState(null);
  const [vocabList, setVocabList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      const now = new Date().toISOString();

      // 1. 豆知識データの取得
      const { data: triviaData, error: triviaError } = await supabase
        .from('trivia')
        .select('*')
        .lte('published_at', now)
        .order('published_at', { ascending: false })
        .limit(1);

      if (triviaError) {
        console.error('Error fetching trivia:', triviaError.message);
      } else if (triviaData && triviaData.length > 0) {
        setTrivia(triviaData[0]);
      }

      // 2. 記事データの取得
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .lte('published_at', now)
        .order('published_at', { ascending: false })
        .limit(articleDisplayLimit);

      if (articlesError) {
        console.error('Error fetching articles:', articlesError);
      } else {
        setArticles(articlesData || []);
      }

      // 3. 既読データの取得
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_article_progress')
          .select('article_id')
          .eq('user_id', user.id)
          .eq('is_read', true);

        if (!progressError && progressData) {
          const ids = progressData.map(item => item.article_id);
          setReadArticleIds(ids);
          setReadCount(ids.length);
        }
      }

      // 4. 語彙データの取得
      const { data: vocabsData, error: vocabsError } = await supabase
        .from('vocabularies')
        .select('*')
        .lte('published_at', now)
        .order('published_at', { ascending: false })
        .limit(vocabularyDisplayLimit);

      if (vocabsError) {
        console.error('Error fetching vocabularies:', vocabsError);
      } else {
        setVocabList(vocabsData || []);
      }
    };

    fetchData();
  }, [user, authLoading]);

  return (
    <div className='w-full md:w-[720px] lg:w-[1000px] mx-auto'>
      <div className='flex justify-center h-40 md:h-48 lg:h-64'>
        {/* ポイントセクション */}
        <div className='bg-main-orange md:w-[210px] lg:w-[280px] content shadow-large md:pt-9 lg:pt-12 md:px-2 flex flex-col md:gap-6'>
          <div className='flex text-[rgb(246,239,221)] items-end ml-2'>
            <span className='text-4xl md:text-4xl lg:text-5xl font-bold'>200</span>
            <span className='text-xs md:text-sm ml-1 mb-1'>ポイント</span>
          </div>
          <div className='bg-main-retroWhite w-full h-16 md:h-20 lg:h-28 shadow-small content p-2'>
            <div className='flex items-center'>
              <IoEyeOutline className='lg:mt-[2px]' />
              <span className='ml-1 text-[10px] lg:text-[14px] font-semibold'>
                Artículos leídos: {readCount}
              </span>
            </div>
            <div className='flex-col ml-1 mt-3 md:mt-4 lg:mt-5'>
              <div className='flex items-center'>
                <IoBookOutline className='lg:mt-[2px]' />
                <span className='ml-1 text-[10px] lg:text-[14px]'>Principiantes: 8</span>
              </div>
              <div className='flex items-center mt-1'>
                <VscFlame className='lg:mt-[2px]' />
                <span className='ml-1 text-[10px] lg:text-[14px]'>Avanzados: 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* まめちしきセクション */}
        <div className='content shadow-large bg-main-white w-[450px] md:w-[510px] lg:w-[680px] ml-3 pt-3 lg:pt-5 pl-5 lg:pl-7 relative overflow-hidden'>
          {trivia?.image && (
            <img src={trivia.image} alt="sushi" className='absolute top-0 right-0 w-42 md:w-52 lg:w-72' />
          )}
          <div className='w-[290px] md:w-[250px] lg:w-[340px]'>
            <h3 className='text-xl font-bold md:text-2xl lg:text-4xl'>{isJapanese ? "まめちしき" : "Curiosidades"}</h3>
            <div
              key={isJapanese ? "jp" : "es"}
              className="fade-text"
            >
              <div className='text-[10px] lg:text-[14px]'>
                <div className='mt-5 md:mt-4 lg:mt-6 font-semibold'>{isJapanese ? "知っていましたか..." : "¿Sabías que...?"}</div>
                <div className='mt-2 leading-relaxed'>
                  {isJapanese ? (trivia?.japanese || "読み込み中...") : (trivia?.spanish || "Cargando...")}
                </div>
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
            <h2 className='text-main-retroBlack font-bold md:text-2xl lg:text-4xl'>きじ</h2>
            <SeeEveryArticleLink />
          </div>
          <div className='flex flex-wrap gap-3 mt-3 lg:mt-12'>
            {articles.map((item) => {
              const isRead = readArticleIds.includes(item.id);
              return (
                <ArticleCards
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  label={{ text: item.label_text, bg: item.label_bg }}
                  imageUrl={item.image_url}
                  star={item.star || 0}
                  leido={isRead}
                  page="main"
                />
              );
            })}
          </div>
        </div>

        {/* ごい（語彙一覧） */}
        <div className="w-[240px] md:w-[240px] lg:w-[300px] h-[400px] md:h-[400px] lg:h-[550px] ml-3">
          <div className='flex items-center justify-between bg-main-yellow  content px-3 py-5 shadow-large overflow-hidden'>
            <h2 className="text-main-retroBlack font-bold md:text-2xl lg:text-4xl">擬音語</h2>
            <Link href="/study/animation"
              className='inline-flex items-center text-main-grey text-base md:text-lg font-bold underline hover-float py-1 px-3 rounded-md'
            >
              擬音語
            </Link>
            <FaArrowRight className='ml-1 text-xs' />

          </div>
          <div className='bg-main-white mt-5 content px-3 py-5 shadow-large overflow-hidden'>
            <div className='flex items-center justify-between'>
              <h2 className='font-bold md:text-2xl lg:text-4xl lg:ml-3'>ごい</h2>
              <div className='flex items-center'>
                <Link
                  href='/study/vocabulary/facil'
                  className='inline-flex items-center text-main-grey text-base md:text-lg font-bold underline hover-float py-1 px-3 rounded-md'
                >
                  Ver lista
                </Link>
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
    </div>
  );
}

export default Study;
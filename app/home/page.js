"use client";

import ArticleCards from '@/components/study/ArticleCards';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/AuthContext';

function Home() {
  const articleNum = 4;
  const { user, authLoading } = useAuth();

  const [articles, setArticles] = useState([]);
  const [readArticleIds, setReadArticleIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeArticles = async () => {
      if (authLoading) return;
      setLoading(true);

      try {
        // 1. 最新の公開記事を4件取得
        const now = new Date().toISOString();
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .lte('published_at', now)
          .order('published_at', { ascending: false })
          .limit(articleNum);

        if (articlesError) throw articlesError;
        setArticles(articlesData || []);

        // 2. ログインユーザーの既読データを取得
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_article_progress')
            .select('article_id')
            .eq('user_id', user.id)
            .eq('is_read', true);

          if (!progressError && progressData) {
            setReadArticleIds(progressData.map(item => item.article_id));
          }
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeArticles();
  }, [user, authLoading]);

  return (
    <div className="w-full">
      <div
        className='w-full min-h-screen bg-no-repeat bg-center relative pixel-layer'
        style={{
          backgroundImage: "url('/images/scene1/scene-test.png')",
          backgroundSize: '100vw auto',
          imageRendering: 'pixelated',
          overflow: 'hidden'
        }}
      >
        {/* Your content goes here */}
      </div>

      <div
        className='w-full min-h-screen bg-no-repeat bg-center relative'
        style={{
          backgroundImage: "url('/images/BG-600-180-bamboo.png')",
          backgroundSize: 'auto 100vh',
          imageRendering: 'pixelated',
          overflow: 'hidden'
        }}
      >
        <div className='flex items-center justify-normal min-h-screen p-6'>
          {loading ? (
            <div className="text-white italic">Cargando...</div>
          ) : (
            <div className='grid grid-cols-2 gap-3'>
              {articles.map((item) => {
                const isRead = readArticleIds.includes(item.id);
                return (
                  <ArticleCards
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    label={{ text: item.label_text, bg: item.label_bg }}
                    star={item.star}
                    leido={isRead}
                    page="main"
                  />
                );
              })}
            </div>
          )}
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
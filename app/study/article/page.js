"use client";

import ArticleCards from '@/components/study/ArticleCards';
import { useEffect, useRef, useState } from 'react';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/AuthContext'; // ⭕️ useAuthをインポート

function Articles() {
  const ArticleNum = 12;
  const [articleNum, setArticleNum] = useState(ArticleNum);

  // 状態管理
  const [allArticles, setAllArticles] = useState([]);
  const [currentCardsList, setCurrentCardsList] = useState([]);
  const [readArticleIds, setReadArticleIds] = useState([]); // ⭕️ 既読記事IDのリスト
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user, authLoading } = useAuth(); // ⭕️ ユーザー情報の取得

  const [isStarHovered, setIsStarHovered] = useState(false);
  const filterRef = useRef(null);

  // 1. ページ初期化時にSupabaseから全記事データ ＋ 既読データを取得
  useEffect(() => {
    const fetchAll = async () => {
      if (authLoading) return;
      setLoading(true);
      const now = new Date().toISOString();

      try {
        // 全記事データの取得
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .lte('published_at', now)
          .order('published_at', { ascending: false });

        if (error) {
          console.error("Error fetching articles:", error.message);
          setAllArticles([]);
          setCurrentCardsList([]);
        } else {
          const safeData = Array.isArray(data) ? data : [];
          setAllArticles(safeData);
          setCurrentCardsList(safeData);
        }

        // ログイン中の場合、ユーザーの既読データ（is_read = true）を取得 ⭕️
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
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user, authLoading]);

  // フィルターの設定
  const filterDetail = [
    { id: 0, title: "Por tema", list: ["Cultura", "Viaje", "Comida", "Turismo", "Metrópolis", "Naturaleza", "Onsen"] },
    { id: 1, title: "Por nivel de dificultad", list: ["Dificultad baja", "Dificultad media", "Dificultad alta"] },
    { id: 2, title: "Estado", list: ["Leido", "No leido"] }
  ];

  const [selectedList, setSelectedList] = useState(
    filterDetail.map(item => ({ id: item.id, list: [] }))
  );

  const levelToStar = { "Dificultad baja": 1, "Dificultad media": 2, "Dificultad alta": 3 };

  // 2. ユーザーがフィルターを選択したときの絞り込み処理
  useEffect(() => {
    if (loading || !allArticles || !Array.isArray(allArticles) || allArticles.length === 0) {
      setCurrentCardsList([]);
      return;
    }

    let filtered = [...allArticles];

    // ① テーマフィルター
    const { list: temas } = selectedList[0] || { list: [] };
    if (temas.length > 0) {
      filtered = filtered.filter(card => card && temas.includes(card.label_text));
    }

    // ② 難易度フィルター
    const { list: niveles } = selectedList[1] || { list: [] };
    if (niveles.length > 0) {
      const targetStars = niveles.map(n => levelToStar[n]);
      filtered = filtered.filter(card => card && targetStars.includes(card.star));
    }

    // ③ 既読・未読（Estado）フィルター ⭕️
    const { list: estados } = selectedList[2] || { list: [] };
    if (estados.length > 0) {
      filtered = filtered.filter(card => {
        const isRead = readArticleIds.includes(card.id);
        if (estados.includes("Leido") && !estados.includes("No leido")) return isRead;
        if (estados.includes("No leido") && !estados.includes("Leido")) return !isRead;
        return true;
      });
    }

    setCurrentCardsList(filtered);
    setArticleNum(ArticleNum);
  }, [selectedList, allArticles, readArticleIds, loading]);

  // フィルターポップアップの外部クリック閉じ処理
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isFilterOpen && filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const handleArticleNum = () => setArticleNum(prev => prev + ArticleNum);
  const handleClickFilterToggle = () => setIsFilterOpen(prev => !prev);

  const toggleListItem = (id, value) => {
    setSelectedList(prev => prev.map(item => {
      if (item.id !== id) return item;
      const exists = item.list.includes(value);
      return { ...item, list: exists ? item.list.filter(v => v !== value) : [...item.list, value] };
    }));
  };

  const handleClickClear = () => setSelectedList(filterDetail.map(item => ({ id: item.id, list: [] })));

  return (
    <div className='bg-main-lightBlue w-full md:w-[760px] max-w-[1000px] mt-52 content pt-20 md:pt-24 lg:pt-28 pb-10 px-4 md:px-8 shadow-large relative rounded-xl border border-black mx-auto'>

      {/* アニメーション用CSS */}
      <style>{`
        @keyframes filterPop {
          0% { transform: scale(0.95) translateY(-5px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .filter-animation {
          animation: filterPop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* タイトル「きじ」 */}
      <div className='text-main-grey font-bold md:text-6xl lg:text-7xl absolute md:-top-16 lg:-top-[75px] left-4 md:left-8 space-y-3 pl-2'>
        <div>き</div><div>じ</div>
      </div>

      {/* フィルター ＆ 星マークホバーガイドエリア */}
      <div className='absolute -top-11 right-4 md:right-8 z-30 flex items-center gap-3 md:gap-4'>

        {/* ⭐ 星マークホバーガイド */}
        {!loading && (
          <div
            className="hidden sm:flex relative cursor-help select-none"
            onMouseEnter={() => setIsStarHovered(true)}
            onMouseLeave={() => setIsStarHovered(false)}
          >
            <div className={`flex items-center justify-center bg-main-white border border-black px-3 py-1 rounded-lg text-sm text-yellow-500 shadow-small transition-all duration-150 ${isStarHovered ? 'scale-105 bg-gray-50' : ''}`}>
              <span className="text-yellow-500 text-base font-bold select-none">★</span>
            </div>

            {isStarHovered && (
              <div className="absolute w-[210px] p-4 bg-gray-600 border border-black rounded-xl right-0 top-11 z-50 shadow-large origin-top-right filter-animation">
                <h4 className="text-[13px] font-bold text-main-background mb-2 pb-1 border-b border-white/20">
                  Guía de Nivel:
                </h4>
                <div className="text-[12px] text-white space-y-1.5 font-medium leading-relaxed">
                  <p>⭐<span className="ml-1 text-white"> = Artículos Fáciles</span></p>
                  <p>⭐⭐<span className="ml-1 text-white"> = Nivel Medio</span></p>
                  <p>⭐⭐⭐<span className="ml-1 text-white"> = Artículos Difíciles</span></p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* フィルター展開ボタン */}
        <button
          onClick={handleClickFilterToggle}
          className={`flex items-center gap-3 bg-main-white px-4 py-1.5 border border-black rounded-lg text-sm font-bold shadow-small transition-all active:scale-95 hover:bg-gray-50`}
        >
          <span>Filter</span>
          {isFilterOpen ? <SlArrowUp className='text-xs' /> : <SlArrowDown className='text-xs' />}
        </button>

        {isFilterOpen && (
          <div
            ref={filterRef}
            className='filter-animation absolute right-0 top-10 w-[320px] md:w-[430px] bg-main-white border-2 border-black z-40 py-4 px-5 rounded-xl shadow-large'
          >
            {filterDetail.map((item) => (
              <div key={item.id} className='pb-4 text-[14px] md:text-[15px] border-b border-gray-100 mb-3 last:border-0 last:mb-0'>
                <div className='font-bold text-main-grey'>{item.title}:</div>
                <div className='flex flex-wrap mt-2 gap-2'>
                  {item.list.map((i) => {
                    const isSelected = selectedList[item.id]?.list.includes(i);
                    return (
                      <div
                        key={i}
                        className={`cursor-pointer border rounded-full py-1 px-3 text-[11px] md:text-[12px] font-medium shadow-xs transition-all duration-150 active:scale-95
                          ${isSelected
                            ? "bg-main-purple text-white border-main-purple font-bold"
                            : "bg-main-background text-main-grey border-gray-300 hover:bg-gray-100"
                          }
                        `}
                        onClick={() => toggleListItem(item.id, i)}
                      >
                        {i}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-2">
              <button
                className='bg-main-background border border-black py-1 px-4 text-main-grey font-bold rounded-lg text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-400 active:scale-95 transition-all shadow-small'
                onClick={handleClickClear}
              >
                Borrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 記事カード一覧表示エリア */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-main-grey border-t-transparent rounded-full mb-4"></div>
          <p className="text-main-grey italic">Cargando artículos...</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 md:mt-6 lg:mt-8 w-full justify-items-center'>
            {Array.isArray(currentCardsList) && currentCardsList.slice(0, articleNum).map((item) => {
              if (!item) return null;

              // ⭕️ カードが既読かどうか判定
              const isRead = readArticleIds.includes(item.id);

              return (
                <div key={item.id} className="w-full flex justify-center">
                  <ArticleCards
                    id={item.id}
                    title={item.title}
                    label={{ text: item.label_text, bg: item.label_bg }}
                    star={item.star}
                    leido={isRead} // ⭕️ 判定結果を反映
                  />
                </div>
              );
            })}
          </div>

          {(!currentCardsList || currentCardsList.length === 0) && (
            <div className="text-center py-20 text-gray-500 italic bg-white/20 rounded-xl border border-dashed border-black/10 w-full max-w-[800px] mx-auto mt-4">
              No se encontraron artículos con estos filtros.
            </div>
          )}

          {currentCardsList && currentCardsList.length > articleNum && (
            <div className='flex justify-center mt-10'>
              <button
                className='w-12 h-12 border border-black rounded-full bg-main-white flex items-center justify-center text-2xl font-bold shadow-small hover-float active:scale-95 active:shadow-none transition-all'
                onClick={handleArticleNum}
              >
                +
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Articles;
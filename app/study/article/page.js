"use client";

import ArticleCards from '@/components/study/ArticleCards';
import { useEffect, useRef, useState } from 'react';
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { supabase } from '@/lib/supabase'; // インポート忘れずに！

function Articles() {
  const ArticleNum = 12;
  const [articleNum, setArticleNum] = useState(ArticleNum);

  // 状態管理
  const [allArticles, setAllArticles] = useState([]); // Supabaseから取った全データ
  const [currentCardsList, setCurrentCardsList] = useState([]); // フィルター後の表示用
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // 1. 最初に全データを取得
  useEffect(() => {
    const fetchAll = async () => {
      const now = new Date().toISOString(); // 今この瞬間の時刻

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .lte('published_at', now) // ★ 未来の記事は出さない
        .order('published_at', { ascending: false }); // ★ 公開順に並べる

      if (error) {
        console.error("Error fetching articles:", error.message);
      } else {
        setAllArticles(data || []);
        setCurrentCardsList(data || []);
      }
    };
    fetchAll();
  }, []);

  // フィルターの設定 (ここは現状維持)
  const filterDetail = [
    { id: "0", title: "Por tema", list: ["Cultura", "Viaje", "Comida", "Turismo", "Metrópolis", "Naturaleza", "Onsen"] }, // 追加したラベルも入れると◎
    { id: "1", title: "Por nivel de dificultad", list: ["Dificultad baja", "Dificultad media", "Dificultad alta"] },
    { id: "2", title: "Estado", list: ["Leido", "No leido"] }
  ];

  const [selectedList, setSelectedList] = useState(
    filterDetail.map(item => ({ id: item.id, list: [] }))
  );

  const levelToStar = { "Dificultad baja": 1, "Dificultad media": 2, "Dificultad alta": 3 };

  // 2. フィルター処理を Supabase のカラム名に合わせて修正
  useEffect(() => {
    let filtered = allArticles;

    // Tema (label_text)
    const temas = selectedList[0].list;
    if (temas.length > 0) {
      filtered = filtered.filter(card => temas.includes(card.label_text));
    }

    // Level (star)
    const niveles = selectedList[1].list;
    if (niveles.length > 0) {
      const targetStars = niveles.map(n => levelToStar[n]);
      filtered = filtered.filter(card => targetStars.includes(card.star));
    }

    // Estado (leido - 今は仮に全データ false)
    const estados = selectedList[2].list;
    if (estados.length > 0) {
      // Supabaseにleidoカラムがない場合は、今は常に表示しない or 全て表示
      // filtered = filtered.filter(card => ...);
    }

    setCurrentCardsList(filtered);
  }, [selectedList, allArticles]);

  // 外部クリックで閉じる処理 (現状維持)
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
    <div className='md:mt-20 bg-main-lightBlue w-[570px] md:w-[720px] lg:w-[1000px] content md:pt-28 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large relative'>
      <div className='text-main-grey font-bold md:text-6xl lg:text-7xl absolute md:-top-16 lg:-top-[75px] md:left-8 space-y-3'>
        <div>き</div><div>じ</div>
      </div>

      {/* Filter UI */}
      <div className='flex absolute -top-8 left-36 cursor-pointer'>
        <div onClick={handleClickFilterToggle} className="flex items-center">
          <div>Filter</div>
          {isFilterOpen ? <SlArrowUp className='ml-6' /> : <SlArrowDown className='ml-6' />}
        </div>
        {isFilterOpen && (
          <div ref={filterRef} className='absolute top-8 -left-5 w-[430px] bg-gray-300 z-40 py-3 px-5 rounded-lg shadow-xl'>
            {filterDetail.map((item) => (
              <div key={item.id} className='pb-5 text-[15px]'>
                <div className='font-bold'>{item.title}:</div>
                <div className='flex flex-wrap mt-1 gap-2'>
                  {item.list.map((i) => (
                    <div
                      key={i}
                      className={`cursor-pointer border rounded-full border-black py-1 px-3 text-[12px] ${selectedList[item.id].list.includes(i) ? "bg-gray-600 text-white" : "bg-gray-100"}`}
                      onClick={() => toggleListItem(item.id, i)}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className='bg-main-nav py-1 px-3 text-white rounded-lg text-sm' onClick={handleClickClear}>Borrar</button>
          </div>
        )}
      </div>

      {/* Cards List */}
      <div className='flex flex-wrap gap-3 mt-3 lg:mt-12 justify-center'>
        {currentCardsList.slice(0, articleNum).map((item) => (
          <ArticleCards
            key={item.id}
            id={item.id}
            title={item.title}
            // label オブジェクトを Supabase のカラムから作成して渡す
            label={{ text: item.label_text, bg: item.label_bg }}
            imageUrl={item.image_url}
            star={item.star}
            leido={false} // 一旦 false
          />
        ))}
      </div>

      {currentCardsList.length > articleNum && (
        <div className='flex justify-center mt-10 cursor-pointer' onClick={handleArticleNum}>
          <div className='w-12 h-12 border border-black rounded-full flex items-center justify-center text-2xl'>+</div>
        </div>
      )}
    </div>
  );
}

export default Articles;
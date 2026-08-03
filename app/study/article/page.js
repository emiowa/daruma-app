"use client";

import ArticleCards from '@/components/study/ArticleCards';
import { useEffect, useRef, useState } from 'react';
import CardData from "@/data/cards.json"
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";


function Articles() {

  const ArticleNum = 12
  const [articleNum, setArticleNum] = useState(ArticleNum)
  const handleArticleNum = () => {
    setArticleNum(prev => prev + ArticleNum)
  }

  const [currentCardsList, setCurrentCardsList] = useState(CardData)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)

  const handleClickFilterToggle = () => {
    setIsFilterOpen(prev => !prev)
  }

  const filterDetail = [
    { id: "0", title: "Por tema", list: ["Cultura", "Viaje", "Comida"] },
    { id: "1", title: "Por nivel de dificultad", list: ["Dificultad baja", "Dificultad media", "Dificultad alta"] },
    { id: "2", title: "Estado", list: ["Leido", "No leido"] }
  ];

  const [selectedList, setSelectedList] = useState(
    filterDetail.map(item => ({
      id: item.id,
      list: []
    }))
  );

  const levelToStar = {
    "Dificultad baja": 1,
    "Dificultad media": 2,
    "Dificultad alta": 3,
  };

  const estadoToText = {
    "Leido": true,
    "No leido": false
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Filter が open 中 ＆ Filter 以外をクリックしたら閉じる
      if (isFilterOpen && filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    let filtered = CardData;
    //tema--------------------------------------------------------------
    const temas = selectedList[0].list;
    if (temas.length > 0) {
      filtered = filtered.filter(card => temas.includes(card.label.text));
    }
    // level------------------------------------------------------------
    const niveles = selectedList[1].list;
    if (niveles.length > 0) {
      const targetStars = niveles.map(n => levelToStar[n]);

      filtered = filtered.filter(card =>
        targetStars.includes(card.star)
      );
    }
    //leido o no -------------------------------------------------------
    const estados = selectedList[2].list;
    if (estados.length > 0) {
      const targetText = estados.map(n => estadoToText[n])
      filtered = filtered.filter(card => targetText.includes(card.leido));
    }
    setCurrentCardsList(filtered);
  }, [selectedList]);

  const toggleListItem = (id, value) => {
    setSelectedList(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const exists = item.list.includes(value);
        return {
          ...item,
          list: exists
            ? item.list.filter(v => v !== value)
            : [...item.list, value]
        };
      })
    );
  };
  const handleClickClear = () => {
    setSelectedList(
      filterDetail.map(item => ({
        id: item.id,
        list: []
      }))
    );
  }

  const handleClickFilterItem = (id, value) => {
    toggleListItem(id, value)
  }
  const Filter = () => {
    return (
      <div className='absolute top-8 -left-5 w-[430px] h-[250px] bg-gray-300 z-40 py-3 px-5'>
        {filterDetail.map((item) => {
          return (
            <div key={item.title} className='pb-5 text-[15px]'>
              <div className='font-bold'>{item.title}:</div>
              <div className='flex mt-1'>
                {item.list.map((i) => {
                  return (
                    <div
                      key={i}
                      className={`mr-4 last:mr-0 border rounded-full border-black py-1 px-2
                        ${selectedList[item.id].list.includes(i)
                          ? "bg-gray-600 text-retroWhite"
                          : "bg-gray-100"
                        }`}
                      onClick={() => { handleClickFilterItem(item.id, i) }}
                    >
                      {i}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        <button className='absolute bottom-2 right-3 bg-main-nav py-1 px-3 text-retroWhite rounded-lg' onClick={() => handleClickClear()}>Borrar</button>
      </div>
    )
  }

  return (

    <>
      <>
        <div className='mt-60 bg-main-retroYellow w-[570px] md:w-[720px] lg:w-[1000px] content md:pt-28 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large relative mx-auto'>
          <div className='text-main-retroBlack font-bold md:text-6xl lg:text-7xl absolute md:-top-16 lg:-top-[75px] md:left-8 space-y-3'>
            <div>き</div>
            <div>じ</div>
          </div>
          <div className='flex absolute -top-8 left-36'>
            <div>Filter</div>
            {isFilterOpen ?
              <SlArrowUp onClick={() => handleClickFilterToggle()} className='ml-6 mt-1' />
              :
              <SlArrowDown onClick={() => handleClickFilterToggle()} className='ml-6 mt-1' />
            }
            {isFilterOpen &&
              <div ref={filterRef}>
                <Filter />
              </div>
            }
          </div>
          <div className='flex flex-wrap gap-3 mt-3 lg:mt-12 justify-center'>
            {
              currentCardsList.slice(0, articleNum).map((item) => (
                <ArticleCards key={item.id} title={item.title} titleRuby={item.titleRuby} id={item.id} label={item.label} imageUrl={item.imageUrl} star={item.star} leido={item.leido} />
              ))
            }
          </div>
          {currentCardsList.length > articleNum &&
            <div className='flex justify-center relative' onClick={() => handleArticleNum()}>
              <div className='md:m-9 md:w-12 md:h-12 border border-solid border-black rounded-full'>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-2xl">
                  +
                </span>
              </div>
            </div>
          }
        </div>
      </>
    </>
  )
}
export default Articles;
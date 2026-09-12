"use client";

import { useParams, useRouter } from 'next/navigation';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { HiArrowPath } from "react-icons/hi2";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ButtonPager from '@/components/buttons/ButtonPager';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/AuthContext'; // ⭕️ useAuth をインポート

function Test() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const { user, authLoading } = useAuth(); // ⭕️ ユーザー情報を取得

  const [article, setArticle] = useState(null);
  const [quizNum, setQuizNum] = useState(0);
  const [result, setResult] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isCorrectCount, setIsCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------------
  // Supabaseから記事とクイズデータを取得
  // -----------------------------------------------------------
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('articles')
        .select('title, quiz_data')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quiz:', error);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  // クイズデータのショートカット
  const quizData = article?.quiz_data || [];
  const total = quizData.length;
  const currentQuiz = quizData[quizNum];

  // -----------------------------------------------------------
  // ⭕️ テスト結果（全問正解で合格）を Supabase に保存・更新する関数
  // -----------------------------------------------------------
  const saveQuizProgress = async (finalCorrectCount) => {
    if (!user || !id) return;

    // 全問正解（全問中の正解数 === 全問題数）の場合のみ合格
    const isPassed = finalCorrectCount === total;

    try {
      const { error } = await supabase
        .from('user_article_progress')
        .upsert({
          user_id: user.id,
          article_id: Number(id),
          quiz_passed: isPassed,
          quiz_score: finalCorrectCount,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,article_id' });

      if (error) {
        console.error("【テスト結果保存失敗】", error.message);
      } else {
        console.log(`【テスト結果保存成功】 正解数: ${finalCorrectCount}/${total} (合格: ${isPassed})`);
      }
    } catch (e) {
      console.error("【通信エラー】", e);
    }
  };

  const handleClickAnswer = (index) => {
    if (isLocked) return;
    setSelectedIndex(index);
    setIsLocked(true);
    if (currentQuiz.correct === index) {
      setIsCorrectCount(prev => prev + 1);
    }
  };

  const handleClickNext = async () => {
    if (selectedIndex === null) return;

    // ⭕️ 回答選択直後に正解数を正確に計算
    const updatedCorrectCount = currentQuiz.correct === selectedIndex
      ? isCorrectCount
      : isCorrectCount; // handleClickAnswer で更新済み

    // 最後の問題が終わった場合
    if (quizNum === total - 1) {
      setResult(true);
      // DBに進捗状況（合格判定）を保存
      await saveQuizProgress(isCorrectCount);
      return;
    }

    setQuizNum(prev => prev + 1);
    setSelectedIndex(null);
    setIsLocked(false);
  };

  const goToArticle = () => {
    router.push(`/study/article/${id}`);
  };

  const goToTest = () => {
    setIsCorrectCount(0);
    setQuizNum(0);
    setResult(false);
    setSelectedIndex(null);
    setIsLocked(false);
  };

  if (authLoading || loading) return <p className="text-center mt-20">Cargando test...</p>;
  if (!article || !article.quiz_data) return <p className="text-center mt-20">Test no encontrado</p>;

  return (
    <div className='flex flex-col items-center '>
      <div className='text-center text-[30px] font-bold'>{article.title.replace(/\[.*?\]/g, '')}</div>

      {/* 進行状況バーと難易度 */}
      <div className='md:mt-10 bg-main-lightBlue w-[570px] lg:w-[1000px] content md:h-[60px] md:px-9 lg:px-6 shadow-large flex items-center justify-between'>
        <div>pregunta {quizNum + 1} / {total}</div>
        <div className="flex w-64">
          {Array.from({ length: total }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1
                ${index <= quizNum ? "bg-main-blue" : "bg-main-mastard"}
                ${index === 0 ? "rounded-l-lg" : ""}
                ${index === total - 1 ? "rounded-r-lg" : ""}
              `}
            ></div>
          ))}
        </div>
        <div className='flex justify-between items-center' >
          <div className="text-sm">Dificultad</div>
          <div className='flex justify-between md:ml-3 text-2xl lg:text-lg text-yellow-500'>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center w-full max-w-[1000px]">
        <Image
          src="/images/daruma_otoshi.png"
          alt="daruma"
          width={350}
          height={150}
          className="object-contain mb-4" />

        {result ? (
          // -------------------------------------- Result -----------------------------------------
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='md:mt-10 bg-main-lightBlue w-full max-w-[600px] content md:h-[220px] p-8 shadow-large flex flex-col items-center justify-center rounded-xl border border-black'>
              <div className='text-[23px] font-bold mb-2'>Resultados</div>

              {/* ⭕️ 全問正解時の合格バッジ表示 */}
              {isCorrectCount === total ? (
                <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold border border-green-500 mb-2">
                  🎓 ¡Aprobado! (全問正解で合格)
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm font-bold border border-gray-300 mb-2">
                  ¡Sigue intentándolo! (全問正解で合格)
                </div>
              )}

              <div className='mt-2 w-full max-w-[300px]'>
                <div className='flex justify-between'>
                  <div>Respuestas correctas:</div>
                  <div className="font-bold text-green-600">{isCorrectCount} / {total}</div>
                </div>
                <div className='flex justify-between mt-2'>
                  <div>Respuestas incorrectas:</div>
                  <div className="font-bold text-red-500">{total - isCorrectCount}</div>
                </div>
              </div>
            </div>

            <div className='flex w-full mt-8 justify-center gap-4'>
              <ButtonPager className="flex items-center bg-main-white hover-float" onClick={goToTest}>
                <HiArrowPath className='mr-2' />
                Volver a intentar
              </ButtonPager>
              <ButtonPager className="flex items-center bg-main-white hover-float" onClick={goToArticle}>
                Finalizar <span className="ml-2">→</span>
              </ButtonPager>
            </div>
          </div>
        ) : (
          // -------------------------------------- Quiz Option --------------------------------------
          <div className='flex flex-col items-center w-full'>
            <div className="text-[22px] font-bold mt-4 text-center">{currentQuiz.question}</div>
            <div className='grid grid-cols-2 w-full gap-4 mt-8'>
              {currentQuiz.choices.map((item, index) => {
                const statusClass = !isLocked
                  ? "bg-main-white text-main-grey"
                  : index === currentQuiz.correct
                    ? "bg-green-300 border-green-500 text-black"
                    : index === selectedIndex
                      ? "bg-red-400 border-red-600 text-white"
                      : "bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed";

                const hoverAnimationClass = !isLocked
                  ? "hover-float shadow-md"
                  : "transition-all duration-300";

                return (
                  <ButtonPager
                    key={index}
                    className={`w-full h-14 ${statusClass} ${hoverAnimationClass}`}
                    onClick={() => handleClickAnswer(index)}
                  >
                    <div className="h-full flex justify-center items-center">
                      <div className='text-center font-bold'>{item}</div>
                    </div>
                  </ButtonPager>
                );
              })}
            </div>
            <div className='flex w-full mt-10 justify-end'>
              <ButtonPager
                className={`flex items-center ${!isLocked ? "bg-gray-200 text-gray-400 cursor-default" : "bg-main-white hover-float shadow-md"}`}
                onClick={handleClickNext}
              >
                Siguiente <span className="ml-4">→</span>
              </ButtonPager>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function UserQuizPage() {
  const [viewMode, setViewMode] = useState('list');
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quiz, setQuiz] = useState(null);
  const [buttons, setButtons] = useState([]);
  const [solvedTargets, setSolvedTargets] = useState([]);
  const [currentExample, setCurrentExample] = useState(null);

  // ドラッグ操作用のState
  const [activeBtn, setActiveBtn] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0, currentX: 0, currentY: 0 });

  // ユーザー固有の識別子（UUID）と、クリア済みのクイズIDリストを管理するState
  const [userGuid, setUserGuid] = useState('');
  const [clearedQuizIds, setClearedQuizIds] = useState([]);

  const imageContainerRef = useRef(null);

  // 1. ページ初期化時にブラウザ固有のユーザーID（Guid）を準備する
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let guid = localStorage.getItem('quiz_user_guid');
      if (!guid) {
        // 簡易的なランダムUUIDの生成
        guid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('quiz_user_guid', guid);
      }
      setUserGuid(guid);
    }
  }, []);

  // 2. 公開済みのクイズ一覧と、Supabaseからこのユーザーのクリア実績を合わせて取得
  const fetchReleasedQuizzesAndClears = async (guid) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();

      // ① クイズ一覧の取得
      const { data: quizzes, error: qError } = await supabase
        .from('animation_quizzes')
        .select('*')
        .lte('published_at', now)
        .order('published_at', { ascending: false });

      if (qError) throw qError;
      setQuizList(quizzes || []);

      // ② Supabaseからこのユーザー（guid）のクリア実績を取得
      if (guid) {
        const { data: clears, error: cError } = await supabase
          .from('quiz_clears')
          .select('quiz_id')
          .eq('user_identifier', guid);

        if (cError) throw cError;
        const clearedIds = clears.map(c => c.quiz_id);
        setClearedQuizIds(clearedIds);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // リスト画面に戻るか、ユーザーIDが決まったらデータを再取得
  useEffect(() => {
    if (viewMode === 'list' && userGuid) {
      fetchReleasedQuizzesAndClears(userGuid);
    }
  }, [viewMode, userGuid]);

  // ★ 全問正解した瞬間にSupabaseにクリア実績を保存する関数
  const saveClearRecord = async (quizId) => {
    if (!userGuid || !quizId) return;

    // すでにローカルのStateにあれば重複保存を防止
    if (clearedQuizIds.includes(quizId)) return;

    try {
      // ① Supabaseに保存（upsertで重複エラーを安全に回避）
      await supabase
        .from('quiz_clears')
        .upsert([{ quiz_id: quizId, user_identifier: userGuid }], { onConflict: 'quiz_id,user_identifier' });

      // ② ローカルのStateも更新して即スタンプがつくようにする
      setClearedQuizIds(prev => [...prev, quizId]);
    } catch (e) {
      console.error('Supabaseへのクリア実績保存に失敗しました:', e);
    }
  };

  // ⭕️ ゲーム開始（ここで前回の残った例文を完璧にリセットします）
  const handleSelectQuiz = (selectedQuiz) => {
    setQuiz(selectedQuiz);
    setButtons([...selectedQuiz.targets].sort(() => Math.random() - 0.5));
    setSolvedTargets([]);
    setCurrentExample(null); // ✨ これを追加！クイズ画面に入る瞬間に前回の例文を消し去る
    setViewMode('play');
  };

  const handleBackToList = () => {
    setQuiz(null);
    setViewMode('list');
  };

  // ドラッグ操作開始
  const handleMouseDown = (btn, e) => {
    const isSolved = quiz.targets.find(t => t.className === btn.className && solvedTargets.includes(t.id));
    if (isSolved) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setActiveBtn(btn);
    setIsDragging(false);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      currentX: e.clientX,
      currentY: e.clientY,
      startX: rect.left,
      startY: rect.top,
      width: rect.width,
      height: rect.height
    });
  };

  // ドラッグ中＆指を離したときの当たり判定判定
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeBtn) return;
      if (!isDragging) setIsDragging(true);
      setDragOffset(prev => ({ ...prev, currentX: e.clientX, currentY: e.clientY }));
    };

    const handleMouseUp = (e) => {
      if (!activeBtn || !quiz || !imageContainerRef.current) return;

      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const btnLeft = dragOffset.currentX - dragOffset.startX - dragOffset.x + dragOffset.startX;
      const btnTop = dragOffset.currentY - dragOffset.startY - dragOffset.y + dragOffset.startY;
      const btnRight = btnLeft + dragOffset.width;
      const btnBottom = btnTop + dragOffset.height;

      quiz.targets.forEach((target) => {
        const targetXPercent = parseFloat(target.x);
        const targetYPercent = parseFloat(target.y);
        const targetX = containerRect.left + (containerRect.width * (targetXPercent / 100));
        const targetY = containerRect.top + (containerRect.height * (targetYPercent / 100));
        const targetRadius = 32;

        const closestX = Math.max(btnLeft, Math.min(targetX, btnRight));
        const closestY = Math.max(btnTop, Math.min(targetY, btnBottom));

        const distanceX = targetX - closestX;
        const distanceY = targetY - closestY;
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        // 正解判定のif文の中
        if (distanceSquared < (targetRadius * targetRadius) && activeBtn.className === target.className) {
          setSolvedTargets(prev => {
            const next = [...prev, target.id];
            if (next.length === quiz.targets.length) {
              saveClearRecord(quiz.id);
            }
            return next;
          });
          setButtons(prev => prev.filter(b => b.className !== activeBtn.className));

          // 正解したオノマトペと例文をStateにセットする
          setCurrentExample({
            word: target.answerText,
            example: target.exampleText || '（例文が登録されていません）'
          });
        }
      });

      setIsDragging(false);
      setActiveBtn(null);
    };

    if (activeBtn) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeBtn, isDragging, quiz, solvedTargets, dragOffset, userGuid, clearedQuizIds]);

  if (loading && viewMode === 'list') {
    return <div style={{ padding: '30px', textAlign: 'center' }}>クイズを読み込み中...</div>;
  }

  // ① クイズ選択リスト画面（右側に小さく画像を表示するリッチなデザイン！）
  if (viewMode === 'list') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1280px', width: '100%', margin: '0 auto', fontFamily: 'sans-serif' }}> {/* 1000px から 1280px に拡大 */}
        <h1 style={{ fontSize: '32px', color: '#1a1a1a', borderBottom: '3px solid #52c41a', paddingBottom: '12px', marginBottom: '15px' }}>
          🎵 オノマトペ クイズ一覧
        </h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '35px' }}>全問正解して合格スタンプを集めよう！</p>

        {quizList.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', marginTop: '60px', fontSize: '16px' }}>公開中のクイズはありません。</p>
        ) : (
          /* 💡 minmaxを 320px から 280px に縮めることで、横幅が広い画面のときにより多くのカードが綺麗に横並びになります */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {quizList.map((item) => {
              const isCleared = clearedQuizIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectQuiz(item)}
                  style={{
                    border: isCleared ? '2px solid #52c41a' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease-in-out',
                    display: 'flex',
                    flexDirection: 'row', // 横並び
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    minHeight: '110px',
                    position: 'relative',
                    overflow: 'hidden',
                    gap: '15px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    if (!isCleared) e.currentTarget.style.borderColor = '#1890ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    if (!isCleared) e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* 💮 クリアスタンプ */}
                  {isCleared && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#f6ffed', border: '1px dashed #52c41a', color: '#52c41a', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px', zIndex: 2 }}>
                      💮 クリア!!
                    </div>
                  )}

                  {/* 左側：テキスト情報 */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingTop: isCleared ? '18px' : '0' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a', fontSize: '18px', lineHeight: '1.4' }}>{item.title}</h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                      <span style={{ fontSize: '12px', color: isCleared ? '#52c41a' : '#64748b', backgroundColor: isCleared ? '#f6ffed' : '#f1f5f9', padding: '3px 8px', borderRadius: '15px', fontWeight: isCleared ? 'bold' : 'normal' }}>
                        {isCleared ? '✨ かんぺき！' : `問題数: ${item.targets.length} 問`}
                      </span>
                      <span style={{ color: isCleared ? '#52c41a' : '#1890ff', fontWeight: 'bold', fontSize: '13px' }}>
                        あそぶ ➔
                      </span>
                    </div>
                  </div>

                  {/* 🖼️ 右側：小さく表示するイラストプレビュー */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.video_url ? (
                      <img
                        src={item.video_url}
                        alt={item.title}
                        style={{
                          width: '75px',
                          height: '75px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #f0f0f0',
                          backgroundColor: '#fafafa',
                          display: 'block'
                        }}
                        draggable="false"
                      />
                    ) : (
                      <div style={{ width: '75px', height: '75px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#ccc' }}>🎨</div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ② クイズプレイ画面
  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={handleBackToList} style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
          ⬅ クイズ一覧に戻る
        </button>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>
          クリア状況: {solvedTargets.length} / {quiz?.targets.length}
        </div>
      </div>

      <h1 style={{ fontSize: '26px', color: '#1f1f1f', marginBottom: '20px' }}>{quiz?.title}</h1>

      <div ref={imageContainerRef} style={{ position: 'relative', width: '100%', backgroundColor: '#f0f2f5', borderRadius: '8px', overflow: 'hidden' }}>
        <img src={quiz?.video_url} alt="Quiz Target" style={{ width: '100%', display: 'block', userSelect: 'none' }} draggable="false" />
        {quiz?.targets.map((target) => {
          const isSolved = solvedTargets.includes(target.id);
          return (
            <div key={target.id} style={{ position: 'absolute', left: target.x, top: target.y, width: '64px', height: '64px', border: isSolved ? '3px solid #52c41a' : 'none', backgroundColor: isSolved ? 'rgba(82, 196, 26, 0.4)' : 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)', zIndex: 10, color: 'white' }}>
              {isSolved ? '✓' : ''}
            </div>
          );
        })}
      </div>

      {/* まだゲームクリアしていない（残りのボタンがある）ときだけ例文ボードを出す */}
      {currentExample && buttons.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '15px 20px',
          backgroundColor: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: '8px',
          animation: 'fadeIn 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🎉</span>
            <strong style={{ color: '#0050b3', fontSize: '18px' }}>「{currentExample.word}」せいかい！</strong>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#002c8c', fontSize: '16px', fontWeight: '500', fontStyle: 'italic' }}>
            使い方: {currentExample.example}
          </p>
        </div>
      )}

      <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>選ぶオノマトペ</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px', minHeight: '50px' }}>
          {buttons.map((btn) => {
            const isActive = activeBtn?.id === btn.id;
            const translateX = isActive ? dragOffset.currentX - dragOffset.startX - dragOffset.x : 0;
            const translateY = isActive ? dragOffset.currentY - dragOffset.startY - dragOffset.y : 0;
            return (
              <div key={btn.id} onMouseDown={(e) => handleMouseDown(btn, e)} style={{ padding: '12px 24px', backgroundColor: '#1890ff', color: 'white', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold', cursor: 'grab', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'inline-block', userSelect: 'none', position: 'relative', zIndex: isActive ? 9999 : 1, transform: `translate(${translateX}px, ${translateY}px)`, transition: isDragging && isActive ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)', pointerEvents: isActive ? 'none' : 'auto' }}>
                {btn.answerText}
              </div>
            );
          })}
          {buttons.length === 0 && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <p style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '20px', margin: '10px 0' }}>🎉 全問正解！すごーい！</p>
              <button onClick={handleBackToList} style={{ backgroundColor: '#52c41a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                ちがうクイズでもあそぶ ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
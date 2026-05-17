"use client"

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UserQuizPage() {
  // 画面モード: 'list' (クイズ選択一覧) または 'play' (ゲーム中)
  const [viewMode, setViewMode] = useState('list');
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 現在選択されてプレイ中のクイズデータ
  const [quiz, setQuiz] = useState(null);
  const [buttons, setButtons] = useState([]);
  const [solvedTargets, setSolvedTargets] = useState([]);

  // ドラッグ操作用のState
  const [activeBtn, setActiveBtn] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0, currentX: 0, currentY: 0 });

  const videoContainerRef = useRef(null);

  // 1. 公開済みのクイズ一覧を取得（現在時刻以前のものをすべて）
  const fetchReleasedQuizzes = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('animation_quizzes')
        .select('*')
        .lte('published_at', now) // ★ 公開日が現在時刻以前（＝公開済み）のデータを取得
        .order('published_at', { ascending: false }); // 新しい順

      if (error) throw error;
      setQuizList(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') {
      fetchReleasedQuizzes();
    }
  }, [viewMode]);

  // クイズが選択された時（ゲーム開始）
  const handleSelectQuiz = (selectedQuiz) => {
    setQuiz(selectedQuiz);
    // ボタンの並び順をランダムシャッフルしてセット
    setButtons([...selectedQuiz.targets].sort(() => Math.random() - 0.5));
    setSolvedTargets([]);
    setViewMode('play');
  };

  // 一覧へ戻る時
  const handleBackToList = () => {
    setQuiz(null);
    setViewMode('list');
  };

  // --- ドラッグ＆ドロップ判定（前回のロジックのまま） ---
  const handleMouseDown = (btn, e) => {
    const isSolved = quiz.targets.find(t => t.className === btn.className && solvedTargets.includes(t.id));
    if (isSolved) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setActiveBtn(btn);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      currentX: e.clientX,
      currentY: e.clientY,
      width: rect.width,
      height: rect.height
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!activeBtn) return;
      setDragOffset(prev => ({ ...prev, currentX: e.clientX, currentY: e.clientY }));
    };

    const handleMouseUp = (e) => {
      if (!activeBtn || !quiz || !videoContainerRef.current) return;

      const containerRect = videoContainerRef.current.getBoundingClientRect();
      const btnLeft = dragOffset.currentX - dragOffset.x;
      const btnTop = dragOffset.currentY - dragOffset.y;
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

        if (distanceSquared < (targetRadius * targetRadius) && activeBtn.className === target.className) {
          setSolvedTargets(prev => [...prev, target.id]);
          setButtons(prev => prev.filter(b => b.className !== activeBtn.className));
        }
      });

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
  }, [activeBtn, quiz, solvedTargets, dragOffset]);

  if (loading && viewMode === 'list') {
    return <div style={{ padding: '30px', textAlign: 'center' }}>クイズを読み込み中...</div>;
  }

  // ----------------------------------------------------
  // ① クイズ選択リスト画面（ゆったり広々デザイン修正版）
  // ----------------------------------------------------
  if (viewMode === 'list') {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '32px', color: '#1a1a1a', borderBottom: '3px solid #1890ff', paddingBottom: '12px', marginBottom: '15px' }}>
          🎵 オノマトペ クイズ一覧
        </h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '35px' }}>挑戦したいクイズのタイトルを選んでね！</p>

        {quizList.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', marginTop: '60px', fontSize: '16px' }}>ただいま公開中のクイズはありません。次の公開をお楽しみに！</p>
        ) : (
          /* ★ 1列の最低幅を280pxに保証し、画面の広さに合わせて2列や3列に自動で可変する魔法のCSS（grid） */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {quizList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectQuiz(item)}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'between',
                  minHeight: '120px' // 横幅に対して潰れないよう、最低限の立体感を確保
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(24, 144, 255, 0.15)'; // ホバー時にクイズカラー（青）の影をふんわり出す
                  e.currentTarget.style.borderColor = '#1890ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#1a1a1a', fontSize: '20px', lineHeight: '1.4' }}>{item.title}</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '15px' }}>
                    問題数: <b>{item.targets.length}</b> 問
                  </span>
                  <span style={{ color: '#1890ff', fontWeight: 'bold', fontSize: '15px' }}>あそぶ ➔</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // ② クイズプレイ画面
  // ----------------------------------------------------
  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>

      {/* 上部ヘッダー（戻るボタンとタイトル） */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button
          onClick={handleBackToList}
          style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
        >
          ⬅ クイズ一覧に戻る
        </button>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>
          クリア状況: {solvedTargets.length} / {quiz.targets.length}
        </div>
      </div>

      <h1 style={{ fontSize: '26px', color: '#1f1f1f', marginBottom: '5px', marginTop: '0' }}>{quiz.title}</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '20px' }}>ボタンを長押しして動かし、動画の正しい場所に重ねてください。</p>

      {/* 動画プレイヤー */}
      <div ref={videoContainerRef} style={{ position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
        <video src={quiz.video_url} autoPlay loop muted style={{ width: '100%', display: 'block' }} />
        {quiz.targets.map((target) => {
          const isSolved = solvedTargets.includes(target.id);
          return (
            <div key={target.id} style={{ position: 'absolute', left: target.x, top: target.y, width: '64px', height: '64px', border: isSolved ? '3px solid #52c41a' : 'none', backgroundColor: isSolved ? 'rgba(82, 196, 26, 0.4)' : 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%, -50%)', zIndex: 10, color: 'white', transition: 'all 0.2s' }}>
              {isSolved ? '✓' : ''}
            </div>
          );
        })}
      </div>

      {/* 下部ボタンエリア */}
      <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>選ぶオノマトペ</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px', minHeight: '50px' }}>
          {buttons.map((btn) => {
            const isDraggingThis = activeBtn?.id === btn.id;
            return (
              <div key={btn.id} onMouseDown={(e) => handleMouseDown(btn, e)} style={{ padding: '12px 24px', backgroundColor: '#1890ff', color: 'white', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold', cursor: 'grab', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'inline-block', userSelect: 'none', position: isDraggingThis ? 'fixed' : 'relative', left: isDraggingThis ? `${dragOffset.currentX - dragOffset.x}px` : 'auto', top: isDraggingThis ? `${dragOffset.currentY - dragOffset.y}px` : 'auto', zIndex: isDraggingThis ? 9999 : 1, pointerEvents: isDraggingThis ? 'none' : 'auto' }}>
                {btn.answerText}
              </div>
            );
          })}
          {buttons.length === 0 && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <p style={{ color: '#52c41a', fontWeight: 'bold', fontSize: '20px', margin: '10px 0' }}>🎉 全問正解！すごーい！</p>
              <button
                onClick={handleBackToList}
                style={{ backgroundColor: '#52c41a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}
              >
                ちがうクイズでもあそぶ ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
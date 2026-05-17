"use client"

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminAnimationPage() {
  const [viewMode, setViewMode] = useState('list');
  const [unreleasedQuizzes, setUnreleasedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- フォーム用のState群 ---
  const [currentId, setCurrentId] = useState(null);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState(null); // プレビュー用、または保存済みのURL
  const [videoFile, setVideoFile] = useState(null); // ★ 生のファイルデータを保持するState
  const [publishedAt, setPublishedAt] = useState('');
  const [targets, setTargets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRefs = useRef([]);

  // 1. 未公開クイズリストを取得
  const fetchUnreleasedQuizzes = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('animation_quizzes')
        .select('*')
        .gt('published_at', now)
        .order('published_at', { ascending: true });

      if (error) throw error;
      setUnreleasedQuizzes(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') {
      fetchUnreleasedQuizzes();
    }
  }, [viewMode]);

  // 新規追加ボタンを押したとき
  const handleCreateNew = () => {
    setCurrentId(null);
    setTitle('');
    setVideoUrl(null);
    setVideoFile(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPublishedAt(tomorrow.toISOString().slice(0, 16));
    setTargets([]);
    setViewMode('form');
  };

  // 編集ボタンを押したとき
  const handleEdit = (quiz) => {
    setCurrentId(quiz.id);
    setTitle(quiz.title);
    setVideoUrl(quiz.video_url); // すでにSupabaseにある本番URLをセット
    setVideoFile(null); // 編集開始時はまだ新しいファイルを選んでいないのでnull
    setPublishedAt(new Date(quiz.published_at).toISOString().slice(0, 16));
    setTargets(quiz.targets);
    setViewMode('form');
  };

  // ★ 動画ファイルが選択された時の処理
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file); // 生のファイルデータをしっかり保存！
      const localUrl = URL.createObjectURL(file); // 画面表示用の仮URL
      setVideoUrl(localUrl);
    }
  };

  // --- 座標・テキストボックス関連の処理 ---
  useEffect(() => {
    if (viewMode === 'form' && targets.length > 0) {
      const lastIndex = targets.length - 1;
      setTimeout(() => {
        if (inputRefs.current[lastIndex]) inputRefs.current[lastIndex].focus();
      }, 50);
    }
  }, [targets.length, viewMode]);

  const handleVideoClick = (e) => {
    if (targets.length >= 5) return;
    const rect = videoRef.current.getBoundingClientRect();
    const percentX = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const percentY = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);

    const newTarget = {
      id: targets.length + 1,
      x: `${percentX}%`,
      y: `${percentY}%`,
      className: `target-${targets.length + 1}`,
      answerText: ''
    };
    setTargets([...targets, newTarget]);
  };

  const handleTextChange = (index, value) => {
    const updated = [...targets];
    updated[index].answerText = value;
    setTargets(updated);
  };

  const handleSave = async () => {
    if (!title.trim() || !publishedAt) {
      alert('タイトルと公開日時を入力してください。');
      return;
    }
    if (!videoUrl) {
      alert('動画をアップロードしてください。');
      return;
    }
    if (targets.length === 0 || targets.some(t => !t.answerText.trim())) {
      alert('すべての座標に擬音語を入力してください。');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalVideoUrl = videoUrl;

      // 💡 新しくファイルが選択されている場合のみ、Supabase Storageへアップロード
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: storageData, error: storageError } = await supabase
          .storage
          .from('quiz-videos')
          .upload(filePath, videoFile);

        if (storageError) throw storageError;

        // 正式な「公開URL」を取得
        const { data: urlData } = supabase
          .storage
          .from('quiz-videos')
          .getPublicUrl(filePath);

        finalVideoUrl = urlData.publicUrl;
      }

      const payload = {
        title,
        video_url: finalVideoUrl, // 確定した本物のURLをデータベースに保存
        published_at: new Date(publishedAt).toISOString(),
        targets
      };

      if (currentId) {
        const { error } = await supabase.from('animation_quizzes').update(payload).eq('id', currentId);
        if (error) throw error;
        alert('クイズを更新しました！');
      } else {
        const { error } = await supabase.from('animation_quizzes').insert([payload]);
        if (error) throw error;
        alert('新しいクイズを登録しました！');
      }
      setViewMode('list');
    } catch (e) {
      console.error(e);
      alert('保存に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ① 一覧（リスト）画面
  if (viewMode === 'list') {
    return (
      <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
          <h2>未公表アニメーション・クイズ一覧</h2>
          <button onClick={handleCreateNew} style={{ backgroundColor: '#2f54eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            ＋ 新規アニメーションを追加
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '40px' }}>読み込み中...</p>
        ) : unreleasedQuizzes.length === 0 ? (
          <p style={{ color: '#999', marginTop: '40px', textAlign: 'center' }}>現在、未公開（公開待ち）のクイズはありません。</p>
        ) : (
          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px' }}>タイトル</th>
                <th style={{ padding: '12px' }}>動画URL</th>
                <th style={{ padding: '12px' }}>公開予定日時</th>
                <th style={{ padding: '12px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {unreleasedQuizzes.map((quiz) => (
                <tr key={quiz.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{quiz.title}</td>
                  <td style={{ padding: '12px', color: '#666', fontSize: '12px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{quiz.video_url}</td>
                  <td style={{ padding: '12px', fontSize: '14px' }}>{new Date(quiz.published_at).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEdit(quiz)} style={{ backgroundColor: '#fff', border: '1px solid #d9d9d9', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      ⚙ 編集する
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // ② 新規追加・編集共通フォーム画面
  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{currentId ? 'クイズの編集' : '新しいクイズの作成'}</h2>
        <button onClick={() => setViewMode('list')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
          キャンセルして戻る
        </button>
      </div>

      {/* 基本情報入力 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>クイズのタイトル</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="例: 台所の音" />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>公開日時</label>
          <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* 隠しファイルインプット */}
      <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      {/* 動画エリアの条件分岐 */}
      {!videoUrl ? (
        <div
          onClick={() => fileInputRef.current.click()}
          style={{
            border: '2px dashed #ccc',
            borderRadius: '8px',
            padding: '60px 40px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer',
            marginBottom: '20px',
            color: '#555'
          }}
        >
          <span style={{ fontSize: '32px' }}>📂</span>
          <p style={{ margin: '10px 0 0 0', fontWeight: 'bold' }}>クイズに使用する動画ファイルを選択してください</p>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>クリックしてPC内の動画ファイルを開く</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>動画内をクリックして的（最大5箇所）を配置してください。</span>
            <button onClick={() => { setVideoUrl(null); setVideoFile(null); setTargets([]); }} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
              動画を選び直す
            </button>
          </div>

          <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={() => setTargets(targets.slice(0, -1))} disabled={targets.length === 0} style={{ padding: '6px 12px' }}>↩ 1個戻る</button>
            <button onClick={() => setTargets([])} disabled={targets.length === 0} style={{ padding: '6px 12px', color: '#ff4d4f' }}>全部クリア</button>
          </div>

          <div style={{ position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
            {/* ★ CORSやブラウザ制限を完全に突破するためのセキュリティ属性を追加 */}
            <video
              ref={videoRef}
              src={videoUrl}
              onClick={handleVideoClick}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
              style={{ width: '100%', display: 'block', cursor: targets.length < 5 ? 'crosshair' : 'not-allowed' }}
            />
            {targets.map((target, index) => (
              <div key={index} style={{ position: 'absolute', left: target.x, top: target.y, width: '24px', height: '24px', backgroundColor: 'rgba(255, 0, 0, 0.8)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', transform: 'translate(-50%, -50%)', zIndex: 10, pointerEvents: 'none' }}>
                {index + 1}
              </div>
            ))}
          </div>

          {/* 擬音語入力 */}
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h3>擬音語の入力</h3>
            {targets.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px' }}>動画をクリックすると入力欄が出ます。</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {targets.map((t, index) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={index}>
                    <span style={{ backgroundColor: 'rgba(255, 0, 0, 0.8)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>{index + 1}</span>
                    <input type="text" ref={(el) => (inputRefs.current[index] = el)} placeholder="例: ジュージュー" value={t.answerText} onChange={(e) => handleTextChange(index, e.target.value)} style={{ flex: 1, padding: '8px 12px' }} />
                  </div>
                ))}
                <button onClick={handleSave} disabled={isSubmitting} style={{ marginTop: '15px', padding: '12px', backgroundColor: '#2f54eb', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isSubmitting ? '保存中...' : currentId ? '変更を保存する（更新）' : 'この内容で新しく登録する'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
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
  const [imageUrl, setImageUrl] = useState(null); // プレビュー用、または保存済みのURL
  const [imageFile, setImageFile] = useState(null); // ★ 生の画像ファイルデータを保持
  const [publishedAt, setPublishedAt] = useState('');
  const [targets, setTargets] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageContainerRef = useRef(null);
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
    setImageUrl(null);
    setImageFile(null);
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
    setImageUrl(quiz.video_url); // カラム名は一旦そのままvideo_urlを流用して画像URLを入れます
    setImageFile(null);
    setPublishedAt(new Date(quiz.published_at).toISOString().slice(0, 16));
    setTargets(quiz.targets);
    setViewMode('form');
  };

  // ★ 画像ファイルが選択された時の処理
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const localUrl = URL.createObjectURL(file); // 画面表示用の仮URL
      setImageUrl(localUrl);
    }
  };

  // --- 座標・テキストボックス関連の処理 ---
  useEffect(() => {
    if (viewMode === 'form' && targets.length > 0) {
      const lastIndex = targets.length - 1;
      setTimeout(() => {
        // ⭕️ `inputRefs.current[lastIndex]` だった部分を名前に合わせて修正
        if (inputRefs.current[`word-${lastIndex}`]) {
          inputRefs.current[`word-${lastIndex}`].focus();
        }
      }, 50);
    }
  }, [targets.length, viewMode]);

  const handleImageClick = (e) => {
    if (targets.length >= 10) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const percentX = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const percentY = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);

    // ⭕️ 修正：その瞬間の時間をミリ秒まで取得して、絶対に被らない一意のIDを作ります
    const uniqueId = Date.now();

    const newTarget = {
      id: uniqueId, // ★ targets.length + 1 から変更
      x: `${percentX}%`,
      y: `${percentY}%`,
      className: `target-${uniqueId}`, // ★ targets.length + 1 から変更
      answerText: '',
      exampleText: ''
    };
    setTargets([...targets, newTarget]);
  };

  const handleTextChange = (index, key, value) => {
    const updated = [...targets];
    updated[index][key] = value; // answerText または exampleText を書き換える
    setTargets(updated);
  };
  // ⭕️ 追加：特定の的を削除し、残った的のIDや番号を 1, 2, 3... と綺麗にリマッピングする関数
  const handleDeleteTarget = (indexToDelete) => {
    // 指定されたインデックス以外の的だけを残す
    const filtered = targets.filter((_, index) => index !== indexToDelete);

    // 残った的のidやclassName、番号を上から順に詰め直す（データの不整合を防ぐため）
    const reordered = filtered.map((target, index) => ({
      ...target,
      id: index + 1,
      className: `target-${index + 1}`
    }));

    setTargets(reordered);
  };
  const handleSave = async () => {
    if (!title.trim() || !publishedAt) {
      alert('タイトルと公開日時を入力してください。');
      return;
    }
    if (!imageUrl) {
      alert('画像をアップロードしてください。');
      return;
    }
    if (targets.length === 0) {
      alert('画像をクリックして、的を1箇所以上配置してください。');
      return;
    }
    if (targets.some(t => !t.answerText.trim() || !t.exampleText?.trim())) {
      alert('すべての座標に擬音語と例文を入力してください。');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // 💡 新しく画像ファイルが選択されている場合、小文字の quiz-videos バケットへアップロード
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: storageData, error: storageError } = await supabase
          .storage
          .from('quiz-videos')
          .upload(filePath, imageFile);

        if (storageError) throw storageError;

        // 正式な公開URLを取得
        const { data: urlData } = supabase
          .storage
          .from('quiz-videos')
          .getPublicUrl(filePath);

        finalImageUrl = urlData.publicUrl;
      }

      const payload = {
        title,
        video_url: finalImageUrl,
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
          <h2>未公表イラスト・クイズ一覧</h2>
          <button onClick={handleCreateNew} style={{ backgroundColor: '#2f54eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            ＋ 新規クイズを追加
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', marginTop: '40px' }}>読み込み中...</p>
        ) : unreleasedQuizzes.length === 0 ? (
          <p style={{ color: '#999', marginTop: '40px', textAlign: 'center' }}>現在、未公開のクイズはありません。</p>
        ) : (
          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px' }}>タイトル</th>
                <th style={{ padding: '12px' }}>画像URL</th>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>クイズのタイトル</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="例: イラストの音" />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>公開日時</label>
          <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

      {!imageUrl ? (
        <div
          onClick={() => fileInputRef.current.click()}
          style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '60px 40px', textAlign: 'center', backgroundColor: '#f9f9f9', cursor: 'pointer', marginBottom: '20px', color: '#555' }}
        >
          <span style={{ fontSize: '32px' }}>🖼️</span>
          <p style={{ margin: '10px 0 0 0', fontWeight: 'bold' }}>クイズに使用する画像ファイルを選択してください</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            {/* ⭕️ 案内テキストを「最大10箇所」に綺麗に修正 */}
            <span style={{ fontSize: '14px', color: '#666' }}>画像内をクリックして的（最大10箇所）を配置してください。</span>
            <button onClick={() => { setImageUrl(null); setImageFile(null); setTargets([]); }} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
              画像を選び直す
            </button>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <button
              onClick={() => {
                if (confirm('配置したすべての的を消去します。よろしいですか？')) {
                  setTargets([]);
                }
              }}
              disabled={targets.length === 0}
              style={{ padding: '6px 14px', color: '#ff4d4f', backgroundColor: '#fff', border: '1px solid #ff4d4f', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🗑️ すべての的をクリア
            </button>
          </div>

          <div ref={imageContainerRef} onClick={handleImageClick} style={{ position: 'relative', width: '100%', backgroundColor: '#f0f2f5', borderRadius: '8px', overflow: 'hidden', cursor: targets.length < 10 ? 'crosshair' : 'not-allowed' }}>
            <img
              src={imageUrl}
              alt="Quiz Preview"
              style={{ width: '100%', display: 'block', userSelect: 'none' }}
              draggable="false"
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
              <p style={{ color: '#999', fontSize: '14px' }}>画像をクリックすると入力欄が出ます。</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* --- 擬音語と例文の入力（240行目付近〜） --- */}
                {/* --- 擬音語と例文の入力（240行目付近〜） --- */}
                {targets.map((t, index) => (
                  /* 💡 削除ボタンを右側に綺麗に並べるため、display: 'flex', flexDirection: 'row' のコンテナで包みます */
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: '6px', padding: '12px' }} key={index}>

                    {/* 左側：入力フォームエリア（幅いっぱいに広げる） */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ backgroundColor: 'rgba(255, 0, 0, 0.8)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                          {index + 1}
                        </span>

                        <input
                          type="text"
                          ref={(el) => (inputRefs.current[`word-${index}`] = el)}
                          placeholder="例: ジュージュー"
                          value={t.answerText}
                          onChange={(e) => handleTextChange(index, 'answerText', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.nativeEvent.isComposing) return;
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              inputRefs.current[`example-${index}`]?.focus();
                            }
                          }}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
                        />
                      </div>

                      <div style={{ paddingLeft: '34px' }}>
                        <input
                          type="text"
                          ref={(el) => (inputRefs.current[`example-${index}`] = el)}
                          placeholder="例: お肉をジュージューと美味しそうに焼く。"
                          value={t.exampleText || ''}
                          onChange={(e) => handleTextChange(index, 'exampleText', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.nativeEvent.isComposing) return;
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              inputRefs.current[`word-${index + 1}`]?.focus();
                            }
                          }}
                          style={{ width: '100%', padding: '6px 12px', fontSize: '14px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #d9d9d9' }}
                        />
                      </div>
                    </div>

                    {/* ⭕️ 右側：この行（的）を消去する個別削除ボタンを追加 */}
                    <button
                      onClick={() => handleDeleteTarget(index)}
                      type="button"
                      style={{
                        backgroundColor: '#fff1f0',
                        border: '1px solid #ff4d4f',
                        color: '#ff4d4f',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        flexShrink: 0 // 画面が狭くなってもボタンがつぶれないように固定
                      }}
                      title="この的を削除"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff4d4f'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff1f0'; e.currentTarget.style.color = '#ff4d4f'; }}
                    >
                      ×
                    </button>
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
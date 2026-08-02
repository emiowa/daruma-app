"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. 記事データを挿入（statusはデフォルトで'draft'）
      const { data: article, error: dbError } = await supabase
        .from('articles')
        .insert([{ title, content }])
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. 画像がある場合、決めたルール通りにアップロード
      if (imageFile && article) {
        // フォルダ名: article_[ID] / ファイル名: main.png
        const filePath = `article_${article.id}/main.png`;

        const { error: uploadError } = await supabase.storage
          .from('articles') // 作成したバケット名
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;
      }

      alert('記事を下書き保存しました！');
      router.push('/admin'); // 一覧に戻る
    } catch (error) {
      alert('エラーが発生しました: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">新規記事作成</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-bold">タイトル</label>
          <input
            type="text"
            className="w-full p-2 border border-black rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">本文</label>
          <textarea
            className="w-full p-2 border border-black rounded h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">アイキャッチ画像 (PNG推奨)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? '保存中...' : '下書きとして保存'}
        </button>
      </form>
    </div>
  );
}
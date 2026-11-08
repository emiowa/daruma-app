
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/AuthContext";

const VocabularyContext = createContext(null);

export function VocabularyProvider({ children }) {
  const { user, authLoading } = useAuth();
  const [allVocabs, setAllVocabs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // 1. ユーザー状態が変わったときの同期処理
  useEffect(() => {
    if (authLoading) return;

    // ログアウトした場合は即座にキャッシュを破棄
    if (!user) {
      setAllVocabs(null);
      setLoading(false);
      return;
    }

    // ログイン済み かつ まだデータ未取得の場合のみ fetch
    if (allVocabs === null) {
      fetchVocabularies();
    }
  }, [user, authLoading]);

  // 2. 単語データのフェッチ処理
  const fetchVocabularies = async () => {
    if (!user) return;
    setLoading(true);
    const now = new Date().toISOString();

    try {
      // 2週間以上経過したアーカイブの削除
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      await supabase
        .from("user_vocabulary_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("level", "archivadas")
        .lt("updated_at", fourteenDaysAgo.toISOString());

      // 公開済み単語の進捗を取得
      const { data, error } = await supabase
        .from("user_vocabulary_progress")
        .select(`
          level,
          vocabularies!inner (
            id,
            palabra,
            hiragana,
            traduccion,
            audio_url,
            published_at
          )
        `)
        .eq("user_id", user.id)
        .lte("vocabularies.published_at", now);

      if (!error && data) {
        const formatted = data.map((item) => ({
          ...item.vocabularies,
          level: item.level,
        }));
        setAllVocabs(formatted);
      } else if (error) {
        console.error("Error fetching vocabs:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. レベル変更（楽観的更新）
  const changeLevel = async (vId, targetLevel) => {
    if (!user || processingId !== null) return;
    setProcessingId(vId);

    // 先に UI を更新
    setAllVocabs((prev) =>
      prev.map((item) => (item.id === vId ? { ...item, level: targetLevel } : item))
    );

    try {
      await supabase
        .from("user_vocabulary_progress")
        .update({ level: targetLevel })
        .eq("user_id", user.id)
        .eq("vocabulary_id", vId);
    } catch (err) {
      console.error(err);
      // 必要に応じてロールバック処理を追加可能
    } finally {
      setProcessingId(null);
    }
  };

  // 4. 削除処理
  const deleteVocabulary = async (vId) => {
    if (!user) return;

    // 先に UI から除外
    setAllVocabs((prev) => prev.filter((item) => item.id !== vId));

    try {
      await supabase
        .from("user_vocabulary_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("vocabulary_id", vId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <VocabularyContext.Provider
      value={{
        allVocabs: allVocabs || [],
        loading: loading || (allVocabs === null && !!user),
        processingId,
        changeLevel,
        deleteVocabulary,
        refresh: fetchVocabularies,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error("useVocabulary must be used within a VocabularyProvider");
  }
  return context;
}
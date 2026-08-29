// app/context/AuthContext.js
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({ user: null, authLoading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // 最初の1回だけ、現在のセッション（ログイン情報）をチェック
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false); // チェックが終わったらローディングを解除
    };

    initializeAuth();

    // ログイン・ログアウトのリアルタイム監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 他のファイルから簡単に呼び出すためのカスタムフック
export const useAuth = () => useContext(AuthContext);
"use client";

import React, { useEffect, useState } from 'react';
import ButtonNav from '../buttons/ButtonNav';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [showNav, setShowNav] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [user, setUser] = useState(null);

  // だるまが「端っこに小さく避難しているか」を管理するState
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // 状態変化の監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // ページを開いた時、すでに避難状態だったらそれを引き継ぐ
    if (typeof window !== 'undefined') {
      const minimized = sessionStorage.getItem('daruma_minimized') === 'true';
      setIsMinimized(minimized);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleClickLogout = async () => {
    const ok = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    if (ok) {
      await supabase.auth.signOut();
    }
  };

  // だるまを端っこに避難させる処理
  const handleMinimizeDaruma = (e) => {
    setIsMinimized(true);
    sessionStorage.setItem('daruma_minimized', 'true');
  };

  // 端っこのだるまをクリックしたら、また中央の特等席に戻す処理
  const handleRestoreDaruma = () => {
    setIsMinimized(false);
    sessionStorage.setItem('daruma_minimized', 'false');
  };

  return (
    <div className="bg-main-background">
      <div className="flex justify-between">

        {/* 💡 パターンA：通常モード（中央の特等席にいるだるま） */}
        {!isMinimized ? (
          <div
            onMouseEnter={() => setShowNav(true)}
            onMouseLeave={() => setShowNav(false)}
            onClick={handleMinimizeDaruma}
            /* ⭕️ className: `hover:-translate-y-1` を削除。
               ホバー時の影を濃くする処理（`hover:drop-shadow-lg`）は残します。 */
            className="fixed p-2 top-0 z-50 w-16 md:w-20 lg:w-28 h-16 md:h-20 lg:h-28 left-1/2 transform -translate-x-1/2 rounded-full bg-main-nav cursor-pointer group transition-all duration-300 ease-out hover:drop-shadow-lg"
            title="端っこに移動"
          >
            <img
              /* ⭕️ image className: `group-hover:rotate-12` と `transition-transform` を追加 */
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 md:w-12 lg:w-20 pointer-events-none transition-transform duration-300 group-hover:rotate-12'
              alt='daruma_icon'
              src='/images/daruma_logo_transparent.png'
            />

          </div>
        ) : (
          /* 💡 パターンB：避難モード（画面の右下で小さく見守るだるま）
             ※避難モードは元々傾くアニメーションが付いていたので、ここはいじりません */
          <div
            onClick={handleRestoreDaruma}
            className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-main-nav shadow-lg cursor-pointer flex items-center justify-center border-2 border-white hover:scale-110 transition-transform duration-200 group"
            title="まんなかに戻す"
          >
            <img
              className='w-8 md:w-10 transform transition-transform duration-300 group-hover:rotate-12'
              alt='daruma_icon_mini'
              src='/images/daruma_logo_transparent.png'
            />
          </div>
        )}

        {/* ナビゲーションメニュー */}
        <nav
          onMouseEnter={() => setShowNav(true)}
          onMouseLeave={() => setShowNav(false)}
          className={`fixed top-0 left-0 w-full flex justify-center h-14 md:h-16 lg:h-24 bg-main-nav shadow-md z-40 transition-transform duration-300 ${hasScrolled && !showNav ? '-translate-y-full' : 'translate-y-0'}`}
        >
          <div className='w-full md:w-[750px] lg:w-[980px] h-16 md:h-16 lg:h-24 flex justify-between items-center p-3'>
            <div>
              <ButtonNav href={"home"} text={"inicio"} className="bg-main-yellow ml-0" />
              <ButtonNav href={"study"} text={"Estudiar"} className="ml-5" />
            </div>
            <div>
              {user ? (
                <div className="flex">
                  <div className="text-white">{user.user_metadata?.name}</div>
                  <button onClick={() => handleClickLogout()} className="text-white ml-5">Salir (Test)</button>
                </div>
              ) : (
                <div>
                  <ButtonNav href={"login"} text={"iniciar sesión"} />
                  <ButtonNav href={"register"} text={"Registrarse"} className={"ml-5 "} />
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
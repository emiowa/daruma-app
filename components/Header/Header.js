"use client";

import React, { useEffect, useState } from 'react';
import ButtonNav from '../buttons/ButtonNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../app/context/AuthContext';

const Header = () => {
  const [showNav, setShowNav] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { user, authLoading } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);

    if (typeof window !== 'undefined') {
      const minimized = sessionStorage.getItem('daruma_minimized') === 'true';
      setIsMinimized(minimized);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClickLogout = async () => {
    const ok = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    if (ok) {
      await supabase.auth.signOut();
    }
  };

  const handleMinimizeDaruma = () => {
    setIsMinimized(true);
    sessionStorage.setItem('daruma_minimized', 'true');
  };

  const handleRestoreDaruma = () => {
    setIsMinimized(false);
    sessionStorage.setItem('daruma_minimized', 'false');
  };

  return (
    <div className="bg-main-background">
      <div className="flex justify-between">

        {/* 💡 1. 上にいる時の大きいだるま */}
        {!isMinimized ? (
          <div
            onClick={handleMinimizeDaruma}
            className="fixed p-2 top-0 z-50 w-16 md:w-20 lg:w-28 h-16 md:h-20 lg:h-28 left-1/2 transform -translate-x-1/2 rounded-full bg-main-nav cursor-pointer group transition-all duration-300 ease-out hover:drop-shadow-lg"
          >
            <img className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 md:w-12 lg:w-20 pointer-events-none transition-transform duration-300 group-hover:rotate-12' alt='daruma_icon' src='/images/daruma_logo_transparent.png' />
          </div>
        ) : (
          /* 💡 2. 右下に退避しているミニだるま */
          <div
            onClick={handleRestoreDaruma}
            onMouseEnter={() => setShowNav(true)}
            className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-main-nav shadow-lg cursor-pointer flex items-center justify-center border-2 border-white hover:scale-110 active:scale-95 transition-transform duration-200 group"
          >
            <img className='w-8 md:w-10 transform transition-transform duration-300 group-hover:rotate-12' alt='daruma_icon_mini' src='/images/daruma_logo_transparent.png' />
          </div>
        )}

        {/* ナビゲーションバー */}
        <nav
          onMouseEnter={() => setShowNav(true)}
          onMouseLeave={() => setShowNav(false)}
          className={`fixed top-0 left-0 w-full flex justify-center h-14 md:h-16 lg:h-24 bg-main-nav shadow-md z-40 transition-transform duration-300 ${hasScrolled && !showNav ? '-translate-y-full' : 'translate-y-0'
            }`}
        >
          <div className='w-full md:w-[750px] lg:w-[980px] h-16 md:h-16 lg:h-24 flex justify-between items-center p-3'>
            <div>
              <ButtonNav href={"home"} text={"inicio"} className="bg-main-yellow ml-0" />
              <ButtonNav href={"study"} text={"Estudiar"} className="ml-5" />
            </div>
            <div>
              {!authLoading && (
                user ? (
                  /* ⭕️ ログイン済みエリアのボタンデザイン調整 */
                  <div className="flex items-center gap-4">
                    <div className="text-white font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/20 select-none text-sm md:text-base">
                      👤 {user.user_metadata?.name}
                    </div>
                    {/* ❌ のっぺりした文字リンクから、ポチポチできる立体的なボタン（Salir）に変更 */}
                    <button
                      onClick={handleClickLogout}
                      className="text-white bg-red-500 border border-black/30 rounded-xl px-4 py-1.5 text-sm font-bold shadow-small cursor-pointer transition-all duration-150 hover:bg-red-600 active:scale-95 active:shadow-none"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  /* ⭕️ 未ログインエリア */
                  <div className="flex">
                    {/* ※ もし ButtonNav コンポーネントの内側に cursor-pointer が入っていなくても、
                        ここで親からしっかりカーソル指マークを強制付与します */}
                    <div className="cursor-pointer">
                      <ButtonNav href={"login"} text={"iniciar sesión"} />
                    </div>
                    <div className="ml-5 cursor-pointer">
                      <ButtonNav href={"register"} text={"Registrarse"} />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
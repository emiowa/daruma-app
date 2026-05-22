"use client";

import React, { useEffect, useState } from 'react';
import ButtonNav from '../buttons/ButtonNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../app/context/AuthContext'; // ⭕️ 追加

const Header = () => {
  const [showNav, setShowNav] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // ⭕️ 修正：自前のセッション取得処理を全削除し、Contextから常に最新の情報を手に入れる
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
        {/* だるまのエリア（省略：変更なし） */}
        {!isMinimized ? (
          <div onClick={handleMinimizeDaruma} className="fixed p-2 top-0 z-50 w-16 md:w-20 lg:w-28 h-16 md:h-20 lg:h-28 left-1/2 transform -translate-x-1/2 rounded-full bg-main-nav cursor-pointer group transition-all duration-300 ease-out hover:drop-shadow-lg">
            <img className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 md:w-12 lg:w-20 pointer-events-none transition-transform duration-300 group-hover:rotate-12' alt='daruma_icon' src='/images/daruma_logo_transparent.png' />
          </div>
        ) : (
          <div onClick={handleRestoreDaruma} className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-main-nav shadow-lg cursor-pointer flex items-center justify-center border-2 border-white hover:scale-110 transition-transform duration-200 group">
            <img className='w-8 md:w-10 transform transition-transform duration-300 group-hover:rotate-12' alt='daruma_icon_mini' src='/images/daruma_logo_transparent.png' />
          </div>
        )}

        <nav onMouseEnter={() => setShowNav(true)} onMouseLeave={() => setShowNav(false)} className={`fixed top-0 left-0 w-full flex justify-center h-14 md:h-16 lg:h-24 bg-main-nav shadow-md z-40 transition-transform duration-300 ${hasScrolled && !showNav ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className='w-full md:w-[750px] lg:w-[980px] h-16 md:h-16 lg:h-24 flex justify-between items-center p-3'>
            <div>
              <ButtonNav href={"home"} text={"inicio"} className="bg-main-yellow ml-0" />
              <ButtonNav href={"study"} text={"Estudiar"} className="ml-5" />
            </div>
            <div>
              {/* ⭕️ 修正：認証チェック中は何も出さず、確定してから表示を切り替える */}
              {!authLoading && (
                user ? (
                  <div className="flex">
                    <div className="text-white">{user.user_metadata?.name}</div>
                    <button onClick={handleClickLogout} className="text-white ml-5">Salir (Test)</button>
                  </div>
                ) : (
                  <div>
                    <ButtonNav href={"login"} text={"iniciar sesión"} />
                    <ButtonNav href={"register"} text={"Registrarse"} className={"ml-5 "} />
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
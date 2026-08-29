"use client";

import React, { useEffect, useState } from 'react';
import ButtonNav from '../buttons/ButtonNav';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../app/context/AuthContext';

const Header = () => {
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      // Cualquier scroll hacia abajo oculta el navbar
      if (window.scrollY > 10) {
        setVisible(false);
      } else {
        // Volvimos arriba del todo
        setVisible(true);
      }
    };

    const handleMouseMove = (e) => {
      // Si el cursor está cerca del borde superior, mostrar navbar
      if (e.clientY < 80) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      subscription.unsubscribe();
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
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[80%] h-14 md:h-16 lg:h-20 border border-main-retroBlack shadow-small
        bg-main-retroBlue rounded-full shadow-lg
        flex items-center justify-between px-6 md:px-10
        transition-all duration-300
        ${visible ? 'opacity-100 -translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}
      `}
    >
      {/* Left links */}
      <div className="flex items-center gap-4">
        <ButtonNav href={"home"} text={"Inicio"} />
        <ButtonNav href={"study"} text={"Estudiar"} />
      </div>

      {/* Center logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <img
          className="w-10 md:w-12 lg:w-16"
          alt="daruma_icon"
          src="/images/daruma_logo_transparent.png"
        />
      </div>

      {/* Right links */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-retroWhite text-sm">{user.user_metadata?.name}</span>
            <button onClick={handleClickLogout} className="text-retroWhite text-sm">
              Salir
            </button>
          </>
        ) : (
          <>
            <ButtonNav href={"login"} text={"Iniciar sesión"} />
            <ButtonNav href={"register"} text={"Registrarse"} />
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/Auth/AuthForm';
import { validatePassword } from "@/lib/validators";
import { supabase } from "@/lib/supabase";

function UpdatePassword() {
  const [isRecoveryValid, setIsRecoveryValid] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 認証状態の変化を監視（メールリンクからの自動ログイン完了を待つ）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setIsRecoveryValid(true);
      }
      setChecking(false);
    });

    // 初期セッションの存在チェック
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsRecoveryValid(true);
      }
      setChecking(false);
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const input = [
    {
      name: "password",
      label: "NUEVA CONTRASEÑA",
      type: "password",
      validate: validatePassword
    }
  ];

  const help = [];

  const handleUpdatePassword = async (values) => {
    try {
      // 1. パスワードを更新する
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password
      });

      if (updateError) {
        console.error("Supabase update password error:", updateError);
        return updateError.message || "No se pudo actualizar la contraseña.";
      }

      // 2. 正常終了したらログアウトしてログイン画面へ
      await supabase.auth.signOut();
      alert("¡Contraseña actualizada con éxito! Por seguridad, inicia sesión con tu nueva contraseña.");
      router.push("/login");

    } catch (err) {
      console.error("Fatal network error:", err);
      return "Error de red. Inténtalo de nuevo.";
    }
  };

  if (checking) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-main-background text-main-grey font-bold'>
        Cargando...
      </div>
    );
  }

  if (!isRecoveryValid) {
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center bg-main-background p-4 text-center'>
        <p className='text-red-500 font-bold mb-4'>
          El enlace ha expirado o no es válido.
        </p>
        <button
          onClick={() => router.push('/forgot-password')}
          className='bg-main-blue text-white px-4 py-2 rounded-xl font-bold'
        >
          Solicitud de restablecimiento
        </button>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex items-center justify-center min-h-[calc(100vh-100px)] bg-main-background'>
      <div className='relative w-[640px] h-[550px]'>
        <img
          alt='daruma_icon'
          src="/images/daruma_logo_transparent.png"
          width={450}
          height={450}
          className='absolute top-8 right-4'
        />
        <div className='absolute w-[400px] h-[510px] border border-black bg-main-lightGrey rounded-2xl shadow-large p-4'>
          <AuthForm
            input={input}
            help={help}
            title={"Nueva contraseña"}
            onSubmit={handleUpdatePassword}
          />
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
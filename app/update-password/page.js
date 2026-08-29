"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/Auth/AuthForm';
import { validatePassword } from "@/lib/validators";
import { supabase } from "@/lib/supabase";

function UpdatePassword() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAndClearSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // パスワードリセットの「証拠リンク（recoveryトークン）」を持たずに、
      // ただ普通にログインしている状態でこのページを踏んだ場合は、バグ防止のためログアウトさせる
      if (session && !window.location.hash.includes("type=recovery")) {
        await supabase.auth.signOut();
        router.refresh();
      }
    };
    checkAndClearSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const input = [
    {
      name: "password",
      label: "NUEVA CONTRASEÑA",
      type: "password",
      validate: validatePassword
    }
  ];

  const help = []; // ここは不要なので空配列

  const handleUpdatePassword = async (values) => {
    try {
      setServerError("");

      // 1. パスワードを更新する
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password
      });

      if (updateError) {
        console.error("Supabase update password error:", updateError);
        setServerError(updateError.message || "No se pudo actualizar la contraseña.");
        return;
      }

      // ⭕️ 【超重要】ここで強制ログアウトを実行！
      // これにより、メールアドレス②の古いセッションや、一時的なログイン状態がすべて綺麗に消滅します。
      await supabase.auth.signOut();

      // 2. ユーザーに通知して、クリーンな状態でログイン画面へ飛ばす
      alert("¡Contraseña actualizada con éxito! Por seguridad, inicia sesión con tu nueva contraseña.");
      router.push("/login");

    } catch (err) {
      console.error("Fatal network error:", err);
      setServerError("Error de red. Inténtalo de nuevo.");
    }
  };

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
            apiError={serverError}
          />
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
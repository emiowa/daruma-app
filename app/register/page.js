"use client";

import AuthForm from '@/components/Auth/AuthForm';
import {
  validateName,
  validateEmail,
  validatePassword
} from "@/lib/validators";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { useState } from 'react';

function Registrarse() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const input = [
    {
      name: "name",
      label: "USER NAME",
      type: "text",
      validate: validateName
    },
    {
      name: "email",
      label: "EMAIL",
      type: "email",
      validate: validateEmail
    },
    {
      name: "password",
      label: "CONTRASEÑA",
      type: "password",
      validate: validatePassword
    }
  ];

  const help = [{ text: "Ya tengo una cuenta", link: "/login" }];

  const handleRegister = async (values) => {
    try {
      setServerError(""); // ⚡️ リクエスト前に前の方のエラーを綺麗にクリアする

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name
          }
        }
      });
      // TODO リリース前に必ず削除する。
      if (error) {
        console.error("Supabase signUp error:", error);

        // ⭕️ 修正：エラーメッセージの内容に応じて、親切なスペイン語に翻訳してセット
        if (error.message.includes("already registered")) {
          setServerError("Este correo ya está registrado.");
        } else if (error.status === 422 || error.message.includes("rate limit") || error.message.includes("security")) {
          // 🔒 422制限やセキュリティブロックを検知したとき
          setServerError("Por seguridad, espera unos minutos antes de intentar otra vez.");
        } else {
          // その他の予期せぬエラーは、Supabaseの生のメッセージ（英語）をそのまま出して開発しやすくする
          setServerError(error.message || "Ocurrió un error. Inténtalo de nuevo.");
        }
        return;
      }

      // サインアップ成功時
      router.push("/register-success");

    } catch (err) {
      console.error("Fatal network error:", err);
      setServerError("Error de red. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <div className='w-full h-full mt-36 flex items-center justify-center min-h-[calc(100vh-100px)]'>
        <div className='relative w-[640px] h-[550px]'>
          <img
            alt='daruma_icon'
            src="/images/daruma_logo_transparent.png"
            width={450}
            height={450}
            className='absolute top-8'
            style={{ 
              imageRendering: 'pixelated',  // Essential for sharp pixel art
            }}
          />
          <div className='absolute  right-4  w-[400px] h-[510px] border border-black bg-main-retroGreen rounded-2xl shadow-large p-4'>
            <AuthForm
              input={input}
              help={help}
              title={"Registrarse"}
              onSubmit={handleRegister}
              apiError={serverError} // 💡 ここで確実に連携
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Registrarse;
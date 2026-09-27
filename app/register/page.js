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
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name
          }
        }
      });

      if (error) {
        console.error("Supabase signUp error:", error);
        const msg = (error.message || "").toLowerCase();

        // ⭕️ 修正：setServerErrorではなく、エラーメッセージの文字列を直接 return する
        if (msg.includes("already registered") || msg.includes("already exists")) {
          return "Este correo ya está registrado.";
        } else if (error.status === 422 || msg.includes("rate limit") || msg.includes("security")) {
          return "Por seguridad, espera unos minutos antes de intentar otra vez.";
        } else {
          return error.message || "Ocurrió un error. Inténtalo de nuevo.";
        }
      }

      // サインアップ成功時
      router.push("/register-success");

    } catch (err) {
      console.error("Fatal network error:", err);
      return "Error de red. Inténtalo de nuevo.";
    }
  };

  return (
    <>
      <div className='w-full h-full flex items-center justify-center min-h-[calc(100vh-100px)]'>
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
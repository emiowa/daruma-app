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
  const help = [{ text: "Ya tengo una cuenta", link: "/login" }]
  const router = useRouter();

  const handleRegister = async (values) => {
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
      // エラーメッセージを日本語（またはスペイン語）に翻訳してセット
      if (error.message.includes("already registered")) {
        setServerError("Este correo ya está registrado.");
      } else {
        setServerError("Ocurrió un error. Inténtalo de nuevo.");
      }
      return;
    }
    router.push("/register-success");
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
              apiError={serverError}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default Registrarse;
"use client";

import AuthForm from '@/components/Auth/AuthForm';
import { useRouter } from 'next/navigation';
import {
  validateEmail,
  validatePassword
} from "@/lib/validators";
import { supabase } from "@/lib/supabase";
import React from 'react';

function Login() {
  const input = [
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
  const help = [
    { text: "¿Olvidaste tu contraseña?", link: "/forgot-password" },
    { text: "Soy un usuario nuevo", link: "/register" }
  ];
  const title = "Iniciar sesión";
  const router = useRouter();

  const handleLogin = async (values) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });

    if (error) {
      console.log(error.message);
      if (error.message === "Invalid login credentials") {
        return "El correo o la contraseña son incorrectos.";
      } else {
        return "Ocurrió un error al intentar iniciar sesión.";
      }
    }

    router.push("/home");
  };

  return (
    <div className='w-full h-full mt-36 flex items-center justify-center min-h-[calc(100vh-100px)]'>
      <div className='relative w-[640px] h-[550px]'>
        <img
          alt='daruma_icon'
          src="/images/daruma_logo_transparent.png"
          width={450}
          height={450}
          className='absolute top-8 right-4'
          style={{
            imageRendering: 'pixelated',
          }}
        />
        <div className='absolute w-[400px] h-[510px] border border-black bg-main-retroGreen rounded-2xl shadow-large p-4'>
          <AuthForm
            input={input}
            help={help}
            title={title}
            onSubmit={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
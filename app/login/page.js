
"use client";

import AuthForm from '@/components/Auth/AuthForm';
import { useRouter } from 'next/navigation';
import {
  validateEmail,
  validatePassword
} from "@/lib/validators";
// import "../styles/globals.css"
import { supabase } from "@/lib/supabase";
import React, { useState } from 'react';

function Login() {
  const [serverError, setServerError] = useState("");
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
  const help = [{ text: "¿Olvidaste tu contraseña?", link: "/" }, { text: "Soy un usuario nuevo", link: "/registrarse" }]
  const title = "Iniciarsession"
  const router = useRouter();

  const handleLogin = async (values) => {

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password
    });
    if (error) {
      console.log(error.message);
      if (error.message === "Invalid login credentials") {
        setServerError("El correo o la contraseña son incorrectos.");
      } else {
        setServerError("Ocurrió un error al intentar iniciar sesión.");
      }
      return;
    }
    router.push("/home");
  };

  return (
    <>
      <div className='pt-32 pl-12 w-full h-full'>
        <div className='relative '>
          <img
            alt='daruma_icon'
            src="/images/daruma_logo_transparent.png"
            width={450}
            height={450}
            className='absolute top-8 right-12'
          />
          <div className='absolute w-[400px] h-[510px] border border-black bg-main-lightGrey rounded-2xl shadow-large p-4'>
            <AuthForm
              input={input}
              help={help}
              title={title}
              onSubmit={handleLogin}
              apiError={serverError}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default Login;
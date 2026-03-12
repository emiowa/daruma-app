
"use client";

import AuthForm from '@/components/Auth/AuthForm';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import {
  validateEmail,
  validatePassword
} from "@/lib/validators";
// import "../styles/globals.css"
import { supabase } from "@/lib/supabase";

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
      return;
    }
    router.push("/home");
  };
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />        <title >study</title>
        <meta name='description' content='私たちはグラン戸田住人' />
      </Head>
      <div className='pt-32 pl-12 w-full h-full'>
        <div className='relative '>
          <img
            alt='daruma_icon'
            src="/images/daruma_logo_transparent.png"
            width={450}
            height={450}
            className='absolute top-3 right-12'
          />
          <div className='absolute w-[380px] h-[480px] border border-black bg-main-lightGrey rounded-2xl shadow-large p-4'>
            <AuthForm
              input={input}
              help={help}
              title={title}
              onSubmit={handleLogin} />
          </div>
        </div>
      </div>
    </>
  )
}
export default Login;
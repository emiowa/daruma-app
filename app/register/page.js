"use client";

import AuthForm from '@/components/Auth/AuthForm';
import Head from 'next/head';
import {
  validateName,
  validateEmail,
  validatePassword
} from "@/lib/validators";
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";

function Registrarse() {

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
      console.error("Error Code:", error.status);
      console.error("Error Message:", error.message);
      return;
    }
    console.log("Success! User ID:", data.user.id);
    router.push("/register-success");
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
            className='absolute top-3'
          />
          <div className='absolute  right-12 w-[380px] h-[480px] border border-black bg-main-lightGrey rounded-2xl shadow-large p-4'>
            <AuthForm
              input={input}
              help={help}
              title={"Registrarse"}
              onSubmit={handleRegister} />
          </div>
        </div>
      </div>
    </>
  )
}
export default Registrarse;
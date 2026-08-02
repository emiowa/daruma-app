"use client";

import React, { useState } from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import { validateEmail } from "@/lib/validators";
import { supabase } from "@/lib/supabase";

function ForgotPassword() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const input = [
    {
      name: "email",
      label: "EMAIL",
      type: "email",
      validate: validateEmail
    }
  ];

  const help = [
    { text: "Volver al inicio de sesión", link: "/login" }
  ];

  const handleResetRequest = async (values) => {
    try {
      setServerError("");
      setSuccessMessage("");

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        // 💡 ユーザーがメールのリンクを踏んだ後に飛ばす「新しいパスワード入力画面」のURLを指定します
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        console.error("Supabase reset password error:", error);
        // レートリミット等のエラーに対応
        if (error.status === 422 || error.message.includes("rate limit")) {
          setServerError("Por seguridad, espera unos minutos antes de intentar otra vez.");
        } else {
          setServerError(error.message || "Ocurrió un error. Inténtalo de nuevo.");
        }
        return;
      }

      // 成功したらメッセージを表示
      setSuccessMessage("¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.");

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
        <div className='absolute w-[400px] h-[510px] border border-black bg-main-lightGrey rounded-2xl shadow-large p-4 flex flex-col justify-center'>

          {/* ⭕️ 送信成功時の親切なメッセージ表示 */}
          {successMessage ? (
            <div className="flex flex-col items-center text-center p-5 error-animation">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-xl font-bold text-main-grey mb-3">¡Email Enviado!</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {successMessage}
              </p>
              <a
                href="/login"
                className="inline-block text-blue-500 text-sm border-b border-blue-400 hover:text-blue-600 transition-all"
              >
                Volver al inicio de sesión
              </a>
            </div>
          ) : (
            <AuthForm
              input={input}
              help={help}
              title={"Restablecer contraseña"}
              onSubmit={handleResetRequest}
              apiError={serverError}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
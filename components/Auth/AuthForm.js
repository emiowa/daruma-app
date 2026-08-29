"use client";

import React, { useState, useEffect } from 'react';
import ButtonInicio from '../buttons/ButtonInicio';

const AuthForm = ({ input = [], help = [], title, onSubmit, apiError }) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // APIエラー（Supabase側）が届いたときの徹底的なマージ処理
  useEffect(() => {
    if (apiError) {
      if (typeof apiError === 'object' && apiError.name && apiError.message) {
        // 項目に紐付けられるエラー（例: email重複など）
        setErrors((prev) => ({
          ...prev,
          [apiError.name]: apiError.message,
        }));
      } else if (typeof apiError === 'string') {
        // 文字列の全体エラー（例: 422ブロックや400パスワード間違いなど）
        setErrors((prev) => ({
          ...prev,
          form: apiError,
        }));
      } else {
        // 想定外のオブジェクト（Errorオブジェクト単体など）が来た場合の安全ガード
        setErrors((prev) => ({
          ...prev,
          form: apiError.message || "Ocurrió un error inesperado.",
        }));
      }
    }
  }, [apiError]);

  const handleChange = (key, newValue) => {
    setValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: "",
      form: "", // ユーザーが文字入力を始めたら全体エラーも綺麗に消去する親切設計
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. まずはフロント側でバリデーションをかける（API通信の無駄撃ちを徹底ガード）
    input.forEach((item) => {
      const value = values[item.name] || "";
      if (item.validate) {
        newErrors[item.name] = item.validate(value) || "";
      }
    });

    setErrors(newErrors);

    // 2. 1つでも入力エラーがあれば、ここで処理をストップ（Supabaseには送らない）
    const isValid = Object.values(newErrors).every((err) => err === "");
    if (!isValid) return;

    // 3. フロントがすべてOKならAPIリクエストを実行
    setIsLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      console.error("Submission error in AuthForm:", err);
      setErrors((prev) => ({
        ...prev,
        form: "Error de conexión con el servidor.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center p-5'>
      {/* エラーメッセージ用カスタムぷるぷるアニメーション */}
      <style>{`
        @keyframes errorPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .error-animation {
          animation: errorPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* フォームのメインタイトル */}
      <div className='text-[24px] font-bold text-main-grey mb-4'>{title}</div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Inputs（入力欄のループ表示） */}
        {input.map((item) => (
          <div key={item.name} className="flex flex-col mb-3">
            <label className="text-sm font-bold mb-1 text-gray-600 pl-1">{item.label}</label>
            <input
              type={item.type}
              placeholder={item.label}
              className="border border-gray-300 p-2 w-80 rounded shadow-sm outline-none transition-all duration-200 focus:border-main-blue focus:ring-2 focus:ring-blue-100 focus:scale-[1.01] disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={values[item.name] || ""}
              onChange={(e) => handleChange(item.name, e.target.value)}
              disabled={isLoading}
            />
            {/* 個別のバリデーションエラー用span */}
            <span className="text-red-500 text-sm h-5 pt-0.5 pl-1 font-medium">
              {errors[item.name] && (
                <span className="inline-block error-animation">
                  ⚠️ {errors[item.name]}
                </span>
              )}
            </span>
          </div>
        ))}

        {/* ⭕️ 送信ボタンと全体エラーを管理するコンテナ
            親要素に relative を付与し、かつ上部に pt-6 の隙間を空けておくことで
            absolute指定のエラー文がボタンの真上に絶対に崩れずカチッと固定されます */}
        <div className="relative pt-6 mt-2">

          {/* ⚡️ Supabase等から返ってきた全体エラー（422リミット制限など）をボタンのすぐ上に配置 */}
          <div className="text-red-500 absolute -top-1 left-0 text-sm h-5 pl-1 font-medium w-80 select-none">
            {errors.form && (
              <span className="inline-block error-animation">
                ⚠️ {errors.form}
              </span>
            )}
          </div>

          {/* 送信ボタン */}
          <ButtonInicio
            type="submit"
            text={isLoading ? "Cargando..." : title}
            className="bg-main-yellow text-white p-2 md:p-3 w-full rounded-xl font-bold shadow-small hover-float active:scale-[0.98] active:shadow-none transition-all duration-150"
            disabled={isLoading}
          />
        </div>

        {/* Help links（パスワード忘れや新規登録へのリンク） */}
        <div className="mt-4 space-y-2">
          {help.map((item) => (
            <div key={item.text} className="w-full pl-1">
              <a
                href={item.link}
                className="inline-block text-blue-500 text-sm border-b border-blue-400 transition-all duration-200 hover:text-blue-600 hover:translate-x-0.5"
              >
                {item.text}
              </a>
            </div>
          ))}
        </div>

      </form>
    </div>
  )
}

export default AuthForm;
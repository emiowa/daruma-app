"use client";

import React from 'react';
import { useState } from 'react';
import ButtonInicio from '../buttons/ButtonInicio';

const AuthForm = ({ input = [], help = [], title, onSubmit, apiError }) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, newValue) => {
    setValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    input.forEach((item) => {
      const value = values[item.name] || "";
      if (item.validate) {
        newErrors[item.name] = item.validate(value);
      }
    });
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((err) => err === "");
    if (!isValid) return;
    setIsLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center p-5'>
      {/* ⭕️ エラーメッセージが「ぷるっ」と出るカスタムアニメーションを注入 */}
      <style>{`
        @keyframes errorPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .error-animation {
          animation: errorPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      <div className='text-[24px] font-bold mb-6 text-main-grey'>{title}</div>
      <form onSubmit={handleSubmit} noValidate>

        {/* Inputs */}
        {input.map((item) => (
          <div key={item.name} className="flex flex-col mb-3">
            <label className="text-sm font-bold mb-1 text-gray-600 pl-1">{item.label}</label>
            <input
              type={item.type}
              placeholder={item.label}
              /* ⭕️ 修正：focus時のアニメーションを追加。青く光りながら手前に少し膨らみます */
              className="border border-gray-300 p-2 w-80 rounded shadow-sm outline-none transition-all duration-200 focus:border-main-blue focus:ring-2 focus:ring-blue-100 focus:scale-[1.01] disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={values[item.name] || ""}
              onChange={(e) => handleChange(item.name, e.target.value)}
              disabled={isLoading}
            />
            {/* ⭕️ 修正：エラー時に文字がぷるっと浮き出るように変更 */}
            <span className="text-red-500 text-sm h-5 pt-0.5 pl-1 font-medium">
              {errors[item.name] && (
                <span className="inline-block error-animation">
                  ⚠️ {errors[item.name]}
                </span>
              )}
            </span>
          </div>
        ))}

        {apiError && (
          /* ⭕️ 修正：APIエラーも少しバウンスして出現 */
          <div className="bg-red-50 border border-red-300 text-red-600 px-3 py-2 rounded text-sm w-80 error-animation font-medium mb-3">
            💥 {apiError}
          </div>
        )}

        {/* Help links */}
        {help.map((item) => (
          <div key={item.text} className="w-full mb-2 pl-1">
            <a
              href={item.link}
              /* ⭕️ 修正：ホバーした時に少し文字が右に動く、親切なインタラクション */
              className="inline-block text-blue-500 text-sm border-b border-blue-400 transition-all duration-200 hover:text-blue-600 hover:translate-x-0.5"
            >
              {item.text}
            </a>
          </div>
        ))}

        {/* ⭕️ 修正：ボタンにhover-floatと、クリック時のポチッと凹む動き(active)を追加 */}
        <ButtonInicio
          type="submit"
          text={isLoading ? "Cargando..." : title}
          className="bg-main-yellow text-white mt-5 p-2 md:p-3 w-full rounded-xl font-bold shadow-small hover-float active:scale-[0.98] active:shadow-none transition-all duration-150"
          disabled={isLoading}
        />
      </form>
    </div>
  )
}

export default AuthForm;
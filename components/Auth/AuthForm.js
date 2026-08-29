"use client";

import React, { useState } from 'react';
import ButtonInicio from '../buttons/ButtonInicio';

const AuthForm = ({ input = [], help = [], title, onSubmit }) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, newValue) => {
    setValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [key]: "",
      form: "", // 入力変更時に全体エラーも消去
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // 1. フロント側のバリデーション
    input.forEach((item) => {
      const value = values[item.name] || "";
      if (item.validate) {
        newErrors[item.name] = item.validate(value) || "";
      }
    });

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((err) => err === "");
    if (!isValid) return;

    // 2. 親の handleLogin を呼び出し
    setIsLoading(true);
    try {
      const errorMessage = await onSubmit(values);

      // 親からエラー文字列が返ってきた場合はそれを表示
      if (errorMessage) {
        setErrors((prev) => ({
          ...prev,
          form: errorMessage,
        }));
      }
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
      <style>{`
        @keyframes errorPop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .error-animation {
          animation: errorPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      <div className='text-[24px] font-bold text-main-grey mb-4'>{title}</div>

      <form onSubmit={handleSubmit} noValidate>
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
            <span className="text-red-500 text-sm h-5 pt-0.5 pl-1 font-medium">
              {errors[item.name] && (
                <span className="inline-block error-animation">
                  ⚠️ {errors[item.name]}
                </span>
              )}
            </span>
          </div>
        ))}

        <div className="relative pt-6 mt-2">
          <div className="text-red-500 absolute -top-1 left-0 text-sm h-5 pl-1 font-medium w-80 select-none">
            {errors.form && (
              <span className="inline-block error-animation">
                ⚠️ {errors.form}
              </span>
            )}
          </div>

          <ButtonInicio
            type="submit"
            text={isLoading ? "Cargando..." : title}
            className="bg-main-yellow text-white p-2 md:p-3 w-full rounded-xl font-bold shadow-small hover-float active:scale-[0.98] active:shadow-none transition-all duration-150"
            disabled={isLoading}
          />
        </div>

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
  );
};

export default AuthForm;
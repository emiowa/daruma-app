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
    <div className='flex flex-col items-center  p-5'>
      <div className='text-[24px] mb-6'>{title}</div>
      <form onSubmit={handleSubmit} noValidate>

        {/* Inputs */}
        {input.map((item) => (
          <div key={item.name} className="flex flex-col mb-2">
            <label>{item.label}</label>
            <input
              type={item.type}
              placeholder={item.label}
              className="border p-1 w-80 rounded disabled:bg-gray-200"
              value={values[item.name] || ""}
              onChange={(e) => handleChange(item.name, e.target.value)}
              disabled={isLoading}
            />
            <span className="text-red-500 text-sm h-5">
              {errors[item.name] || ""}
            </span>
          </div>
        ))}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-2 py- rounded text-sm w-80">
            {apiError}
          </div>
        )}

        {/* Help links */}
        {help.map((item) => (
          <div key={item.text} className="w-full mb-1">
            <a
              href={item.link}
              className="text-blue-500 text-sm mt-1 border-b-[1px] border-blue-500 mb-4"
            >
              {item.text}
            </a>
          </div>
        ))}
        <ButtonInicio
          type="submit"
          text={isLoading ? "Cargando..." : title}
          className="bg-main-yellow text-white mt-5 p-1 md:p-2 lg:p-3 content "
          disabled={isLoading}
        />
      </form>
    </div>
  )
}


export default AuthForm;
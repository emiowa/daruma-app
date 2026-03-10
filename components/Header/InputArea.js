"use client";

import React from 'react';
import { useState } from 'react';
import ButtonInicio from '../buttons/ButtonInicio';
import { useRouter } from 'next/navigation';


const InputArea = ({ input, help, title }) => {
  const router = useRouter();
  const detail = {
    input: [...input],
    help: [...help]
  }

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [values, setValues] = useState({});
  const handleChange = (key, newValue) => {
    setValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const validateEmail = (value = "") => {
    const v = value.trim();
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (v.length === 0) {
      return "ingrese su correo.";
    }
    if (!regex.test(v)) {
      return "ingrese el correo correcto.";
    }
    return "";
  };

  const validatePassword = (value = "") => {
    const v = value;
    if (v.length === 0) {
      return "ingrese su contrasena.";
    }
    if (v.length < 6) {
      return "ingrese una contrasena de 6-20 caracteres.";
    }
    return "";
  };

  const validateName = (value = "") => {
    const v = value.trim();
    const regex = /^[ぁ-んァ-ン一-龥A-Za-z]+$/;
    if (v.length === 0) {
      return "ingrese un nombre.";
    }
    if (!regex.test(v)) {
      return "solo letras permitidas.";
    }
    return "";
  };

  const validators = {
    email: validateEmail,
    password: validatePassword,
    name: validateName
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    input.forEach((item) => {
      const value = values[item.name] || "";
      if (validators[item.name]) {
        newErrors[item.name] = validators[item.name](value);
      }
    });
    setErrors(newErrors);
    const isValid = Object.values(newErrors).every((err) => err === "");
    if (isValid && title === "Registrarse") {
      router.push("/register-success");
    } if (isValid && title === "Iniciarsession") {
      router.push("/home");
    }
  };


  return (
    <div className='flex flex-col items-center  p-5'>
      <div className='text-[24px] mb-6'>{title}</div>
      <form onSubmit={handleSubmit} noValidate>

        {/* Inputs */}
        {detail.input.map((item) => (
          <div key={item.name} className="flex flex-col mb-2">
            <label>{item.name}</label>
            <input
              type={item.type}
              placeholder={item.name}
              className="border p-1 w-80 rounded"
              value={values[item.name] || ""}
              onChange={(e) => handleChange(item.name, e.target.value)}
            />
            {item.InputArea}
            <span className="text-red-500 text-sm h-5">
              {errors[item.name]}
            </span>
          </div>
        ))}

        {/* Help links */}
        {detail.help.map((item) => (
          <div key={item.text} className="w-full mb-1">
            <a
              href={item.link}
              className="text-blue-500 text-sm mt-1 border-b-[1px] border-blue-500 mb-4"
            >
              {item.text}
            </a>
          </div>
        ))}

        <ButtonInicio type="submit" text={title} className="bg-main-yellow text-white mt-5" />
      </form>
    </div>
  )
}


export default InputArea;
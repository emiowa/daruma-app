
import React from 'react';
import ButtonNav from '@/components/buttons/ButtonNav';

const InputArea = ({ input, help, title }) => {
  const detail = {
    input: [...input],
    help: [...help]
  }

  return (
    <div className='flex flex-col items-center  p-5'>
      <div className='text-[24px] mb-6'>{title}</div>
      {/* Inputs */}
      {detail.input.map((item) => (
        <div key={item} className="flex flex-col mb-2">
          <label>{item}</label>
          <input
            type={item === "CONTRASEÑA" ? "password" : "text"}
            placeholder={item}
            className="border p-1 w-80 mb-4 rounded"
          />
        </div>
      ))}

      {/* Help links */}
      {detail.help.map((item) => (
        <div key={item} className="w-full mb-1">
          <a
            href="#"
            className="text-blue-500 text-sm mt-1 border-b-[1px] border-blue-500 mb-4"
          >
            {item}
          </a>
        </div>
      ))}

      <ButtonNav href={"home"} text={"Iniciar Sesion"} className="bg-main-yellow text-white mt-5" />
    </div>
  )
}


export default InputArea;
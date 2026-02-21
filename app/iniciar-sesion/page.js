
import ButtonNav from '@/components/buttons/ButtonNav';
import ButtonPager from '@/components/buttons/ButtonPager';
import Head from 'next/head';
// import "../styles/globals.css"

function Iniciarsession() {


  const InputArea = () => {
    const detail = {
      input: ["Email", "Contraseña"],
      help: ["¿Olvidaste tu contraseña?", "Soy un usuario nuevo"]
    }

    return (
      <div className='flex flex-col items-center  p-5'>
        <div className='text-[24px] mb-14'>INICIAR SESION</div>
        {/* Inputs */}
        {detail.input.map((item) => (
          <div key={item} className="flex flex-col mb-2">
            <label>{item}</label>
            <input
              type={item === "Contraseña" ? "password" : "text"}
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
            <InputArea />
          </div>
        </div>
      </div>
    </>
  )
}
export default Iniciarsession;
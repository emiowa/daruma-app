

import ButtonPager from '@/components/buttons/ButtonPager';
import InputArea from '@/components/Header/InputArea';
import Head from 'next/head';
// import "../styles/globals.css"

function Registrarse() {
  const input = ["NOMBRE COMPLETO", "EMAIL", "CONTRASEÑA"]
  const help = ["Ya tengo una cuenta"]
  const title = "Registrarse"
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
            className='absolute top-3'
          />
          <div className='absolute  right-12 w-[380px] h-[480px] border border-black bg-main-lightGrey rounded-2xl shadow-large p-4'>
            <InputArea input={input} help={help} title={title} />
          </div>
        </div>
      </div>
    </>
  )
}
export default Registrarse;
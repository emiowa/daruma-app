
import ButtonNav from '@/components/buttons/ButtonNav';
import ButtonPager from '@/components/buttons/ButtonPager';
import InputArea from '@/components/Header/InputArea';
import Head from 'next/head';
// import "../styles/globals.css"

function Iniciarsession() {
  const input = ["EMAIL", "CONTRASEÑA"]
  const help = ["¿Olvidaste tu contraseña?", "Soy un usuario nuevo"]
  const title = "Iniciarsession"
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
            <InputArea input={input} help={help} title={title} />
          </div>
        </div>
      </div>
    </>
  )
}
export default Iniciarsession;
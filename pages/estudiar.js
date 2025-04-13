
import Head from 'next/head';
import { IoEyeOutline, IoBookOutline } from "react-icons/io5";
import { VscFlame } from "react-icons/vsc";
import { AiOutlineSound } from "react-icons/ai";
import { MdTranslate } from "react-icons/md";
import Image from 'next/image';


function Estudiar() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >Estudiar</title>
        <meta name='description' content='私たちはグラン戸田住人' />
      </Head>
      <div className='w-full' >
        <div className='flex justify-center h-56'>
          <div className='bg-[#F26749] w-[240px] content shadow-large pt-10 px-3 pb-4 flex flex-col gap-6'>
            <div className='flex text-[#F6EFDD] items-end ml-2'>
              <p className='text-4xl'>200</p>
              <p className='text-xm ml-1'>ポイント</p>
            </div>
            <div className='bg-[#FDFBF5] w-full h-20 shadow-small content text-xs p-1'>
              <div className='flex'>
                <IoEyeOutline className='icons-s' />
                <p className='ml-1'>Artículos leídos: 10</p>
              </div>
              <div className='flex-col '>
                <div className='flex'>
                  <IoBookOutline className='icons-s' />
                  <p className='ml-1'>Artículos para principiantes: 8</p>
                </div>
                <div className='flex'>
                  <VscFlame className='icons-s' />
                  <p className='ml-1'>Artículos para avanzados: 2</p>
                </div>
              </div>
            </div>
          </div>
          <div className='content shadow-large  bg-[#FDFBF5] w-[560px] ml-3 pt-3 pl-5 relative overflow-hidden'>
            <Image
              src="/images/sushi.png"
              alt="sushi"
              width={235}
              height={235}
              className='absolute top-0 right-0'
            />
            <div className='w-[290px]'>
              <p className='text-2xl'>まめちしき</p>
              <div className='text-xs'>
                <p className='mt-5'>知っていましたか...</p>
                <p className='mt-5 '>女性の手は男性よりも熱く、魚の鮮度を損なう可能性があると言われているため、日本では寿司を握る女性の職人がほとんどいません。</p>
              </div>
              <div className='flex text-xs absolute bottom-5'>
                <div className='flex'>
                  <MdTranslate className='icons-s' />
                  <p className='ml-1 underline'>Ver traducción al español</p>
                </div>
                <div className='flex ml-3'>
                  <AiOutlineSound className='icons-s' />
                  <p className='ml-1 underline'>Escuchar audio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-center mt-8'>
          <div className='bg-[#214ECF] w-[550px] h-[700px] content shadow-large'></div>
          <div className='bg-[#FDFBF5] w-[250px] h-[400px] ml-3 content shadow-large'></div>
        </div>
      </div>
    </>
  )
}
export default Estudiar;
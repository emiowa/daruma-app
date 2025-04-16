
import Head from 'next/head';
import { IoEyeOutline, IoBookOutline } from "react-icons/io5";
import { VscFlame } from "react-icons/vsc";
import Image from 'next/image';
import BotonAudioDatoCurioso from '@/components/botones/BotonAudioDatoCurioso';
import BotonAudioVocabulario from '@/components/botones/BotonAudioVocabulario';
import LinkVerTodosArticulos from '@/components/links/LinkVerTodosArticulos';
import ArticulosTarjetas from '@/components/ArticulosTarjetas';


function Estudiar() {
  const cardData = [
    {
      id: 1,
      title: "広島の有名な島",
      description: "広島には、充実した体験をしたい人にとって必須の観光地となっている島があります。",
      imageUrl: '/images/hiroshima.png',
      checked: true,
      liked: true
    },
    {
      id: 2,
      title: "日本の桜の木",
      description: "桜には、ただ美しいピンク色の木だけではなく、より深い意味があります。",
      imageUrl: '/images/sakura.png',
      checked: false,
      liked: false
    },
    {
      id: 3,
      title: "納豆って知っていますか？",
      description: "日本で最も健康的な食べ物の一つだが、外国人の間で最も嫌われている食べ物。",
      imageUrl: '/images/natto.png',
      checked: true,
      liked: false
    },
    {
      id: 4,
      title: "納豆って知っていますか？",
      description: "日本で最も健康的な食べ物の一つだが、外国人の間で最も嫌われている食べ物。",
      imageUrl: '/images/natto.png',
      checked: true,
      liked: false
    },
    {
      id: 5,
      title: "広島の有名な島",
      description: "広島には、充実した体験をしたい人にとって必須の観光地となっている島があります。",
      imageUrl: '/images/hiroshima.png',
      checked: false,
      liked: true
    },
    {
      id: 6,
      title: "日本の桜の木",
      description: "桜には、ただ美しいピンク色の木だけではなく、より深い意味があります。",
      imageUrl: '/images/sakura.png',
      checked: false,
      liked: false
    }
  ]
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
          <div className='bg-main-red w-[250px] content shadow-large pt-10 px-3 pb-4 flex flex-col gap-6'>
            <div className='flex text-[rgb(246,239,221)] items-end ml-2'>
              <p className='text-4xl'>200</p>
              <p className='text-xm ml-1'>ポイント</p>
            </div>
            <div className='bg-main-white w-full h-24 shadow-small content  p-2'>
              <div className='flex'>
                <IoEyeOutline className='text-[15px] ' />
                <p className='ml-1 text-[11px] font-semibold'>Artículos leídos: 10</p>
              </div>
              <div className='flex-col ml-2 mt-4'>
                <div className='flex'>
                  <IoBookOutline className='icons-s text-[15px]' />
                  <p className='ml-1 text-[11px]'>Artículos para principiantes: 8</p>
                </div>
                <div className='flex mt-1'>
                  <VscFlame className='icons-s text-[15px]' />
                  <p className='ml-1 text-[11px]'>Artículos para avanzados: 2</p>
                </div>
              </div>
            </div>
          </div>
          <div className='content shadow-large  bg-main-white w-[560px] ml-3 pt-3 pl-5 relative overflow-hidden'>
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
                <BotonAudioVocabulario />
                <BotonAudioDatoCurioso />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-center mt-8'>
          <div className='bg-main-blue w-[570px] h-[650px] content px-4 py-6 shadow-large'>
            <div className='flex justify-between'>
              <p className='text-main-background text-3xl'>きじ</p>
              <LinkVerTodosArticulos />
            </div>
            <div className='flex flex-wrap gap-3 mt-3 '>
              {
                cardData.slice(0, 6).map((item) => (
                  <ArticulosTarjetas liked={item.liked} title={item.title} id={item.id} description={item.description} imageUrl={item.imageUrl} checked={item.checked} />
                ))
              }
            </div>
          </div>
          <div className='bg-main-white w-[240px] h-[400px] ml-3 content shadow-large'></div>
        </div>
      </div>
    </>
  )
}
export default Estudiar;
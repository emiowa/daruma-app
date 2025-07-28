
import Head from 'next/head';
import { IoEyeOutline, IoBookOutline } from "react-icons/io5";
import { VscFlame } from "react-icons/vsc";
import BotonAudioDatoCurioso from '@/components/botones/BotonAudioDatoCurioso';
import BotonAudioVocabulario from '@/components/botones/BotonAudioVocabulario';
import LinkVerTodosArticulos from '@/components/links/LinkVerTodosArticulos';
import ArticulosTarjetas from '@/components/ArticulosTarjetas';
import VocabularioFila from '@/components/VocabularioFila';
import { FaArrowRight } from "react-icons/fa";

function Estudiar() {
  const articuloNum = 6
  const vocabularioNum = 5
  const cardData = [
    {
      id: 1,
      title: (
        <>
          <ruby>広島<rt>ひろしま</rt></ruby>の<ruby>有名<rt>ゆうめい</rt></ruby>な<ruby>島<rt>しま</rt></ruby>
        </>
      ),
      imageUrl: '/images/hiroshima.png',
      checked: true,
      liked: true,
      label: {
        text: "cultura",
        bg: "bg-main-orange"
      },
      star: 2
    },
    {
      id: 2,
      title: (
        <>
          <ruby>日本<rt>にほん</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby>の<ruby>木<rt>き</rt></ruby>
        </>
      ),
      imageUrl: '/images/sakura.png',
      checked: false,
      liked: false,
      label: {
        text: "comida",
        bg: "bg-main-yellow"
      },
      star: 2
    },
    {
      id: 3,
      title: (
        <>
          <ruby>納豆<rt>なっとう</rt></ruby>って<ruby>知<rt>し</rt></ruby>っていますか？
        </>
      ),
      imageUrl: '/images/natto.png',
      checked: true,
      liked: false,
      label: {
        text: "comida",
        bg: "bg-main-yellow"
      },
      star: 1
    },
    {
      id: 4,
      title: (
        <>
          <ruby>納豆<rt>なっとう</rt></ruby>って<ruby>知<rt>し</rt></ruby>っていますか？
        </>
      ),
      imageUrl: '/images/natto.png',
      checked: true,
      liked: false,
      label: {
        text: "idioma",
        bg: "bg-main-blue"
      },
      star: 3
    },
    {
      id: 5,
      title: (
        <>
          <ruby>広島<rt>ひろしま</rt></ruby>の<ruby>有名<rt>ゆうめい</rt></ruby>な<ruby>島<rt>しま</rt></ruby>
        </>
      ),
      imageUrl: '/images/hiroshima.png',
      checked: false,
      liked: true,
      label: {
        text: "comida",
        bg: "bg-main-yellow"
      },
      star: 1
    },
    {
      id: 6,
      title: (
        <>
          <ruby>日本<rt>にほん</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby>の<ruby>木<rt>き</rt></ruby>
        </>
      ),
      imageUrl: '/images/sakura.png',
      checked: false,
      liked: false,
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
    }
  ]

  const vocabulario = [
    {
      id: 1,
      palabra: "語彙",
      hiragana: "ごい",
      traduccion: "Vocabulario",
      audio: "/sounds/goi.mp4",
      label: {
        text: "cultura",
        bg: "bg-main-orange"
      }
    },
    {
      id: 2,
      palabra: "豆知識",
      hiragana: "まめちしき",
      traduccion: "Curiosidades",
      audio: "/sounds/goi2.mp4"
    },
    {
      id: 3,
      palabra: "記事",
      hiragana: "きじ",
      traduccion: "Articulos",
      audio: "/sounds/goi.mp4"
    },
    {
      id: 4,
      palabra: "台所",
      hiragana: "だいどころ",
      traduccion: "Cocina",
      audio: "/sounds/goi2.mp4"
    },
    {
      id: 5,
      palabra: "玄関",
      hiragana: "げんかん",
      traduccion: "Entorada de la casa",
      audio: "/sounds/goi.mp4"
    },
    {
      id: 6,
      palabra: "dummy",
      hiragana: "だみー",
      traduccion: "dummy",
      audio: "/sounds/go2.mp4"
    },
  ]
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >Estudiar</title>
        <meta name='description' content='私たちはグラン戸田住人' />
      </Head>
      <div className='w-full md:w-[720px]' >
        <div className='flex justify-center h-40 md:h-48 lg:h-50'>
          {/* --------------------------------------points-------------------------------------- */}
          <div className='bg-main-orange md:w-[220px] content shadow-large md:pt-9 md:px-2 flex flex-col md:gap-6'>
            <div className='flex text-[rgb(246,239,221)] items-end ml-2'>
              <p className='text-4xl md:text-4xl'>200</p>
              <p className='text-xm md:text-xm ml-1 md:ml-1'>ポイント</p>
            </div>
            <div className='bg-main-white w-full h-16 md:h-20 lg:h-24 shadow-small content p-2'>
              <div className='flex'>
                <IoEyeOutline className='text-[15px] md:text-[15px] ' />
                <p className='ml-1 text-[10px] md:text-[10px] font-semibold'>Artículos leídos: 10</p>
              </div>
              <div className='flex-col ml-1 mt-3 md:mt-4 lg:mt-5'>
                <div className='flex'>
                  <IoBookOutline className='text-[15px] md:text-[15px]' />
                  <p className='ml-1 text-[10px] md:text-[10px]'>Artículos para principiantes: 8</p>
                </div>
                <div className='flex mt-1'>
                  <VscFlame className='text-[15px] md:text-[15px]' />
                  <p className='ml-1 text-[10px] md:text-[10px]'>Artículos para avanzados: 2</p>
                </div>
              </div>
            </div>
          </div>
          {/* --------------------------------------tips-------------------------------------- */}
          <div className='content shadow-large  bg-main-white w-[560px] md:w-[490px] ml-3 pt-3 pl-5 md:pl-4 relative overflow-hidden'>
            <img
              src="/images/sushi.png"
              alt="sushi"
              className='absolute top-0 right-0 w-42 md:w-52'
            />
            <div className='w-[290px] md:w-[250px]'>
              <p className='text-xl font-bold md:text-2xl'>まめちしき</p>
              <div className='text-[10px] md:text-[10px]'>
                <p className='mt-5 md:mt-4'>知っていましたか...</p>
                <p className='mt-5 md:mt-4'>女性の手は男性よりも熱く、魚の鮮度を損なう可能性があると言われているため、日本では寿司を握る女性の職人がほとんどいません。</p>
              </div>
              <div className='flex text-[11px] absolute bottom-5'>
                <BotonAudioVocabulario />
                <BotonAudioDatoCurioso />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-center mt-8'>
          {/* --------------------------------------articulo-------------------------------------- */}
          <div className='bg-main-blue w-[570px] h-[650px] md:h-[500px] content p-4 shadow-large'>
            <div className='flex justify-between items-center'>
              <p className='text-main-grey font-bold md:text-2xl'>きじ</p>
              <LinkVerTodosArticulos />
            </div>
            <div className='flex flex-wrap gap-3 mt-3 '>
              {
                cardData.slice(0, articuloNum).map((item) => (
                  <ArticulosTarjetas liked={item.liked} title={item.title} id={item.id} label={item.label} imageUrl={item.imageUrl} star={item.star} checked={item.checked} />
                ))
              }
            </div>
          </div>
          {/* --------------------------------------vocabulario-------------------------------------- */}
          <div className='bg-main-white md:w-[240px] w-[240px] md:h-[400px] h-[400px] ml-3 content px-3 py-5 shadow-large'>
            <div className='flex items-center justify-between'>
              <p className='font-bold md:text-2xl'>ごい</p>
              <div className='flex'>
                <a href='/' className='underline md:text-[11px] text-[11px]'>Ver mi vocabulario</a>
                <FaArrowRight className='ml-1' />
              </div>
            </div>
            {
              vocabulario.slice(0, vocabularioNum).map((item, index) => (
                <>
                  <VocabularioFila palabra={item.palabra} hiragana={item.hiragana} traduccion={item.traduccion} audio={item.audio} />
                  {
                    index < vocabularioNum - 1 &&
                    <div className='w-full mt-1.5 h-[1px] md:h-[1px] bg-main-grey'></div>
                  }
                </>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
export default Estudiar;
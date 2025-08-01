
import ArticulosTarjetas from '@/components/estudiar/ArticulosTarjetas';
import Head from 'next/head';
import { useState } from 'react';

function Articulos() {

  const inicioArticuloNum = 12
  const [articuloNum, setArticuloNum] = useState(inicioArticuloNum)
  const handleArticuloNum = () => {
    setArticuloNum(prev => prev + inicioArticuloNum)
  }

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
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
    },
    {
      id: 1,
      title: (
        <>
          <ruby>広島<rt>ひろしま</rt></ruby>の<ruby>有名<rt>ゆうめい</rt></ruby>な<ruby>島<rt>しま</rt></ruby>
        </>
      ),
      imageUrl: '/images/hiroshima.png',
      checked: true,
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
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
    },
    {
      id: 1,
      title: (
        <>
          <ruby>広島<rt>ひろしま</rt></ruby>の<ruby>有名<rt>ゆうめい</rt></ruby>な<ruby>島<rt>しま</rt></ruby>
        </>
      ),
      imageUrl: '/images/hiroshima.png',
      checked: true,
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
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
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
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
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
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
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
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
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
      label: {
        text: "viaje",
        bg: "bg-main-pink"
      },
      star: 3
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
      label: {
        text: "comida",
        bg: "bg-main-yellow"
      },
      star: 1
    }
  ]

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >Articulos</title>
        <meta name='description' content='記事' />
      </Head>
      <>
        <div className='md:mt-20 bg-main-blue w-[570px] md:w-[700px] lg:w-[1000px] content md:pt-28 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large relative'>
          <div className='text-main-grey font-bold md:text-6xl lg:text-7xl absolute md:-top-16 lg:-top-[75px] md:left-8 space-y-3'>
            <div>き</div>
            <div>じ</div>
          </div>
          <div className='flex flex-wrap gap-3 mt-3 lg:mt-12 justify-center'>
            {
              cardData.slice(0, articuloNum).map((item) => (
                <ArticulosTarjetas title={item.title} id={item.id} label={item.label} imageUrl={item.imageUrl} star={item.star} checked={item.checked} />
              ))
            }
          </div>
          {cardData.length >= articuloNum &&
            <div className='flex justify-center relative' onClick={() => handleArticuloNum()}>
              <div className='md:m-9 md:w-12 md:h-12 border border-solid border-black rounded-full'>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-2xl">
                  +
                </span>
              </div>
            </div>
          }
        </div>
      </>
    </>
  )
}
export default Articulos;
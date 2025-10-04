import Head from 'next/head';
import Link from 'next/link';

function selectLevel() {

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >selectLevel</title>
        <meta name='description' content='記事' />
      </Head>
      <div>
        <div className='w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3'>
          <div>ご</div>
          <div>い</div>
        </div>
        <div className='md:mt-10 flex flex-col items-center bg-main-lightBlue w-[570px] md:w-[720px] lg:w-[1000px] content md:pt-14 lg:pt-32 md:pb-14 md:px-4 lg:px-6 shadow-large'>
          <div className=' flex mt-3 text- lg:mt-12 justify-center'>
            <Link href={`/study/vocabulary/facil`} className='bg-main-yellow w-32 p-3 rounded text-center'>かんたん<br />facil<br />5</Link>
            <Link href={`/study/vocabulary/normal`} className='bg-main-purple w-32 p-3 rounded text-center ml-8'>ふつう<br />normal<br />17</Link>
            <Link href={`/study/vocabulary/dificil`} className='bg-main-pink w-32 p-3 rounded text-center ml-8'>むずかしい<br />dificil<br />22</Link>
            <Link href={`/study/vocabulary/anadida`} className='bg-main-background w-32 p-3 text-center rounded ml-8'>あたらしい<br />nuevo<br />10</Link>
          </div>
          <Link href={`/study/vocabulary/all`} className='mt-5 bg-main-nav rounded w-[600px] text-center py-4'>ぜんぶ</Link>
        </div>
      </div>
    </>
  )
}
export default selectLevel;
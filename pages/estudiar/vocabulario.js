

import Head from 'next/head';

function Vocabulario() {


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >Vocabulario</title>
        <meta name='description' content='記事' />
      </Head>
      <div>
        <div className='w-full text-main-grey font-bold md:text-6xl lg:text-7xl space-y-3'>
          <div>ご</div>
          <div>い</div>
        </div>
        <div className='md:mt-10 bg-main-lightBlue w-[570px] md:w-[720px] lg:w-[1000px] content md:pt-28 lg:pt-32 md:pb-10 md:px-4 lg:px-6 shadow-large'>
          <div className='flex flex-wrap gap-3 mt-3 lg:mt-12 justify-center'>
          </div>
        </div>
      </div>
    </>
  )
}
export default Vocabulario;
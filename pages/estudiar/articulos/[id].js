

import Head from 'next/head';

function ArticuloIndividual({ label, id }) {


  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title >articulo_individual</title>
        <meta name='description' content='記事' />
      </Head>
      <div>
        <div className='w-full md:mt-20 text-main-grey font-bold md:text-5xl lg:text-7xl space-y-3 text-center'>タイトル</div>
        <div className='md:mt-10 bg-main-blue w-[570px] md:w-[720px] lg:w-[1000px] content md:h-[60px] md:px-4 lg:px-6 shadow-large flex justify-around'>
          <div className='flex justify-between'>
            <p>{id}</p>
            <div>{id}</div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ArticuloIndividual;
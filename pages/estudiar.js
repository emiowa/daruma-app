
import Head from 'next/head';
// import "../styles/globals.css"

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
        <div className='flex justify-center'>
          <div className='bg-sky-500 w-[200px] aspect-square rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]'></div>
          <div className='bg-red-500 w-[500px] rounded ml-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]'></div>
        </div>
        <div className='flex justify-center mt-8'>
          <div className='bg-yellow-500 w-[500px] h-[600px] rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]'></div>
          <div className='bg-green-500 w-[200px] h-[300px] ml-3 rounded shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)]'></div>
        </div>
      </div>
    </>
  )
}
export default Estudiar;
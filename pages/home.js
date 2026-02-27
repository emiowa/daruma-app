import Head from 'next/head';

function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title>study</title>
        <meta name='description' content='私たちはグラン戸田住人' />
      </Head>
      <div
  className='w-full min-h-screen bg-no-repeat bg-center relative'
  style={{ 
    backgroundImage: "url('/images/BG-600-180-main.png')",
    backgroundSize: 'auto 100vh', // This makes it exactly as tall as the screen
    imageRendering: 'pixelated',  // Essential for sharp pixel art
    overflow: 'hidden'            // Hides any extra width/height
  }}
>
  {/* Your content goes here */}
</div>
    </>
  )
}
export default Home;
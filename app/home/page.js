function Home() {
  return (
    <>
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
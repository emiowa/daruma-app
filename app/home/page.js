import ArticleCards from '@/components/study/ArticleCards';
import CardData from "@/data/cards.json"

function Home() {
  const articleNum = 4
  return (
    <div className="w-full">
      <div
        className='w-full min-h-screen bg-no-repeat bg-center relative pixel-layer'
        style={{
          backgroundImage: "url('/images/scene1/scene-test.png')",
          backgroundSize: '100vw auto', // This makes it exactly as tall as the screen
          imageRendering: 'pixelated',
          overflow: 'hidden'            // Hides any extra width/height
        }}
      >
  {/* Your content goes here */}
      </div>

      <div
        className='w-full min-h-screen bg-no-repeat bg-center relative'
        style={{ 
          backgroundImage: "url('/images/BG-600-180-bamboo.png')",
          backgroundSize: 'auto 100vh', // This makes it exactly as tall as the screen
          imageRendering: 'pixelated',  // Essential for sharp pixel art
          overflow: 'hidden'            // Hides any extra width/height
        }}
      >
        <div className='flex items-center justify-normal min-h-screen p-6'>
          <div className='grid grid-cols-2 gap-3'>
            {
              CardData.slice(0, articleNum).map((item) => (
                <ArticleCards key={item.id} title={item.title} titleRuby={item.titleRuby} id={item.id} label={item.label} imageUrl={item.imageUrl} star={item.star} leido={item.leido} page="main" />
              ))
            }
          </div>
          <div>

          </div>
        </div>
      </div>
    </div>
  )
}
export default Home;
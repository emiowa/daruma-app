export default function Footer() {
  return (
    <div className="w-full relative mt-20 overflow-hidden">
      <div
        className="w-full aspect-[600/300] bg-no-repeat bg-center bg-cover pixel-layer flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/images/BG-600-180-lanterns.png')",
          imageRendering: 'pixelated',
        }}
      >
        <p className="text-main-retroWhite font-pixel text-6xl font-bold">DARUMA</p>
        <p className="text-main-retroWhite font-pixel text-2xl">Aumenta el nivel de Japonés</p>
      </div>
    </div>
  );
}
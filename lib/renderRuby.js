import { useRouter } from "next/router";

export function RubyText({ parts, isJapanese, spanishText, displayFurigana, className }) {
  const router = useRouter()
  const isIdPage = router.pathname === "/study/articles/[id]";
  if (!Array.isArray(parts)) return null;
  if (isIdPage && !isJapanese) {
    return (
      <div className={className}>
        {spanishText}
      </div>
    )
  }
  return (
    <div className={className}>
      {parts.map((sentence, sIndex) => (
        <div className="mb-14 last:mb-0" key={sIndex}>
          {sentence.map((part, index) => (
            <ruby key={index} className="mr-1">
              {part.text}
              <rt className={displayFurigana ? "text-transparent" : "text-black"}>
                {part.ruby}
              </rt>
            </ruby>
          ))}
        </div>
      ))}
    </div>
  );
}


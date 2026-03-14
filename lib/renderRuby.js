"use client"

import { useParams, usePathname } from "next/navigation";

export function RubyText({ parts, isJapanese, spanishText, displayFurigana, className }) {
  const params = useParams();
  const path = usePathname()
  const isIdPage = path === `/study/article/${params.id}`
  if (!Array.isArray(parts)) return null;
  if (isIdPage && !isJapanese) {
    return (
      <div className={className}>
        {spanishText.map((text, i) => (
          <div className="mb-14 last:mb-0" key={i}>{text}</div>
        ))}
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


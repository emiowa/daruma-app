import { useRouter } from "next/router";

export function RubyText({ parts, isJapones, spanishText, displayFurigana, className }) {
  const router = useRouter()
  const isIdPage = router.pathname === "/estudiar/articulos/[id]";
  if (!Array.isArray(parts)) return null;
  if (isIdPage && !isJapones) {
    return (
      <div className={className}>
        {spanishText}
      </div>
    )
  }
  return (
    <div className={className}>
      {parts.map((part, index) =>
        <ruby key={index}>
          {part.text}
          <rt className={`${displayFurigana ? 'text-transparent' : 'text - black'}`}>{part.ruby}</rt>
        </ruby>
      )}
    </div>
  );
}


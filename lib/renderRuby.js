export function RubyText({ parts, displayFurigana, className }) {
  if (!Array.isArray(parts)) return null;
  return (
    <div className={className}>
      {parts.map((part, index) =>
        <ruby key={index}>
          {part.text}
          {displayFurigana ? <rt>{part.ruby}</rt> : <rt></rt>}
        </ruby>
      )}
    </div>
  );
}


export function RubyText({ parts, className }) {
  if (!Array.isArray(parts)) return null;
  return (
    <div className={className}>
      {parts.map((part, index) =>
        <ruby key={index}>
          {part.text}
          <rt>{part.ruby}</rt>
        </ruby>
      )}
    </div>
  );
}


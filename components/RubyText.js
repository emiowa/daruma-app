import React from 'react';

const RubyText = ({ rawText, displayFurigana = true, className = "" }) => {
  // rawTextが空の場合は何も返さない
  if (!rawText) return null;

  // 漢字[ルビ] を抽出する正規表現
  const regex = /([一-龠々ヶ]+)\[([^\]]+)\]|([^一-龠々ヶ\[]+)/g;
  const parts = [];
  let match;

  while ((match = regex.exec(rawText)) !== null) {
    if (match[1]) {
      // 漢字[ルビ] のパターン
      parts.push(
        <ruby key={match.index}>
          {match[1]}
          {/* displayFuriganaがtrueの時だけrtタグを表示する */}
          <rt className={`select-none duration-300 ${!displayFurigana && "text-transparent"}`}>{match[2]}</rt>
        </ruby>
      );
    } else if (match[3]) {
      // それ以外の文字
      parts.push(<span key={match.index}>{match[3]}</span>);
    }
  }

  return <span className={className}>{parts}</span>;
};

export default RubyText;
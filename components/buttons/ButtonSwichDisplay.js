


import React from 'react';

const ButtonSwichDisplay = ({ booleanItem, func, className, defaultText, changedText }) => {
  return (
    <>
      <div>
        <button onClick={() => func()} className={`p-1 md:p-2 lg:p-3 content shadow-small md:text-[13px] lg:text-[18px] ${className}`}>
          {booleanItem ? defaultText : changedText}
        </button>
      </div>
    </>
  );
};
export default ButtonSwichDisplay;
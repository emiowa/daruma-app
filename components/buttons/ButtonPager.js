
import React from 'react';

const ButtonPager = ({ children }) => {
  return (
    <div className={`p-1 md:p-2 lg:p-3 md:px-6 content bg-main-white shadow-small lg:text-[18px] `}>
      {children}
    </div>
  );
};
export default ButtonPager;


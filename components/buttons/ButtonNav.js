'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ButtonNav = ({ href, text, className }) => {
  const pathname = usePathname();
  const isActive = pathname === `/${href}`;

  return (
    <Link href={`/${href}`}>
      <button className={`p-1 md:p-2 lg:p-3 navbarButton shadow-small lg:text-[18px] ${isActive ? 'bg-main-retroYellow' : 'bg-main-background'} ${className}`}>
        {text}
      </button>
    </Link>
  );
};

export default ButtonNav;
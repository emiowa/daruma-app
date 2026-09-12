'use client';

import Footer from "./Footer";
import Header from "./Header/Header";
import { ParallaxProvider } from 'react-scroll-parallax';

export default function Layout({ children }) {
  return (
    <ParallaxProvider>
      <div className="flex flex-col min-h-screen bg-main-background text-main-retroBlack pt-36">
        <Header />
        <main className="flex-grow  mx-auto min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </ParallaxProvider>
  );
};
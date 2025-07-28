import Header from "./Header"

import Head from 'next/head';
import Footer from "./Footer"

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-main-background text-main-grey">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/svg+xml" />
        <title>Daruma</title>
        <meta name="description" content="私たちはグラン戸田住人" />
      </Head>
      <Header />
      <div className="flex-grow p-6 pt-24 md:pt-24 lg:pt-40 flex justify-center">{children}</div>
      <Footer />
    </div>
  );
};
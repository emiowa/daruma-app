
import Head from 'next/head';
import "../styles/globals.css"
import "../styles/styles.css"
import Layout from '@/components/Layout';

export default function RootLayout({ children }) {
  return (
    <html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title >OAH Architecture</title>
        <meta name='description' content='私たちメディアアシストは、教育/研修向けの映像制作やその配信のご相談を通じて皆さまの事業の支援を行う会社として誕生しました。' />
      </Head>
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}
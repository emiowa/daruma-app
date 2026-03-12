import "../styles/globals.css";
import "../styles/styles.css";
import Layout from '@/components/Layout';

// Metadata API を使用（Head の代わり）
export const metadata = {
  title: 'OAH Architecture',
  description: '私たちは日本語学習を支援します。', // アプリの内容に合わせて変更
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es"> {/* スペイン語圏向けなら "es"、日本語なら "ja" */}
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
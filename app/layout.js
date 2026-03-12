import "../styles/globals.css";
import "../styles/styles.css";
import Layout from '@/components/Layout';

export const metadata = {
  title: {
    default: 'Daruma - Aprende Japonés', // デフォルトのタイトル
    template: '%s | Daruma' // 各ページで設定したタイトルの後ろに付く
  },
  description: '私たちは日本語学習を支援します。', // アプリの内容に合わせて変更
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
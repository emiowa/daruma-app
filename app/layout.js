import "../styles/globals.css";
import "../styles/styles.css";
import Layout from '@/components/Layout';
import { AuthProvider } from './context/AuthContext'; // パスは環境に合わせて調整してください

export const metadata = {
  title: {
    default: 'Daruma - Aprende Japonés',
    template: '%s | Daruma'
  },
  description: '私たちは日本語学習を支援します。',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

// ⭕️ 2つに分裂していた RootLayout を1つの正解の形にまとめました！
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* 💡 アプリ全体をAuthProviderで包みます。
            これでヘッダーも単語リストも、ログイン情報をずっと持たせ続けられます */}
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
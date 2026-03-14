import "../styles/globals.css";
import "../styles/styles.css";
import Layout from '@/components/Layout';

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
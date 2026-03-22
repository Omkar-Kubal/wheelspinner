import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Spin the Wheel | Free Random Picker',
    template: '%s | WheelSpinner',
  },
  description: 'Free spin the wheel tool. Add names, spin, get a random result. No signup needed. Share your wheel with a link.',
  metadataBase: new URL('https://randomwheelpicker.io'),
  openGraph: {
    siteName: 'WheelSpinner',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} text-gray-900 min-h-screen flex flex-col`}
        style={{
          background: "radial-gradient(circle at center, #ffffff 0%, #f0f4ff 100%)",
        }}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

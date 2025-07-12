import './globals.css';
import { UserProvider } from '@/context/userContext';
import { Nunito } from 'next/font/google';
import Navigation from '@/components/user/Navigation';
import Footer from '@/components/Footer';
import Script from 'next/script';

export const metadata = {
  title: 'Chest of Contemplation',
  description: 'Exploring Life’s Depths through Words',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-2286994703571724" />

        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2286994703571724"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <UserProvider>
          <Navigation />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}

import './globals.css';
import { UserProvider } from '@/context/userContext';
import { Nunito } from 'next/font/google';
import Navigation from '@/components/user/Navigation';
import Footer from '@/components/Footer';
import Script from 'next/script';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

export const metadata = {
  // Basic metadata
  title: {
    default: 'Chest of Contemplation | Exploring Life\'s Depths through Words',
    template: '%s | Chest of Contemplation'
  },
  description: 'Dive into thoughtful articles, profound reflections, and meaningful discussions on life, philosophy, personal growth, and the human experience. Join our community of contemplative thinkers.',

  // Keywords for SEO
  keywords: [
    'contemplation',
    'philosophy',
    'personal growth',
    'life reflections',
    'thoughtful writing',
    'meaningful discussions',
    'self-improvement',
    'mindfulness',
    'deep thoughts',
    'wisdom',
    'introspection',
    'life lessons',
    'philosophical articles',
    'personal development',
    'thought-provoking content',
    'existential questions',
    'human experience',
    'conscious living'
  ],

  // Authors and creator
  authors: [{ name: 'Chest of Contemplation' }],
  creator: 'Chest of Contemplation',
  publisher: 'Chest of Contemplation',

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chestofcontemplation.com',
    siteName: 'Chest of Contemplation',
    title: 'Chest of Contemplation | Exploring Life\'s Depths through Words',
    description: 'Dive into thoughtful articles, profound reflections, and meaningful discussions on life, philosophy, personal growth, and the human experience.',
    images: [
      {
        url: '/background.jpg',
        width: 1200,
        height: 630,
        alt: 'Chest of Contemplation - Exploring Life\'s Depths',
      }
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Chest of Contemplation | Exploring Life\'s Depths through Words',
    description: 'Dive into thoughtful articles, profound reflections, and meaningful discussions on life, philosophy, and personal growth.',
    creator: '@chestofcontemp',
    images: ['/background.jpg'],
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Additional metadata
  category: 'Philosophy & Personal Development',
  classification: 'Blog',

  // Alternate languages
  alternates: {
    canonical: 'https://chestofcontemplation.com',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },

  // Other metadata
  other: {
    'msapplication-TileColor': '#9333ea',
  },
};

// FIXED: Moved viewport to separate export (Next.js 14+ requirement)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.className}>
      <head>
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-2286994703571724" />
        <meta name="google-site-verification" content="Q2PIxRm99JlrLQTkSIRIh9V8ljwaSJyVq9JbC3pjYlg" />
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2286994703571724"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics - Replace with your GA4 ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZELWFCTE9G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZELWFCTE9G');
          `}
        </Script>

        {/* Structured Data - Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Chest of Contemplation',
              url: 'https://chestofcontemplation.com',
              logo: 'https://chestofcontemplation.com/favicon.png',
              description: 'A platform for thoughtful articles, profound reflections, and meaningful discussions on life, philosophy, and personal growth.',
              sameAs: [
                'https://twitter.com/chestofcontemp',
                'https://facebook.com/chestofcontemplation',
                'https://instagram.com/chestofcontemplation',
              ],
            }),
          }}
        />

        {/* Structured Data - Website Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Chest of Contemplation',
              url: 'https://chestofcontemplation.com',
              description: 'Exploring Life\'s Depths through Words',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://chestofcontemplation.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://chestofcontemplation.com" />
      </head>
      <body className="antialiased">
        <UserProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
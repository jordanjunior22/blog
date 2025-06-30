import './globals.css';
import { UserProvider } from '@/context/userContext';
import { Nunito } from 'next/font/google';
import Navigation from '@/components/user/Navigation';
import Footer from '@/components/Footer';


export const metadata = {
  title: 'Chest of Contemplation',
  description: 'Exploring Life’s Depths through Words',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <UserProvider>
          <Navigation />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}

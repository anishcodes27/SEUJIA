import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthenticitySection from '@/components/AuthenticitySection';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Seujia Honey - Pure Natural Honey',
  description: 'Premium honey from sustainable apiaries. Raw, unfiltered, and delicious.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex flex-col min-h-screen bg-honey-50`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <AuthenticitySection />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

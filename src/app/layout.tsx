import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'DaTrack - Daily Life & Habit Tracker',
  description:
    'A full-stack, responsive web application for logging daily activities, tracking productive habits, and analyzing time distribution across life categories.',
  keywords: [
    'Daily Tracker',
    'Habit Tracker',
    'Time Tracking',
    'Productivity',
    'Life Analytics',
    'Next.js',
    'PostgreSQL',
  ],
  authors: [{ name: 'DaTrack Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#090d16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#090d16] text-foreground min-h-screen antialiased`}>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '1rem',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}

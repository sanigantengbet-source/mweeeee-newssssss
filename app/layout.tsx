import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/ThemeContext';

export const metadata: Metadata = {
  title: 'Indonesia Disaster Monitor',
  description: 'Platform monitoring dan visualisasi data bencana di Indonesia menggunakan data resmi BMKG, BNPB/InaRISK, dan PVMBG/MAGMA Indonesia.',
  openGraph: {
    title: 'Indonesia Disaster Monitor',
    description: 'Platform monitoring dan visualisasi data bencana di Indonesia menggunakan data resmi BMKG, BNPB/InaRISK, dan PVMBG/MAGMA Indonesia.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indonesia Disaster Monitor',
    description: 'Platform monitoring dan visualisasi data bencana di Indonesia menggunakan data resmi BMKG, BNPB/InaRISK, dan PVMBG/MAGMA Indonesia.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('idm-theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-[#0d1117] text-[#f0f6fc] antialiased font-sans transition-colors duration-150 selection:bg-rose-500/30 selection:text-rose-200"
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

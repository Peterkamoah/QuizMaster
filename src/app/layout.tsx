import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    default: "QuizMaster",
    template: `%s | QuizMaster`,
  },
  description: 'A modern, AI-powered quiz application to generate quizzes from text or PDFs. Perfect for students and educators.',
  openGraph: {
    title: 'QuizMaster',
    description: 'A modern, AI-powered quiz application to generate quizzes from text or PDFs.',
    url: 'https://quiz-master-zeta-teal.vercel.app',
    siteName: 'QuizMaster',
    images: [
      {
        url: '/og-image.png',
        alt: 'QuizMaster Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuizMaster',
    description: 'A modern, AI-powered quiz application to generate quizzes from text or PDFs.',
    images: ['/og-image.png'],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1120' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PZZZ8S2X');`}
        </Script>
        {/* End Google Tag Manager */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow">{children}</main>
            <footer className="py-4 text-center text-sm text-muted-foreground">
              Copyright © {new Date().getFullYear()}{' '}
              <a
                href="https://peter-s-digital-stage-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Peter Amoah Mensah
              </a>
              . All Rights Reserved.
            </footer>
          </div>
          <Toaster />

          {/* Client-side libraries loaded via Next.js Script component for proper ordering and execution */}
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js" strategy="afterInteractive" />
          <Script id="pdf-worker-config" strategy="afterInteractive">
          {`
            if (typeof pdfjsLib !== 'undefined') {
              pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
            }
          `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}

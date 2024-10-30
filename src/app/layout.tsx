import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';
import React, { Suspense  } from 'react'
import { Instrument_Sans } from 'next/font/google'
import GlobalProvider from './GlobalProvider'
import { ThemeProvider } from '@/components/Header/New/theme-provider';
import Navbar from '@/components/Header/New/Navbar';
import Footer from '@/components/Footer/Footer';
import Tags from './blog/front/Tags';
import "./globals.css";

const instrument = Instrument_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Modern Decor Diaries for Stylish and Sustainable Home Design",
  description:
    'Get inspired and discover the perfect decor ideas for your home. Modern Decor Diaries is more than just a store – it is a curated collection of stylish home finds, design tips, and inspiration to make decorating your space fun and easy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalProvider>
      <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        >
        <Suspense>

        <body className={instrument.className}>
            <Navbar /> {/* Add Navbar here */}
            <div className="container">
              {children} {/* This will render the page content */}

              <Tags /> 
              </div>
              <Footer /> {/* Add Footer here */}
          <Analytics />
      
        </body>
      
        </Suspense>
        </ThemeProvider>
      </html>
    </GlobalProvider>
  )
}

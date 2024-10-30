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
  title: "Kenyan Talents - Nurturing Skills, Empowering Youth",
  description:
    "Kenyan Talents is dedicated to inspiring and empowering Kenyan youth by nurturing their unique skills and talents. Join our community for resources, opportunities, and support to help you unlock your full potential. Follow us on Twitter and Instagram @kenyantalents for the latest updates, success stories, and more.",
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

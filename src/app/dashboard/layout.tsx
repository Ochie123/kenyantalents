import { CONFIG } from '@/config-global';
import { DashboardLayout } from '@/layouts/dashboard';
import { Instrument_Sans } from 'next/font/google';
import { AuthGuard } from '@/auth/guard';
import { SettingsDrawer, defaultSettings, SettingsProvider } from '@/components/settings';
import { detectSettings } from '@/components/settings/server';
import { ProgressBar } from '@/components/progress-bar';
import { MotionLazy } from '@/components/animate/motion-lazy';
import { LocalizationProvider } from '@/locales';
import { detectLanguage } from '@/locales/server';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Suspense } from 'react';
import { ThemeProvider } from '@/theme/theme-provider';
import GlobalProvider from '../GlobalProvider';
import MainProvider from '../MainProvider';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const instrument = Instrument_Sans({ subsets: ['latin'] });

export default async function Layout({ children }: Props) {
  const lang = CONFIG.isStaticExport ? 'en' : await detectLanguage();
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
    <html lang={lang ?? 'en'} suppressHydrationWarning>
      <body className={instrument.className}>
        <InitColorSchemeScript />
        <Suspense>
          <SettingsProvider 
            settings={settings} 
            caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}
          >
            <ThemeProvider>
              <MainProvider>
                <GlobalProvider>
                  <AuthGuard>
                    <SettingsDrawer />
                    <DashboardLayout>{children}</DashboardLayout>
                  </AuthGuard>
                </GlobalProvider>
              </MainProvider>
            </ThemeProvider>
          </SettingsProvider>
        </Suspense>
      </body>
    </html>
  );
}
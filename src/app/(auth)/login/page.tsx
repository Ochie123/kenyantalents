import dynamic from 'next/dynamic';
import MainProvider from '@/app/MainProvider';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

import Login from './Login';
export default function LoginPage() {
  return (
    <MainProvider>
   <Login/>
  </MainProvider>
  )
}
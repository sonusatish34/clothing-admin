// pages/_app.js
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useState } from 'react';
// import '@/styles/globals.css';

// export default function App({ Component, pageProps }) {
//   const [queryClient] = useState(() => new QueryClient());

//   return (
//     <QueryClientProvider client={queryClient}>
//       <Component {...pageProps} />
//     </QueryClientProvider>
//   );
// }
import "@/styles/globals.css";
import Head from "next/head";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '../components/Loader'

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <Loading />}
      <Component {...pageProps} />
    </>
      
  );
}

export default MyApp;


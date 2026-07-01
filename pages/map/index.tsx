import dynamic from 'next/dynamic';
import Layout from '@/components/Layout/Layout';
import { GoogleMapsProvider } from '@/components/GoogleMapsProvider';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px] w-full text-sm font-bold text-[#7c3aed] animate-pulse">
      Loading Delivery Map Canvas Environment...
    </div>
  ),
});

export default function MapPage() {
  return (
    <Layout
      Content={
        <GoogleMapsProvider>
          <MapClient />
        </GoogleMapsProvider>
      }
    />
  );
}

"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { useJsApiLoader, Libraries } from '@react-google-maps/api'; // Added Libraries type if using TS

const MapsContext = createContext({ isLoaded: false, loadError: null });

// 1. MUST be defined outside the component and cast as Libraries to keep references stable
const GLOBAL_MAP_LIBRARIES = ["drawing"];

export function GoogleMapsProvider({ children }) {
  // 2. Pass the external reference directly, or keep the option object static
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCAZmk-lXeb9OA1ebQIvgfUvE2a-3BfN40', // Note: Secure this in an env variable!
    libraries: GLOBAL_MAP_LIBRARIES,
  });

  // 3. Optional: Handle loading errors gracefully so your app doesn't silently break
  if (loadError) {
    console.error("Google Maps load error:", loadError);
  }

  const value = useMemo(
    () => ({ isLoaded: !loadError && isLoaded, loadError }),
    [isLoaded, loadError]
  );

  return (
    <MapsContext.Provider value={value}>
      {children}
    </MapsContext.Provider>
  );
}

export const useMapsContext = () => useContext(MapsContext);
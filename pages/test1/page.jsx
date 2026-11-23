"use client";
import { useEffect } from "react";
import Image from "next/image";
export default function InstallPage() {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // Android
    if (/android/i.test(ua)) {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.long_drive_cars.car&pcampaignid=web_share";
    }

    else if (/iPad|iPhone|iPod/.test(ua)) {
      window.location.href =
        "https://apps.apple.com/in/app/long-drive-cars-car-rental/id6466695391";
    }

    else {
      window.location.href = " http://localhost:3001/app-download";
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden flex justify-center items-center" >
      <Image
        src="/casebeer.webp"
        alt="Dozzy App Promotion"
        width={500}
        height={500}
        priority
        className="h-full" // This makes the image fill the area like a background
      />
    </div>
  );
}
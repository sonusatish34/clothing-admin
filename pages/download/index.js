"use client";
import { useEffect } from "react";
import Image from "next/image";
export default function InstallPage() {
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // Android
    if (/android/i.test(ua)) {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.dozzy_customer";
    }
//       https://play.google.com/store/apps/details?id=com.dozzy_customer&pcampaignid=web_share

    // iPhone / iPad


    else if (/iPad|iPhone|iPod/.test(ua)) {
      window.location.href =
        "https://apps.apple.com/app/dozzy-farmhouse-rental/id6670319530";
      // https://apps.apple.com/in/app/dozzy-farmhouse-rental/id6670319530
    }

    // Desktop fallback
    else {
      // window.location.href = " http://localhost:3001/app-download";
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        src="/casebeer.webp"
        alt="Dozzy App Promotion"
        fill
        priority
        className="h-fit w-fit" // This makes the image fill the area like a background
      />
    </div>
  );
}
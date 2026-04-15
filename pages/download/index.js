"use client";
import { useEffect } from "react";

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
      window.location.href = " http://localhost:3001/app-download";
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Redirecting...
        </h1>
        <p>Please wait</p>
      </div>
    </div>
  );
}
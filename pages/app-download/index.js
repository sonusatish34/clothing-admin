import React from 'react';
import Image from 'next/image';
const AppDownload = (props) => {
  // return (
  //   <div>
  //     <Image src={'/images/Dozzy123.webp'} width={500} height={500} className=''/>
  //     <Image src={'/images/app-store.svg'} width={500} height={500} className=''/>
  //     <Image src={'/images/play-store.png'} width={500} height={500} className=''/>
  //   </div>
  // );
 
  return (
  <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-white via-green-50 to-blue-50 flex items-center justify-center px-6">
    <div className="text-center">

      {/* App Icon */}
      <div className="mx-auto rounded-3xl flex items-center justify-center mb-5 p-4">
        <span className="text-white text-3xl font-extrabold tracking-wide">
           <Image src={'/images/Dozzy123.webp'} width={500} height={500} className=''/>
        </span>
      </div>

      {/* Brand Name */}
      {/* <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
        Dozzy
      </h1> */}

      <p className="text-sm text-gray-500 mt-2 mb-6">
        Please Click Below To Download App
      </p>

      {/* Download Buttons */}
      <div className="flex flex-col gap-6 items-center">

        <a
          href="https://play.google.com/store/apps/details?id=com.dozzy_customer"
          className=""
        >
          <img
            src="/images/play-store.png"
            alt="Google Play"
            className="h-20 w-72 object-contain"
          />
        </a>

        <a
          href="https://apps.apple.com/app/dozzy-farmhouse-rental/id6670319530"
          className=""
        >
          <img
            src="/images/app-store.svg"
            alt="App Store"
            className="h-20 w-72 object-contain"
          />
        </a>

      </div>
    </div>
  </div>
);
};

export default AppDownload;
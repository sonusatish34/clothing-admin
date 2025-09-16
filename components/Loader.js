import React from "react";
import Lottie from "lottie-react";
import animationData from "../public/shopping-cart.json"; // replace with your actual path

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
      <div className="w-40 h-40">
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default Loader;

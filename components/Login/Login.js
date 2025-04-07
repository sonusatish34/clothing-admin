import React from 'react';

const Login = (props) => {
  return (
    <div className='h-screen w-screen min-h-screen' style={{ backgroundImage: "url('/images/bglogin.png')", backgroundSize: 'cover' }}>

      <div className='flex justify-center items-center h-full w-full'>
        <div className='flex justify-center items-center '>
          <div className='bg-black xl:h-[500px] xl:w-[500px] lg:h-[400px] lg:w-[400px] h-[400px] w-[200px] rounded-l-md'></div>
          <div className="flex flex-col gap-y-3 justify-center items-left  bg-white xl:h-[500px] xl:w-[500px] h-[400px] w-[200px] lg:h-[400px] lg:w-[400px] px-14 p-6 rounded-r-md shadow-lg">
            <p className='mb-4 font-bold xl:text-5xl lg:text-4xl'>Please Login !</p>
            <input
              type="text"
              placeholder="Enter whatsapp number"
              className='border-none bg-gray-100 rounded-md p-2 mb-4 w-full'
            />
            <button className="w-full bg-[#493D9E] text-white py-2 rounded-md">Send Whatsapp OTP</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;

"use client"
import React from 'react';
import { useState } from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
const Login = ({ role }) => {
  console.log('88888');
  
  const router = useRouter();
  const [otpsent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;

    // Move to next input field automatically
    if (value !== '' && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    setOtp(newOtp);

  };
  const aa = otp.join('')

  const handleKeyDown = (e, index) => {
    // Allow Backspace to move focus backward
    if (e.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roleId, setRoleId] = useState('');
  const [error, setError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [approvalteam, setApprovalTeam] = useState('');
  const apiUrl = 'newdewwewe';

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (phoneNumber.length === 10) {
      await sendOtp();
    } else {
      setError('Please enter a valid phone number');
    }
  };
  const [resendotp, setResendOtp] = useState(0)
  useEffect(() => {
    const handleotp = async () => {

      if (phoneNumber.length === 10) {
        await sendOtp();
      } else {
        setError('Please enter a valid phone number');
      }
    };
    if (resendotp) {
      handleotp()
    }

  }, [resendotp])

  useEffect(() => {
    const usermobile = window.localStorage.getItem('user_phone');
    const usertoken = window.localStorage.getItem('' + usermobile + '_token');
    if (role == 'approval') {
      setApprovalTeam('5')
    }
    else {
      setApprovalTeam('0')
    }
    if (usermobile && usertoken) {
      router.push('/dashboard')
    }
    else {
      return
    }
  }, [])
  // const approvallogin = role==='approval' && "role_id" = 5'

  const sendOtp = async () => {
    const url = `https://ecommstagingapis.tboo.com/admin/send-otp`;
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile_number: phoneNumber,
        role_id: approvalteam

      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data?.data?.app_user_data?.role_id, "data");
      if (role !== 'approval') {
        window.localStorage.setItem('user_role_id', data?.data?.app_user_data?.role_id);
        window.localStorage.setItem('app_user_id', data?.data?.app_user_data?._id);
      }
      else {
        window.localStorage.setItem('user_role_id', data?.data?.app_user_data?.role_id);
        window.localStorage.setItem('app_user_id', data?.data?.app_user_data?._id);
      }

      if (response.ok && data.status === 'success') {
        setOtpSuccess(true);
      } else {
        setError('Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while sending OTP.');
    }
  };

  const validateOtp = async () => {
    const url = `https://ecommstagingapis.tboo.com/admin/otp-validate`;
    const userroleid = window.localStorage.getItem('user_role_id');
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp: otp.join(''),
        mobile_number: phoneNumber,
        role_id: userroleid,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (data.status === 'success') {
        setOtpValidated(true);
        window.localStorage.setItem('user_phone', phoneNumber);
        window.localStorage.setItem('' + phoneNumber + '_token', data.jwt_token);
        router.push('/dashboard');
      } else {
        setOtpError('Invalid OTP.');
      }
    } catch (error) {
      console.error('Error:', error);
      setOtpError('An error occurred while validating OTP.');
    }
  };

  return (
    <div className='h-screen w-screen min-h-screen' style={{ backgroundImage: "url('/images/bglogin.png')", backgroundSize: 'cover' }}>
      <div className='flex justify-center items-center h-full w-full'>
        <div className='flex flex-col lg:flex-row justify-center items-center'>
          <div className='bg-black xl:h-[500px] xl:w-[500px] lg:h-[400px] lg:w-[400px] h-[150px] w-[250px] lg:rounded-l-md rounded-tl-md'></div>
          {!otpSuccess &&
            <form onSubmit={handleSubmit} className="flex flex-col lg:gap-y-7 gap-y-4 justify-center items-left  bg-white xl:h-[500px] xl:w-[500px] h-[200px] w-[2
            50px] lg:h-[400px] lg:w-[400px] lg:px-14 lg:p-6 px-2 lg:rounded-r-md rounded-br-md shadow-lg">
              <p className=' font-bold xl:text-2xl lg:text-xl text-lg'> {role == 'approval' && <span className=''> Approval Team</span>}</p>
              <p className=' font-bold xl:text-5xl lg:text-4xl text-xl'> Please Login !</p>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  const formattedValue = e.target.value.replace(/[^0-9]/g, '');
                  if (formattedValue.length <= 10) {
                    setPhoneNumber(formattedValue);
                  }
                }}
                className="rounded-md outline-none bg-[#F5F5F5] opacity-100 text-black placeholder-black
               lg:text-2xl  text-xl p-3 placeholder:text-xs lg:placeholder:text-xs"
                placeholder="Enter your WhatsApp number"
                maxLength={10}
              />
              {error && <p className=' text-xs lg:text-lg text-red-400  '>{error}</p>}
              <button onClick={() => { setOtpSent(true) }} className="w-full bg-[#793FDF] text-white py-2 rounded-md cursor-pointer">Send Whatsapp OTP</button>
              {/* <button onClick={()=>{router.push('/dashboard')}}  className="w-full bg-[#793FDF] text-white py-2 rounded-md cursor-pointer">Guest Login</button> */}
            </form>}
          {otpSuccess && <div className="flex flex-col mxs lg:gap-y-3 gap-y-1 justify-center items-left bg-white  xl:h-[500px] xl:w-[500px] h-[200px] w-[250px] lg:h-[400px] lg:w-[400px] lg:px-14 lg:p-6 px-2 rounded-r-md shadow-lg">
            <p className='font-bold xl:text-xl lg:text-lg text-sm flex gap-x-2 items-center'><span>Whatsapp OTP</span><span><FaWhatsapp className='text-[#075E54] size-6' /></span></p>
            <p className='lg:text-3xl text-lg font-bold'>{phoneNumber}</p>
            <div>
              <div className='lg:py-4 py-2'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    className="xl:w-[80px] xl:h-[60px] lg:w-[60px] lg:h-[40px] h-10 w-10 text-center mx-[5px] text-[20px] border border-[#ccc] rounded-[10px] bg-[#F5F5F5]"
                  />
                ))}
              </div>
            </div>
            <div>
              <button onClick={() => { validateOtp() }} className="w-full lg:px-4 lg:py-4 py-1 bg-[#793FDF] text-white rounded-md cursor-pointer text-xl">Login</button>
              <p className='flex justify-between pt-3 text-xs'><span onClick={() => { setOtpSuccess(false) }} className='underline'>Change Number</span><span className='underline cursor-pointer' onClick={() => { setResendOtp(resendotp + 1) }} >Resend OTP</span></p>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default Login;
"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = ({ role }) => {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [approvalteam, setApprovalTeam] = useState("");
  const [error, setError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendotp, setResendOtp] = useState(0);
  useEffect(() => {
    function clearLocalStorageIfNewDay() {
      const storedTimestamp = window.localStorage.getItem("login_time");

      if (storedTimestamp) {
        const storedDate = new Date(parseInt(storedTimestamp));
        const currentDate = new Date();

        const storedDateStr = storedDate.toDateString();
        const currentDateStr = currentDate.toDateString();

        if (storedDateStr !== currentDateStr) {
          window.localStorage.clear();
          console.log("New day detected. LocalStorage cleared.");
        } else {
          console.log("Same day. No action taken.");
        }
      } else {
        console.log("No stored login time found.");
      }
    }

    clearLocalStorageIfNewDay(); // Clear old data if needed first

    const usermobile = window.localStorage.getItem("user_phone");
    const usertoken = usermobile
      ? window.localStorage.getItem(`${usermobile}_token`)
      : null;

    if (usermobile && usertoken) {
      // Already logged in
      router.push("/dashboard");
      return;
    }

    // Not logged in, set role data
    if (role === "approval") {
      setApprovalTeam("5");
      window.localStorage.setItem("user_role_id", "5");
    } else {
      setApprovalTeam("0");
      window.localStorage.setItem("user_role_id", "3");
    }

    window.localStorage.setItem("login_time", Date.now());
  }, []);


  useEffect(() => {
    const handleOtpResend = async () => {
      if (phoneNumber.length === 10) {
        await sendOtp();
      } else {
        setError("Please enter a valid phone number");
      }
    };
    if (resendotp) {
      handleOtpResend();
    }
  }, [resendotp]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    if (value !== "" && index < 3) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    setOtp(newOtp);
    setOtpError(""); // clear error on input
  };

  const handleKeyDown = (e, index) => {
  if (e.key === "Backspace" && otp[index] === "") {
    if (index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  if (e.key === "Enter") {
    if (otp.join("").length === 4) {
      validateOtp();
    } else {
      setOtpError("Please enter a valid 4-digit OTP.");
    }
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      await sendOtp();
    } else {
      setError("Please enter a valid phone number");
    }
  };

  const sendOtp = async () => {
    const url = `https://ecommstagingapi.tboo.com/admin/send-otp`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile_number: phoneNumber,
          role_id: approvalteam,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const roleId = data?.data?.app_user_data?.role_id;
        const userId = data?.data?.app_user_data?._id;

        window.localStorage.setItem("user_role_id", roleId);
        window.localStorage.setItem("app_user_id", userId);
        setOtpSuccess(true);
        setError("");
      } else {
        setError("Failed to send OTP.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("An error occurred while sending OTP.");
    }
  };

  const validateOtp = async () => {
    const url = `https://ecommstagingapi.tboo.com/admin/otp-validate`;
    const userroleid = window.localStorage.getItem("user_role_id");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp.join(""),
          mobile_number: phoneNumber,
          role_id: userroleid,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setOtpValidated(true);
        window.localStorage.setItem("user_phone", phoneNumber);
        window.localStorage.setItem(`${phoneNumber}_token`, data.jwt_token);
        router.push("/dashboard");
      } else {
        setOtpError("Invalid OTP.");
      }
    } catch (err) {
      console.error("Error validating OTP:", err);
      setOtpError("An error occurred while validating OTP.");
    }
  };
  const mobilenofocus = useRef(null);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (mobilenofocus.current) {
      mobilenofocus.current.focus();
    }
  }, [])
  useEffect(() => {
    if (otpSuccess && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [otpSuccess]);

  return (
    <div
      className="h-screen w-screen min-h-screen"
      style={{
        backgroundImage: "url('/images/bglogin.png')",
        backgroundSize: "cover",
      }}
    >
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex flex-col lg:flex-row justify-center items-center">
          <div className="bg-black xl:h-[500px] xl:w-[500px] lg:h-[400px] lg:w-[400px] h-[150px] w-full lg:rounded-l-md rounded-tl-md rounded-tr-md lg:rounded-tr-none "></div>

          {!otpSuccess ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col lg:gap-y-7 gap-y-4 justify-center items-left bg-white xl:h-[500px] xl:w-[550px] h-[250px] w-full lg:h-[400px] lg:w-[500px] lg:px-14 lg:p-6 px-2 lg:rounded-r-md rounded-br-md rounded-bl-md lg:rounded-bl-none  shadow-lg"
            >
              <Link className="text-white w-fit" href={'/approval-login'}>Approval Link</Link>
              <p className="font-bold xl:text-2xl lg:text-xl text-lg">
                {role === "approval" && "Approval Team"}
              </p>
              <p className="font-bold xl:text-5xl lg:text-4xl text-xl">
                Please Login!
              </p>
              <input
                ref={mobilenofocus}
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  const formattedValue = e.target.value.replace(/[^0-9]/g, "");
                  if (formattedValue.length <= 10) {
                    setPhoneNumber(formattedValue);
                    setError("");
                  }
                }}
                className="rounded-md outline-none bg-[#F5F5F5] text-black placeholder-black placeholder:text-base lg:text-2xl text-xl p-3"
                placeholder="Enter your WhatsApp number"
                maxLength={10}
              />
              {error && (
                <p className="text-xs lg:text-lg text-red-400">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-[#793FDF] text-white py-2 rounded-md cursor-pointer"
              >
                Send WhatsApp OTP
              </button>
            </form>
          ) : (
            <div className="flex flex-col lg:gap-y-3 gap-y-1 justify-center items-left bg-white xl:h-[500px] xl:w-[500px] h-[200px] w-[250px] lg:h-[400px] lg:w-[400px] lg:px-14 lg:p-6 px-2 rounded-r-md shadow-lg">
              <p className="font-bold xl:text-xl lg:text-lg text-sm flex gap-x-2 items-center">
                <span>WhatsApp OTP</span>
                <FaWhatsapp className="text-[#075E54] size-6" />
              </p>
              <p className="lg:text-3xl text-lg font-bold">{phoneNumber}</p>
              <div className="lg:py-4 py-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
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
              <button
                onClick={() => {
                  if (otp.join("").length === 4) {
                    validateOtp();
                  } else {
                    setOtpError("Please enter a valid 4-digit OTP.");
                  }
                }}
                className="w-full lg:px-4 lg:py-4 py-1 bg-[#793FDF] text-white rounded-md cursor-pointer text-xl"
              >
                Login
              </button>
              {otpError && (
                <p className="text-xs text-red-500 pt-2">{otpError}</p>
              )}
              <div className="flex justify-between pt-3 text-xs">
                <span
                  onClick={() => {
                    setOtpSuccess(false);
                    setOtp(["", "", "", ""]);
                  }}
                  className="underline cursor-pointer"
                >
                  Change Number
                </span>
                <span
                  onClick={() => {
                    setResendOtp(resendotp + 1);
                  }}
                  className="underline cursor-pointer"
                >
                  Resend OTP
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

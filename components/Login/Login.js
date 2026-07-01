"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const Login = ({ role = "admin" }) => {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [approvalteam, setApprovalTeam] = useState("");
  const [error, setError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);

  const mobilenofocus = useRef(null);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const userRoleId = localStorage.getItem('user_role_id');
    if (router.asPath === '/approval-login' && userRoleId === '5') {
      return;
    } else if (router.asPath === '/' && (userRoleId === '3' || userRoleId === '5')) {
      return;
    } else {
      localStorage.clear();
    }
  }, [router.asPath]);

  useEffect(() => {
    function clearLocalStorageIfNewDay() {
      const storedTimestamp = window.localStorage.getItem("login_time");
      if (storedTimestamp) {
        const storedDate = new Date(parseInt(storedTimestamp));
        const currentDate = new Date();
        if (storedDate.toDateString() !== currentDate.toDateString()) {
          window.localStorage.clear();
          console.log("New day detected. LocalStorage cleared.");
        }
      }
    }

    clearLocalStorageIfNewDay();
    const usermobile = window.localStorage.getItem("user_phone");
    const usertoken = usermobile ? window.localStorage.getItem(`${usermobile}_token`) : null;

    if (usermobile && usertoken) {
      router.push("/dashboard");
      return;
    }

    if (role === "approval") {
      setApprovalTeam("5");
      window.localStorage.setItem("user_role_id", "5");
    } else {
      setApprovalTeam("3");
      window.localStorage.setItem("user_role_id", "3");
    }

    window.localStorage.setItem("login_time", Date.now());
  }, [role, router]);

  // Handle focus on components loading/switching
  useEffect(() => {
    if (!otpSuccess && mobilenofocus.current) {
      mobilenofocus.current.focus();
    }
  }, [otpSuccess]);

  useEffect(() => {
    if (otpSuccess && otpInputRefs.current[0]) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 50);
    }
  }, [otpSuccess]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character if user types fast
    setOtp(newOtp);
    setOtpError("");

    if (value !== "" && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
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
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    await sendOtp();
  };

  const sendOtp = async () => {
    setIsSendingOtp(true);
    setError("");
    const url = `https://dev.zuget.com/admin/send-otp`;

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
      } else {
        setError(data?.message || "Failed to send OTP. Try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("An error occurred while sending OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const validateOtp = async () => {
    if (otp.join("").length !== 4) {
      setOtpError("Please fill out all 4 digits.");
      return;
    }

    setIsValidatingOtp(true);
    setOtpError("");
    const url = `https://dev.zuget.com/admin/otp-validate`;
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
          redirect: "follow"
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        window.localStorage.setItem("user_phone", phoneNumber);
        window.localStorage.setItem(`${phoneNumber}_token`, data.jwt_token);
        router.push("/dashboard");
      } else {
        setOtpError(data?.message || "Invalid OTP verification failed.");
      }
    } catch (err) {
      console.error("Error validating OTP:", err);
      setOtpError("An error occurred while validating OTP.");
    } finally {
      setIsValidatingOtp(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex justify-center items-center bg-cover bg-center p-4 bg-no-repeat"
      style={{ backgroundImage: "url('/images/bglogin.png')" }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px]">
        {/* Left Side: Brand/Image */}
        <div className="relative w-full md:w-1/2 min-h-[200px] md:min-h-full bg-slate-100">
          <Image
            src="/loggo.png"
            alt="Logo Display"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Right Side: Dynamic Form Container */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 lg:p-12 bg-white">
          {!otpSuccess ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  {role === "approval" ? "Approval" : "Admin"}
                </span>
                <Link
                  className="text-xs font-medium text-[#793FDF] hover:underline"
                  href="/approval-login"
                >
                  Approval Link
                </Link>
              </div>

              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  Welcome Back
                </h1>
                {/* <p className="text-sm text-slate-500 mt-1">
                  Please verify your identity to access your account.
                </p> */}
              </div>

              <div className="flex flex-col gap-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  WhatsApp Mobile Number
                </label>
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
                  className="w-full rounded-xl outline-none border border-slate-200 focus:border-[#793FDF] focus:ring-4 focus:ring-purple-100 transition-all text-slate-800 text-lg px-4 py-3 placeholder:text-slate-400"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  disabled={isSendingOtp}
                />
                {error && <p className="text-xs font-medium text-rose-500 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSendingOtp || phoneNumber.length !== 10}
                className="w-full flex items-center justify-center gap-x-2 bg-[#793FDF] hover:bg-[#612ec4] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl shadow-md shadow-purple-100 transition-all cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <span>Send WhatsApp OTP</span>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-y-6">
              <div className="flex items-center gap-x-2 text-emerald-600 font-semibold text-sm bg-emerald-50 w-fit px-3 py-1 rounded-full">
                <FaWhatsapp className="text-lg" />
                <span>Code Sent via WhatsApp</span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  Enter 4-Digit OTP
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Sent to <span className="font-bold text-slate-700">{phoneNumber}</span>
                </p>
              </div>

              {/* OTP Grid */}
              <div className="flex gap-x-3 my-2 justify-start">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    disabled={isValidatingOtp}
                    className="w-14 h-14 text-center font-bold text-xl border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:bg-white focus:border-[#793FDF] focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  />
                ))}
              </div>

              {otpError && <p className="text-xs font-medium text-rose-500">{otpError}</p>}

              <button
                onClick={validateOtp}
                disabled={isValidatingOtp || otp.join("").length !== 4}
                className="w-full flex items-center justify-center gap-x-2 bg-[#793FDF] hover:bg-[#612ec4] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer text-lg"
              >
                {isValidatingOtp ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Login</span>
                )}
              </button>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs font-medium text-slate-500">
                <button
                  type="button"
                  disabled={isValidatingOtp}
                  onClick={() => {
                    setOtpSuccess(false);
                    setOtp(["", "", "", ""]);
                    setOtpError("");
                  }}
                  className="hover:text-[#793FDF] underline disabled:opacity-50"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Change Number
                </button>
                <button
                  type="button"
                  disabled={isSendingOtp || isValidatingOtp}
                  onClick={sendOtp}
                  className="hover:text-[#793FDF] underline disabled:opacity-50"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {isSendingOtp ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
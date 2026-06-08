"use client";

import { useState, useEffect } from "react";

interface Props {
  phoneNumber: string;
  onSendOTP: () => Promise<boolean>;
  onVerifyOTP: (otp: string) => Promise<boolean>;
  onClose: () => void;
}

export default function OTPVerification({ phoneNumber, onSendOTP, onVerifyOTP, onClose }: Props) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Auto send OTP when component mounts
    handleSendOTP();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendOTP = async () => {
    setIsSending(true);
    await onSendOTP();
    setIsSending(false);
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      alert("Please enter 6-digit OTP");
      return;
    }
    setLoading(true);
    await onVerifyOTP(otpCode);
    setLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(30);
    await handleSendOTP();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600 text-xl">✕</button>
        
        <div className="text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold mb-2">Verify Your Number</h2>
          <p className="text-gray-500 mb-6">
            Enter the 6-digit OTP sent to <strong>{phoneNumber}</strong>
          </p>
          
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <button
            onClick={handleVerify}
            disabled={loading || otp.some(d => !d)}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify & Submit"}
          </button>
          
          <div className="mt-4">
            {canResend ? (
              <button onClick={handleResend} className="text-green-600" disabled={isSending}>
                {isSending ? "Sending..." : "Resend OTP"}
              </button>
            ) : (
              <p className="text-gray-400">Resend OTP in {timer}s</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
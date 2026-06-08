"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Props {
  propertyName: string;
  onVerified: (phone: string) => void;
  onClose?: () => void;
}

export default function OTPVerification({ propertyName, onVerified, onClose }: Props) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === "otp") {
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
    }
  }, [step]);

  const sendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("OTP sent successfully!");
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: otpCode }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Verified successfully!");
        onVerified(cleanPhone);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <button onClick={onClose} className="float-right text-gray-400 hover:text-gray-600">
          ✕
        </button>

        {step === "phone" ? (
          <>
            <div className="text-center">
              <div className="text-5xl mb-4">📞</div>
              <h2 className="text-2xl font-bold mb-2">Verify Your Number</h2>
              <p className="text-gray-500 mb-6">
                Enter your mobile number to get OTP for {propertyName}
              </p>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                className="w-full p-4 border border-gray-300 rounded-xl text-center text-lg mb-4"
                autoFocus
              />
              <button
                onClick={sendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold mb-2">Enter OTP</h2>
              <p className="text-gray-500 mb-6">Enter the 6-digit OTP sent to {phone}</p>
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <button
                onClick={verifyOTP}
                disabled={loading || otp.some(d => !d)}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              {canResend ? (
                <button onClick={sendOTP} className="mt-4 text-green-600">
                  Resend OTP
                </button>
              ) : (
                <p className="mt-4 text-gray-400">Resend OTP in {timer}s</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
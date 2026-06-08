"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type Props = {
  propertyName: string;
  propertyId?: string;
  agentName?: string;
  agentPhone?: string;
  postedBy?: string;
  onVerified: (phoneNumber: string) => void;
  onClose?: () => void;
};

export default function OTPVerification({ 
  propertyName, 
  onVerified, 
  onClose 
}: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
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

  // Send OTP
  const sendOTP = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
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
        toast.success("OTP sent to your mobile number");
        setStep("otp");
        // For testing - show OTP in console
        console.log("📱 Test OTP:", data.testOtp);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: otpCode }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("OTP verified successfully!");
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

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("OTP resent successfully!");
        setTimer(30);
        setCanResend(false);
      } else {
        toast.error(data.error || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="otpOverlay" onClick={onClose}>
      <div className="otpModal" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose}>×</button>
        
        {step === "phone" ? (
          <>
            <div className="otpIcon">📞</div>
            <h3>Verify Your Number</h3>
            <p>Enter your mobile number to get OTP for {propertyName}</p>
            
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
              className="phoneInput"
              autoFocus
            />
            
            <button onClick={sendOTP} disabled={loading} className="sendBtn">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="otpIcon">🔐</div>
            <h3>Enter OTP</h3>
            <p>We've sent a 6-digit OTP to {phoneNumber}</p>
            
            <div className="otpInputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otpInput"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            <button onClick={verifyOTP} disabled={loading} className="verifyBtn">
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
            
            <div className="resendSection">
              {canResend ? (
                <button onClick={handleResendOTP} className="resendBtn">
                  Resend OTP
                </button>
              ) : (
                <span className="timer">Resend OTP in {timer}s</span>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .otpOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }
        .otpModal {
          background: white;
          border-radius: 28px;
          padding: 40px;
          max-width: 450px;
          width: 90%;
          text-align: center;
          position: relative;
          animation: slideUp 0.4s ease;
        }
        .closeBtn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f1f5f9;
          font-size: 20px;
          cursor: pointer;
        }
        .otpIcon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .otpModal h3 {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 8px;
        }
        .otpModal p {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .phoneInput {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          text-align: center;
          margin-bottom: 24px;
        }
        .phoneInput:focus {
          outline: none;
          border-color: #16a34a;
        }
        .sendBtn, .verifyBtn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .sendBtn:disabled, .verifyBtn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .otpInputs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }
        .otpInput {
          width: 55px;
          height: 60px;
          text-align: center;
          font-size: 24px;
          font-weight: 600;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
        }
        .otpInput:focus {
          outline: none;
          border-color: #16a34a;
        }
        .resendSection {
          margin-top: 20px;
        }
        .resendBtn {
          background: none;
          border: none;
          color: #16a34a;
          font-weight: 600;
          cursor: pointer;
        }
        .timer {
          color: #94a3b8;
          font-size: 13px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerify: (token: string) => Promise<void>;
  enquiryData: any;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  sendOTP?: (phone: string) => Promise<void>;
}

export default function OTPModal({
  isOpen,
  onClose,
  phoneNumber,
  onVerify,
  enquiryData,
  verifyOTP,
  sendOTP,
}: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer, canResend]);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setError("");
      setLoading(false);
      setTimer(30);
      setCanResend(false);
      console.log("📱 OTP Modal opened for:", phoneNumber);
    }
  }, [isOpen, phoneNumber]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    console.log("🔐 Verifying OTP...", { phoneNumber, otp });

    // ✅ Check if OTP is entered
    if (!otp || otp.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Pass both phone and OTP
      const verified = await verifyOTP(phoneNumber, otp);
      console.log("OTP verification result:", verified);

      if (verified) {
        const tempToken = `temp_${Date.now()}_${phoneNumber}`;
        console.log("✅ OTP verified, submitting enquiry...");
        await onVerify(tempToken);
        console.log("✅ Enquiry submitted successfully");
        toast.success("Phone verified & enquiry submitted!");
        onClose();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    console.log("📱 Resending OTP...", phoneNumber);
    if (sendOTP) {
      setLoading(true);
      setError("");
      try {
        await sendOTP(phoneNumber);
        setTimer(30);
        setCanResend(false);
        toast.success("OTP resent successfully");
      } catch (err: any) {
        console.error("Resend error:", err);
        setError(err.message || "Failed to resend OTP");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "32px",
          width: "90%",
          maxWidth: "450px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#dbeafe",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#111827" }}>
            Verify Your Number
          </h3>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Enter OTP sent to <strong style={{ color: "#2563eb" }}>{phoneNumber}</strong>
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setOtp(value);
              setError("");
              console.log("OTP input changed:", value);
            }}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "24px",
              textAlign: "center",
              letterSpacing: "8px",
              border: `2px solid ${error ? "#ef4444" : "#e5e7eb"}`,
              borderRadius: "12px",
              outline: "none",
              fontFamily: "monospace",
            }}
            placeholder="000000"
            autoFocus
          />
        </div>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "#fef2f2",
              borderRadius: "8px",
              color: "#dc2626",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "#9ca3af" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "16px",
          }}
        >
          {loading ? "Verifying & Submitting..." : "Verify & Submit"}
        </button>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            style={{
              background: "none",
              border: "none",
              color: canResend ? "#2563eb" : "#9ca3af",
              fontSize: "14px",
              cursor: canResend ? "pointer" : "not-allowed",
              textDecoration: "underline",
            }}
          >
            {canResend ? "Resend OTP" : `Resend in ${timer}s`}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "transparent",
            color: "#6b7280",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
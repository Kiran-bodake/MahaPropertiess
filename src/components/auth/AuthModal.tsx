"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onClose: () => void;
  onLoginSuccess?: (userData: any) => void;
};

export default function AuthModal({ onClose, onLoginSuccess }: Props) {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");

  const [mobile, setMobile] = useState("");

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);

  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidMobile = /^[6-9]\d{9}$/.test(mobile);

  const isOtpComplete = otp.every((digit) => digit !== "");

  /* PREVENT SCROLL */
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* TIMER */
  useEffect(() => {
    if (step !== "otp") return;

    setTimer(30);

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  /* OTP FOCUS */
  useEffect(() => {
    if (step === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  /* SEND OTP */
  const sendOtp = async () => {
    setError("");

    if (!isValidMobile) {
      setError("Enter valid mobile number");

      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          phone: mobile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");

        return;
      }

      setStep("otp");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
  const verifyOtp = async () => {
    try {
      setLoading(true);

      const finalOtp = otp.join("");

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          phone: mobile,
          otp: finalOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");

        return;
      }
const userData = {

  _id:
    data.user?._id || "",

  name:
    data.user?.name || "User",

  phone:
    data.user?.phone || mobile,

  email:
    data.user?.email || "",

  role:
    data.user?.role || "user"

};


localStorage.setItem(

  "token",

  data.token || "loggedin"

);


localStorage.setItem(

  "user",

  JSON.stringify(userData)

);


console.log(

  "LOGIN USER:",

  userData

);


if (onLoginSuccess) {

  onLoginSuccess(userData);

}

onClose();
    } catch {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* OTP INPUT */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];

    updated[index] = value;

    setOtp(updated);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <>
      <div
        className="authOverlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="authModal">
          <button className="closeBtn" onClick={onClose}>
            ✕
          </button>

          {/* ICON */}
          <div className="iconWrap">
            <div className="shieldIcon">🛡️</div>
          </div>

          {/* MOBILE STEP */}
          {step === "mobile" && (
            <>
              <h1 className="authTitle">Login</h1>

              <p className="authSubtitle">
                Secure access to your MahaProperties account
              </p>

              <label className="fieldLabel">Phone Number</label>

              <div className="phoneField">
                <div className="countryCode">+91</div>

                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter mobile number"
                  className="mobileInput"
                  maxLength={10}
                />
              </div>

              {error && <p className="errorText">{error}</p>}

              <button
                onClick={sendOtp}
                disabled={!isValidMobile || loading}
                className="primaryBtn"
              >
                {loading ? "Sending..." : "Get OTP →"}
              </button>

              <p className="bottomText">Secure OTP Verification</p>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <>
              <h1 className="authTitle">Verify OTP</h1>

              <p className="authSubtitle">Enter the 6-digit OTP sent to</p>

              <h3 className="mobileNumber">+91 {mobile}</h3>

              <div className="otpWrap">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="otpInput"
                  />
                ))}
              </div>

              {error && <p className="errorText">{error}</p>}

              <p className="resendText">Didn’t receive OTP?</p>

              <button className="resendBtn">Resend OTP in ({timer}s)</button>

              <button
                onClick={verifyOtp}
                disabled={!isOtpComplete || loading}
                className="primaryBtn"
              >
                {loading ? "Verifying..." : "Verify & Continue →"}
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .authOverlay {
          position: fixed;

          inset: 0;

          z-index: 9999;

          background: rgba(15, 23, 42, 0.55);

          backdrop-filter: blur(8px);

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 20px;
        }

        .authModal {
          width: 100%;

          max-width: 430px;

          background: #ffffff;

          opacity: 1;

          border-radius: 24px;

          padding: 34px 28px;

          position: relative;

          z-index: 10000;

          border: 1px solid #f1f5f9;

          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.18);

          animation: popup 0.25s ease;
        }

        @keyframes popup {
          from {
            opacity: 0;

            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;

            transform: translateY(0) scale(1);
          }
        }

        .closeBtn {
          position: absolute;

          top: 16px;
          right: 16px;

          width: 36px;
          height: 36px;

          border: none;

          background: #f8fafc;

          border-radius: 50%;

          cursor: pointer;

          color: #64748b;

          font-size: 1rem;

          transition: 0.2s;
        }

        .closeBtn:hover {
          background: #eef2f7;
        }

        .iconWrap {
          display: flex;

          justify-content: center;
        }

        .shieldIcon {
          width: 60px;
          height: 60px;

          border-radius: 50%;

          background: #dcfce7;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 1.7rem;
        }

        .authTitle {
          margin: 20px 0 0;

          text-align: center;

          font-size: 2rem;

          font-weight: 900;

          color: #0f172a;

          letter-spacing: -0.04em;
        }

        .authSubtitle {
          margin-top: 12px;

          text-align: center;

          color: #64748b;

          line-height: 1.6;

          font-size: 0.96rem;
        }

        .fieldLabel {
          display: block;

          margin-top: 24px;

          margin-bottom: 10px;

          font-size: 0.92rem;

          font-weight: 700;

          color: #0f172a;
        }

        .phoneField {
          height: 54px;

          border: 1.5px solid #dbe4ee;

          border-radius: 14px;

          overflow: hidden;

          display: flex;

          align-items: center;

          background: #ffffff;

          transition: 0.2s;
        }

        .phoneField:focus-within {
          border-color: #16a34a;

          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.08);
        }

        .countryCode {
          width: 70px;

          height: 100%;

          display: flex;

          align-items: center;

          justify-content: center;

          border-right: 1px solid #e2e8f0;

          font-weight: 700;

          color: #0f172a;

          background: #f8fafc;
        }

        .mobileInput {
          flex: 1;

          height: 100%;

          border: none;

          outline: none;

          padding: 0 16px;

          font-size: 0.96rem;

          color: #0f172a;

          background: transparent;
        }

        .mobileInput::placeholder {
          color: #94a3b8;
        }

        .primaryBtn {
          width: 100%;

          height: 52px;

          border: none;

          border-radius: 14px;

          margin-top: 26px;

          background: linear-gradient(135deg, #166534 0%, #16a34a 100%);

          color: white;

          font-size: 0.96rem;

          font-weight: 800;

          cursor: pointer;

          transition: 0.25s;
        }

        .primaryBtn:hover {
          transform: translateY(-2px);

          box-shadow: 0 10px 25px rgba(22, 163, 74, 0.25);
        }

        .primaryBtn:disabled {
          opacity: 0.7;

          cursor: not-allowed;

          transform: none;
        }

        .bottomText {
          margin-top: 16px;

          text-align: center;

          color: #64748b;

          font-size: 0.88rem;
        }

        .mobileNumber {
          margin-top: 10px;

          text-align: center;

          font-size: 1.2rem;

          font-weight: 800;

          color: #0f172a;
        }

        .otpWrap {
          display: flex;

          justify-content: center;

          gap: 8px;

          margin-top: 24px;

          flex-wrap: wrap;
        }

        .otpInput {
          width: 46px;
          height: 50px;

          border-radius: 12px;

          border: 1.5px solid #dbe4ee;

          text-align: center;

          font-size: 1.1rem;

          font-weight: 800;

          outline: none;

          transition: 0.2s;

          background: #ffffff;
        }

        .otpInput:focus {
          border-color: #16a34a;

          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.12);
        }

        .resendText {
          margin-top: 20px;

          text-align: center;

          color: #64748b;

          font-size: 0.9rem;
        }

        .resendBtn {
          display: block;

          margin: 8px auto 0;

          border: none;

          background: none;

          color: #166534;

          font-size: 0.92rem;

          font-weight: 700;

          cursor: pointer;
        }

        .errorText {
          margin-top: 12px;

          color: #dc2626;

          font-size: 0.88rem;

          text-align: center;
        }

        /* MOBILE */

        @media (max-width: 640px) {
          .authOverlay {
            padding: 16px;
          }

          .authModal {
            max-width: 100%;

            padding: 28px 18px;

            border-radius: 20px;
          }

          .shieldIcon {
            width: 54px;
            height: 54px;

            font-size: 1.5rem;
          }

          .authTitle {
            font-size: 1.8rem;
          }

          .authSubtitle {
            font-size: 0.9rem;
          }

          .fieldLabel {
            margin-top: 20px;
          }

          .phoneField {
            height: 50px;
          }

          .countryCode {
            width: 62px;

            font-size: 0.9rem;
          }

          .mobileInput {
            font-size: 0.92rem;

            padding: 0 14px;
          }

          .primaryBtn {
            height: 50px;

            font-size: 0.92rem;
          }

          .otpWrap {
            gap: 6px;
          }

          .otpInput {
            width: 42px;
            height: 46px;

            font-size: 1rem;
          }

          .closeBtn {
            top: 12px;
            right: 12px;

            width: 34px;
            height: 34px;
          }
        }
      `}</style>
    </>
  );
}

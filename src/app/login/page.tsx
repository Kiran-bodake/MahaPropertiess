"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {

  const [step, setStep] =
    useState<"mobile" | "otp">(
      "mobile"
    );

  const [mobile, setMobile] =
    useState("");

  const [otp, setOtp] =
    useState<string[]>([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [loading, setLoading] =
    useState(false);

  const [timer, setTimer] =
    useState(30);

  const [error, setError] =
    useState("");

  const inputRefs =
    useRef<
      (
        HTMLInputElement | null
      )[]
    >([]);

  const isValidMobile =
    mobile.length === 10;

  const isOtpComplete =
    otp.every(
      (d) => d !== ""
    );

  /* TIMER */
  useEffect(() => {

    if (step !== "otp")
      return;

    setTimer(30);

    const interval =
      setInterval(() => {

        setTimer(
          (prev) =>
            prev > 0
              ? prev - 1
              : 0
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [step]);

  /* OTP AUTO FOCUS */
  useEffect(() => {

    if (
      step === "otp"
    ) {

      inputRefs.current[0]?.focus();

    }

  }, [step]);

  /* SEND OTP */
  const sendOtp =
    async () => {

      setError("");

      if (
        !/^[6-9]\d{9}$/.test(
          mobile
        )
      ) {

        setError(
          "Enter valid mobile number"
        );

        return;

      }

      try {

        setLoading(
          true
        );

        const res =
          await fetch(
            "/api/auth/send-otp",
            {
              method:
                "POST",

              headers:
                {
                  "Content-Type":
                    "application/json",
                },

              body: JSON.stringify(
                {
                  phone:
                    mobile,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (
          !res.ok
        ) {

          setError(
            data.error ||
              "Failed to send OTP"
          );

          return;

        }

        alert(
          "OTP: " +
            data.otp
        );

        setStep(
          "otp"
        );

      } catch {

        setError(
          "Server error"
        );

      } finally {

        setLoading(
          false
        );

      }

    };

  /* VERIFY OTP */
  const verifyOtp =
    async () => {

      if (
        loading
      )
        return;

      setLoading(
        true
      );

      setError("");

      try {

        const finalOtp =
          otp.join(
            ""
          );

        const res =
          await fetch(
            "/api/auth/verify-otp",
            {
              method:
                "POST",

              headers:
                {
                  "Content-Type":
                    "application/json",
                },

              body: JSON.stringify(
                {
                  phone:
                    mobile,

                  otp:
                    finalOtp,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (
          !res.ok
        ) {

          setError(
            data.error ||
              "Invalid OTP"
          );

          return;

        }

        /* Save token */
       localStorage.setItem(
  "token",
  data.token
);

localStorage.setItem(

  "user",

  JSON.stringify({

    _id:
      data.user?._id,

    name:
      data.user?.name ||
      "User",

    phone:
      data.user?.phone ||
      mobile,

  })

);

window.location.href =
  "/";

      } catch {

        setError(
          "Verification failed"
        );

      } finally {

        setLoading(
          false
        );

      }

    };

  /* OTP INPUT */
  const handleOtpChange =
    (
      value: string,

      index: number
    ) => {

      if (
        !/^\d?$/.test(
          value
        )
      )
        return;

      const updated =
        [...otp];

      updated[
        index
      ] = value;

      setOtp(
        updated
      );

      if (
        value &&
        index <
          otp.length -
            1
      ) {

        inputRefs.current[
          index + 1
        ]?.focus();

      }

    };

  return (
    <>

      <Navbar />

      <main
        style={{
          background:
            "#f4f7fb",

          minHeight:
            "100vh",
        }}
      >

        {/* HERO */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#052e16,#166534,#16a34a)",

            padding:
              "40px 20px",

            textAlign:
              "center",
          }}
        >

          <h1
            style={{
              color:
                "#fff",

              margin: 0,
            }}
          >
            Login / Signup
          </h1>

        </div>

        {/* CARD */}
        <div
          style={{
            maxWidth:
              "430px",

            margin:
              "50px auto",

            padding:
              "0 16px",
          }}
        >

          <div
            style={{
              background:
                "#fff",

              borderRadius:
                "22px",

              padding:
                "30px",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >

            <h2
              style={{
                textAlign:
                  "center",
              }}
            >
              {
                step ===
                "mobile"
                  ? "Sign In"
                  : "Verify OTP"
              }
            </h2>

            {/* MOBILE */}
            {step ===
              "mobile" && (
              <>

                <input
                  value={
                    mobile
                  }

                  onChange={(
                    e
                  ) =>
                    setMobile(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }

                  placeholder="Enter mobile number"

                  style={{
                    width:
                      "100%",

                    height:
                      "48px",

                    padding:
                      "0 14px",

                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "12px",

                    marginTop:
                      "20px",
                  }}
                />

                {error && (
                  <p
                    style={{
                      color:
                        "red",

                      fontSize:
                        "12px",
                    }}
                  >
                    {
                      error
                    }
                  </p>
                )}

                <button
                  onClick={
                    sendOtp
                  }

                  disabled={
                    !isValidMobile ||
                    loading
                  }

                  style={{
                    width:
                      "100%",

                    height:
                      "50px",

                    marginTop:
                      "20px",

                    border:
                      "none",

                    borderRadius:
                      "12px",

                    color:
                      "#fff",

                    cursor:
                      "pointer",

                    background:
                      "#16a34a",
                  }}
                >
                  {loading
                    ? "Sending..."
                    : "Send OTP"}
                </button>

              </>
            )}

            {/* OTP */}
            {step ===
              "otp" && (
              <>

                <div
                  style={{
                    display:
                      "flex",

                    gap:
                      "8px",

                    justifyContent:
                      "center",

                    marginTop:
                      "20px",
                  }}
                >

                  {otp.map(
                    (
                      digit,

                      i
                    ) => (
                      <input
                        key={
                          i
                        }

                       
  ref={(el) => {
    inputRefs.current[i] =
      el;
  }}
                        value={
                          digit
                        }

                        maxLength={
                          1
                        }

                        onChange={(
                          e
                        ) =>
                          handleOtpChange(
                            e
                              .target
                              .value,

                            i
                          )
                        }

                        style={{
                          width:
                            "45px",

                          height:
                            "50px",

                          textAlign:
                            "center",

                          border:
                            "1px solid #ddd",

                          borderRadius:
                            "12px",
                        }}
                      />
                    )
                  )}

                </div>

                <button
                  onClick={() => {

                    if (
                      !loading
                    ) {

                      verifyOtp();

                    }

                  }}

                  disabled={
                    !isOtpComplete ||
                    loading
                  }

                  style={{
                    width:
                      "100%",

                    height:
                      "50px",

                    marginTop:
                      "20px",

                    border:
                      "none",

                    borderRadius:
                      "12px",

                    color:
                      "#fff",

                    cursor:
                      "pointer",

                    background:
                      "#16a34a",
                  }}
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}
                </button>

                <p
                  style={{
                    textAlign:
                      "center",

                    marginTop:
                      "15px",
                  }}
                >
                  Resend OTP in{" "}
                  {
                    timer
                  }
                  s
                </p>

              </>
            )}

          </div>

        </div>

      </main>

      <Footer />

    </>
  );

}
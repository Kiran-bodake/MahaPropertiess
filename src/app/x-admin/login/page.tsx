"use client";

import { useState, type FormEvent } from "react";

import { useRouter } from "next/navigation";

import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [securityCode, setSecurityCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          securityCode,
        }),
      });

      let data: {
        message?: string;
      } = {};

      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      router.push("/x-admin/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    fontWeight: 500,
    color: "#0f172a",
    background: "#ffffff",
    boxShadow: "0 4px 18px rgba(15,23,42,0.04)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "980px",
          minHeight: "580px",
          background: "#ffffff",
          borderRadius: "40px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(15,23,42,0.12)",
          display: "flex",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            width: "42%",
            background: "linear-gradient(135deg,#4338ca,#312e81)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "35px",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src="/maha.png"
              alt="Maha"
              style={{
                width: "130px",
              }}
            />

            <p
              style={{
                marginTop: "16px",
                fontSize: "10px",
                letterSpacing: "2px",
                color: "#94a3b8",
                fontWeight: 700,
              }}
            ></p>
          </div>

          <h2
            style={{
              color: "#ffffff",
              marginTop: "40px",
              fontSize: "30px",
              fontWeight: 700,
            }}
          ></h2>

          <p
            style={{
              color: "#c7d2fe",
              fontSize: "14px",
              marginTop: "10px",
              maxWidth: "300px",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          ></p>
        </div>

        {/* RIGHT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <p
              style={{
                color: "#4f46e5",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              Welcome back
            </p>

            <h1
              style={{
                fontSize: "34px",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.1,
                marginBottom: "12px",
              }}
            >
              Sign in to your account
            </h1>

            <p
              style={{
                color: "#64748b",
                marginBottom: "30px",
              }}
            >
              Securely access your admin dashboard.
            </p>

            {/* Google */}
            <button
              onClick={() => (window.location.href = "/api/admin/auth/google")}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "30px",
              }}
            >
              Continue with Google
            </button>

            <form onSubmit={submit}>
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  style={inputStyle}
                />
              </div>

              <div
                style={{
                  marginBottom: "20px",
                  position: "relative",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  style={inputStyle}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                <input
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Security Code"
                  style={inputStyle}
                />
              </div>

              {error && (
                <div
                  style={{
                    color: "#dc2626",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "18px",
                  border: "none",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  background: "linear-gradient(135deg,#4f46e5,#312e81)",
                  boxShadow: "0 15px 35px rgba(79,70,229,0.35)",
                }}
              >
                {busy ? "Signing in..." : "Access Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

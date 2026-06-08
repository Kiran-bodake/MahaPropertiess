"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signIn("google", { 
        callbackUrl: "/x-admin/dashboard",
        redirect: true 
      });
    } catch (err) {
      setError("Google sign in failed. Please try again.");
    }
  };

  // Email Sign In
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
        {/* LEFT PANEL - Branding */}
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
          </div>

          <h2
            style={{
              color: "#ffffff",
              marginTop: "40px",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            Admin Portal
          </h2>

          <p
            style={{
              color: "#c7d2fe",
              fontSize: "14px",
              marginTop: "10px",
              maxWidth: "280px",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            Manage properties, leads, and analytics from one dashboard
          </p>
        </div>

        {/* RIGHT PANEL - Login Form */}
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

            {/* Google Sign In Button - UPDATED */}
            <button
              onClick={handleGoogleSignIn}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#4f46e5";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>

            {/* Email Login Form */}
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